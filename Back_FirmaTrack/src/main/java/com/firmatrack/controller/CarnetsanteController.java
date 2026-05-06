package com.firmatrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.firmatrack.model.Carnetsante;
import com.firmatrack.model.Cheptel;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.service.CarnetsanteService;
import com.firmatrack.service.CheptelService;
import com.firmatrack.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;
import java.util.*;
@RestController
@RequestMapping("/api/carnetsante")

@CrossOrigin(origins="*")
public class CarnetsanteController {
    @Autowired
	private CarnetsanteService carnetsanteservice;
    @Autowired
    private UserService userService;
    @Autowired
    private CheptelService cheptelService;
    @PostMapping
    public ResponseEntity<?> createCarnet(@RequestBody Carnetsante c) {

        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.getUserByEmail(email);

            if (!"FERMIER".equalsIgnoreCase(user.getRole()) &&
                !"ADMIN".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Accès refusé !");
            }
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.ok(carnetsanteservice.saveCarnet(c));
            }
            Fermier fermier = user.getFermier();

            if (c.getAnimal() == null || c.getAnimal().getId() == null) {
                return ResponseEntity.badRequest().body("Animal obligatoire !");
            }
            Cheptel animal = cheptelService.getAnimalById(c.getAnimal().getId());

            if (animal == null) {
                return ResponseEntity.badRequest().body("Animal introuvable !");
            }

            if (!animal.getFermier().getId().equals(fermier.getId())) {
                return ResponseEntity.status(403)
                        .body("Tu ne peux créer que pour tes animaux !");
            }

            c.setAnimal(animal);

            Carnetsante saved = carnetsanteservice.saveCarnet(c);
            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarnet(@PathVariable Long id) {
        carnetsanteservice.deleteCarnet(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public Carnetsante updateCarnet(@PathVariable Long id, @RequestBody Carnetsante c){
        c.setId(id);
        return carnetsanteservice.saveCarnet(c);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Carnetsante> getById(@PathVariable Long id) {
        Carnetsante carnet = carnetsanteservice.getCarnetById(id);
        if (carnet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carnet);
    }
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<Carnetsante> getByAnimal(@PathVariable Long animalId) {
        Optional<Carnetsante> carnet = carnetsanteservice.getCarnetByAnimal(animalId);
        return carnet.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    /*@GetMapping("/fermier/{fermierId}")
    public ResponseEntity<List<Carnetsante>> getByFermier(@PathVariable Long fermierId) {
        return ResponseEntity.ok(
            carnetsanteservice.getAllCarnetsByFermier(fermierId)
        );
    }
    @GetMapping("/veterinaire/{veterinaireId}")
    public ResponseEntity<List<Carnetsante>> getByVeterinaire(@PathVariable Long veterinaireId) {
        return ResponseEntity.ok(
            carnetsanteservice.getAllCarnetsByVeterinaire(veterinaireId)
        );
    }*/
    @GetMapping
    public ResponseEntity<?>  getAll() {
    	String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(carnetsanteservice.getAllCarnets());
        }
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            if (user.getFermier() == null) {
                return ResponseEntity.status(403).body("Ce user n'est pas un fermier !");
            }

            return ResponseEntity.ok(
                carnetsanteservice.getAllCarnetsByFermier(user.getFermier().getId())
            );
        }
        if ("VETERINAIRE".equalsIgnoreCase(user.getRole())) {

            return ResponseEntity.ok(
                carnetsanteservice.getAllCarnetsByVeterinaire(user.getVeterinaire().getId())
            );
        }
        return ResponseEntity.status(403).body("Accès refusé !");
    }
}
