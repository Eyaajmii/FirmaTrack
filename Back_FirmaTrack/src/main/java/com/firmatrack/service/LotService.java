package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.LotRepository;
import com.firmatrack.model.Lot;
import com.firmatrack.repository.cheptelRepository;
import com.firmatrack.model.Cheptel;

import java.util.List;

@Service
public class LotService {

    @Autowired
    private LotRepository lotRepository;
    @Autowired
    private cheptelRepository cheptelRepository;

    public List<Lot> getAllLots() {
        return lotRepository.findAll();
    }

    public Lot getLotById(Long id) {
        return lotRepository.findById(id).orElse(null);
    }

    public Lot getLotByName(String nom) {
        return lotRepository.findByNom(nom);
    }

    public Lot saveLot(Lot lot) {
        return lotRepository.save(lot);
    }

    public void deleteLot(Long id) {

        Lot lot = lotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lot introuvable"));
        for (Cheptel c : lot.getCheptels()) {
            c.setLot(null);
        }

        lotRepository.delete(lot);
    }
    public Lot createLotWithCheptels(Lot lot, List<Cheptel> cheptels) {

        Lot savedLot = lotRepository.save(lot);

        for (Cheptel c : cheptels) {
            Cheptel existing = cheptelRepository.findById(c.getId())
                .orElseThrow(() -> new RuntimeException("Cheptel introuvable"));

            existing.setLot(savedLot);
            cheptelRepository.save(existing);
        }

        return savedLot;
    }
}
