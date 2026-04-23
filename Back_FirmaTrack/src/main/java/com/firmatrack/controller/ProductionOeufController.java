package com.firmatrack.controller;

import com.firmatrack.dto.ProductionOeufDTO;
import com.firmatrack.service.ProductionOeufService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production-oeufs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductionOeufController {

    private final ProductionOeufService service;

    // GET /api/production-oeufs
    @GetMapping
    public List<ProductionOeufDTO> getAll() {
        return service.getAll();
    }

    // GET /api/production-oeufs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProductionOeufDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // POST /api/production-oeufs/ajouter  ← correspond au service frontend
    @PostMapping("/ajouter")
    public ResponseEntity<ProductionOeufDTO> create(@RequestBody ProductionOeufDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    // PUT /api/production-oeufs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProductionOeufDTO> update(@PathVariable Long id, @RequestBody ProductionOeufDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // DELETE /api/production-oeufs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/production-oeufs/animal/{cheptelId}
    @GetMapping("/animal/{cheptelId}")
    public List<ProductionOeufDTO> getByAnimal(@PathVariable Long cheptelId) {
        return service.getByAnimal(cheptelId);
    }

    // GET /api/production-oeufs/lot/{lotId}
    @GetMapping("/lot/{lotId}")
    public List<ProductionOeufDTO> getByLot(@PathVariable Long lotId) {
        return service.getByLot(lotId);
    }
}