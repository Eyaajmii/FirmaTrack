package com.firmatrack.controller;

import com.firmatrack.model.Cheptel;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.service.CheptelService;
import com.firmatrack.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cheptel")
@CrossOrigin(origins = "*")
public class CheptelController {
    @Autowired
    private UserService userService;
    @Autowired
    private CheptelService cheptelservice;

    @GetMapping
    public List<Cheptel> getAllAnimals() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        // ADMIN → voir tout
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return cheptelservice.getAllAnimals();
        }

        // FERMIER → voir seulement ses animaux
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {
            Fermier fermier = user.getFermier();
            return fermier.getCheptels()
                    .stream()
                    .filter(c -> !"ARCHIVED".equalsIgnoreCase(c.getStatut()))
                    .toList();
        }

        throw new RuntimeException("Accès refusé !");
    }
    @GetMapping("/archives")
    public List<Cheptel> getArchivedAnimals() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        // ADMIN → voit toutes les archives
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return cheptelservice.getArchivedAnimals();
        }

        // FERMIER → voit uniquement ses archives
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            Fermier fermier = user.getFermier();

            return fermier.getCheptels()
                    .stream()
                    .filter(c -> "ARCHIVED".equalsIgnoreCase(c.getStatut()))
                    .toList();
        }

        throw new RuntimeException("Accès refusé !");
    }
    @GetMapping("/{id}")
    public Cheptel getAnimalById(@PathVariable Long id) {
        return cheptelservice.getAnimalById(id);
    }

    @GetMapping("/number/{chepnumber}")
    public Cheptel getAnimalByNumber(@PathVariable String chepnumber) {
        return cheptelservice.getAnimalByNumber(chepnumber);
    }

    @GetMapping("/status/{statut}")
    public List<Cheptel> getAnimalsByStatus(@PathVariable String statut) {
        return cheptelservice.getAnimalsByStatus(statut);
    }

    @GetMapping("/lot/{lotId}")
    public List<Cheptel> getAnimalsByLot(@PathVariable Long lotId) {
        return cheptelservice.getAnimalsByLot(lotId);
    }

    @PostMapping
    public Cheptel createAnimal(@RequestBody Cheptel animal) {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        User user = userService.getUserByEmail(email);
        Fermier fermier = user.getFermier();

        if (fermier == null) {
            throw new RuntimeException("Ce user n'est pas un fermier !");
        }
        animal.setFermier(fermier);
        return cheptelservice.saveAnimal(animal);
    }

    @PutMapping("/{id}")
    public Cheptel updateAnimal(@PathVariable Long id, @RequestBody Cheptel cheptel) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        Cheptel existing = cheptelservice.getAnimalById(id);

        if (existing == null) {
            throw new RuntimeException("Animal introuvable !");
        }

        // ADMIN → peut modifier tout
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            cheptel.setId(id);
            return cheptelservice.saveAnimal(cheptel);
        }

        // FERMIER → modifier seulement son animal
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            if (!existing.getFermier().getId().equals(user.getFermier().getId())) {
                throw new RuntimeException("Accès refusé !");
            }

            cheptel.setId(id);
            cheptel.setFermier(user.getFermier());

            return cheptelservice.saveAnimal(cheptel);
        }

        throw new RuntimeException("Accès refusé !");
    }

    @DeleteMapping("/{id}")
    public void deleteAnimal(@PathVariable Long id) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        Cheptel existing = cheptelservice.getAnimalById(id);

        if (existing == null) {
            throw new RuntimeException("Animal introuvable !");
        }

        // ADMIN → delete tout
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            cheptelservice.archiveAnimal(id);
            return;
        }

        // FERMIER → delete son animal seulement
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            if (!existing.getFermier().getId().equals(user.getFermier().getId())) {
                throw new RuntimeException("Accès refusé !");
            }

            cheptelservice.archiveAnimal(id);
            return;
        }

        throw new RuntimeException("Accès refusé !");
    }
    @PutMapping("/restore/{id}")
    public Cheptel restoreAnimal(@PathVariable Long id) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        Cheptel animal = cheptelservice.getAnimalById(id);

        if (animal == null) {
            throw new RuntimeException("Animal introuvable !");
        }

        // ADMIN
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return cheptelservice.restoreAnimal(id);
        }

        // FERMIER
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            if (!animal.getFermier().getId().equals(user.getFermier().getId())) {
                throw new RuntimeException("Accès refusé !");
            }

            return cheptelservice.restoreAnimal(id);
        }

        throw new RuntimeException("Accès refusé !");
    }
}