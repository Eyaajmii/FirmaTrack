package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.LotRepository;
import com.firmatrack.model.Lot;

import java.util.List;

@Service
public class LotService {

    @Autowired
    private LotRepository lotRepository;

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
        lotRepository.deleteById(id);
    }
}