package com.firmatrack.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firmatrack.model.Cheptel;
import com.firmatrack.service.CheptelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/cheptel")
@CrossOrigin(origins="*")
public class CheptelController {
	@Autowired
	private CheptelService cheptelservice;
	@GetMapping
    public List<Cheptel> getAllAnimals() {
        return cheptelservice.getAllAnimals();
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
        return cheptelservice.saveAnimal(animal);
    }

    @PutMapping("/{id}")
    public Cheptel updateAnimal(@PathVariable Long id, @RequestBody Cheptel cheptel) {
        cheptel.setId(id);
        return cheptelservice.saveAnimal(cheptel);
    }

    @DeleteMapping("/{id}")
    public void deleteAnimal(@PathVariable Long id) {
    	cheptelservice.deleteAnimal(id);
    }
}