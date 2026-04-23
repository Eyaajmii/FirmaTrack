package com.firmatrack.Controller;

import com.firmatrack.model.Lot;
import com.firmatrack.service.LotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lots")
@CrossOrigin(origins = "*")
public class LotController {
	    @Autowired
	    private LotService lotService;

	    @GetMapping
	    public List<Lot> getAllLots() {
	        return lotService.getAllLots();
	    }

	    @PostMapping
	    public Lot createLot(@RequestBody Lot lot) {
	        return lotService.saveLot(lot);
	    }

	    @DeleteMapping("/{id}")
	    public void deleteLot(@PathVariable Long id) {
	        lotService.deleteLot(id);
	    }
	}
