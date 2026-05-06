package com.firmatrack.service;

import com.firmatrack.model.Medicament;
import com.firmatrack.model.Stock;
import com.firmatrack.model.Traitement;
import com.firmatrack.repository.MedicamentRepository;
import com.firmatrack.repository.TraitementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class MedicamentService {
    @Autowired private MedicamentRepository medicamentRepository;
    @Autowired private TraitementRepository traitementRepository;
    @Autowired private StockService stockService;

    @Transactional(rollbackFor = Exception.class)
    public Medicament ajouterMedicament(Long traitementId, Long stockId, Medicament m) throws Exception {
        Traitement t = traitementRepository.findById(traitementId)
                .orElseThrow(() -> new Exception("Traitement introuvable"));

        // On déduit du stock
        Stock s = stockService.consommerStock(stockId, m.getQuantiteUtilisee());

        m.setTraitement(t);
        m.setStockItem(s);
        return medicamentRepository.save(m);
    }

    @Transactional
    public void deleteMedicament(Long id) {
        medicamentRepository.findById(id).ifPresent(m -> {
            // AVANT de supprimer, on rend la quantité au stock !
            if (m.getStockItem() != null) {
                stockService.retournerAuStock(m.getStockItem().getId(), m.getQuantiteUtilisee());
            }
            medicamentRepository.deleteById(id);
        });
    }

    public Medicament updateMedicament(Long id, Medicament m) {
        Medicament existing = medicamentRepository.findById(id).orElse(null);
        if (existing == null) return null;

        // Note : Pour un TP, on évite de gérer la logique complexe de réajustement 
        // de stock lors de l'UPDATE pour ne pas s'emmêler les pinceaux.
        existing.setDosage(m.getDosage());
        existing.setFrequence(m.getFrequence());
        existing.setVoieAdministration(m.getVoieAdministration());
        return medicamentRepository.save(existing);
    }

    public Medicament getMedicamentById(Long id) { return medicamentRepository.findById(id).orElse(null); }
    public List<Medicament> getAllMedicaments() { return medicamentRepository.findAll(); }
    public List<Medicament> getByTraitement(Long tId) { return medicamentRepository.findByTraitementId(tId); }
}