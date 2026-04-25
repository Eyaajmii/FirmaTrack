package com.firmatrack.controller;
import com.firmatrack.model.Fermier;
import com.firmatrack.service.FermierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fermier")
@CrossOrigin(origins = "*")
public class FermierController {
	@Autowired
	private FermierService fermierservice;

	@GetMapping
	public List<Fermier> getAllFarmers() {
		return fermierservice.getAllFarmers();
	}

	@PostMapping
	public Fermier createFarmer(@RequestBody Fermier fermier) {
		return fermierservice.saveFarmer(fermier);
	}
	@PutMapping("/{id}")
	public Fermier updateFermier(@PathVariable Long id, @RequestBody Fermier f) {
		f.setId(id);
		return fermierservice.saveFarmer(f);
	}

	@DeleteMapping("/{id}")
	public void deleteFarmer(@PathVariable Long id) {
		fermierservice.deleteFarmer(id);
	}
}