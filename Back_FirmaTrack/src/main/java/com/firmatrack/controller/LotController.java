package com.firmatrack.controller;

import com.firmatrack.model.*;
import com.firmatrack.repository.cheptelRepository;
import com.firmatrack.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lots")
@CrossOrigin(origins = "*")
public class LotController {

    @Autowired
    private LotService lotService;

    @Autowired
    private UserService userService;
    @Autowired
	private cheptelRepository cheptelrepository;
    @GetMapping
    public List<Lot> getAllLots() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return lotService.getAllLots();
        }

        if ("FERMIER".equalsIgnoreCase(user.getRole())) {
            return lotService.getLotsByFermier(user.getFermier().getId());
        }

        throw new RuntimeException("Accès refusé !");
    }

    @PostMapping
    public Lot createLot(@RequestBody Lot lot) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        if (!"ADMIN".equalsIgnoreCase(user.getRole())
                && !"FERMIER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Accès refusé !");
        }

        lot.setFermier(user.getFermier()); // sécurisation owner
        return lotService.saveLot(lot);
    }

    @PutMapping("/{id}")
    public Lot updateLot(@PathVariable Long id, @RequestBody Lot lot) {

        Lot existing = lotService.getLotById(id);

        existing.setNom(lot.getNom());
        existing.setDescription(lot.getDescription());

        List<Cheptel> newCheptels = cheptelrepository.findAllById(
            lot.getCheptels().stream().map(Cheptel::getId).toList()
        );

        for (Cheptel c : existing.getCheptels()) {
            c.setLot(null);
        }

        for (Cheptel c : newCheptels) {
            c.setLot(existing);
        }

        existing.setCheptels(newCheptels);

        return lotService.saveLot(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteLot(@PathVariable Long id) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        Lot existing = lotService.getLotById(id);

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            lotService.deleteLot(id);
            return;
        }

        if ("FERMIER".equalsIgnoreCase(user.getRole())) {

            if (existing.getFermier() == null ||
                !existing.getFermier().getId().equals(user.getFermier().getId())) {
                throw new RuntimeException("Accès refusé !");
            }

            lotService.deleteLot(id);
            return;
        }

        throw new RuntimeException("Accès refusé !");
    }

    @PostMapping("/with-cheptels")
    public Lot createLotWithCheptels(@RequestBody Lot lot) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        if (!"ADMIN".equalsIgnoreCase(user.getRole())
                && !"FERMIER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Accès refusé !");
        }

        lot.setFermier(user.getFermier());
        return lotService.createLotWithCheptels(lot, lot.getCheptels());
    }
}