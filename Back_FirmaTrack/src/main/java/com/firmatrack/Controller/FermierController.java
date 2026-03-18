package com.firmatrack.Controller;
import com.firmatrack.model.fermier;
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
	    public List<fermier> getAllFarmers() {
	        return fermierservice.getAllFarmers();
	    }

	    @PostMapping
	    public fermier createFarmer(@RequestBody fermier fermier) {
	        return fermierservice.saveFarmer(fermier);
	    }

	    @DeleteMapping("/{id}")
	    public void deleteFarmer(@PathVariable Long id) {
	    	fermierservice.deleteFarmer(id);
	    }
	}