package com.firmatrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.firmatrack.model.Carnetsante;
import com.firmatrack.service.CarnetsanteService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import java.util.*;
@RestController
@RequestMapping("/api/carnetsante")
@CrossOrigin(origins="*")
public class CarnetsanteController {
    @Autowired
	private CarnetsanteService carnetsanteservice;
    @PostMapping
    public ResponseEntity<?> createCarnet(@RequestBody Carnetsante c) {
        try {
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
    @GetMapping("/fermier/{fermierId}")
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
    }
    @GetMapping
    public ResponseEntity<List<Carnetsante>> getAll() {
        return ResponseEntity.ok(carnetsanteservice.getAllCarnets());
    }
}
