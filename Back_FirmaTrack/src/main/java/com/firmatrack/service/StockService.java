package com.firmatrack.service;

import com.firmatrack.model.Stock;
import com.firmatrack.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class StockService {
    @Autowired
    private StockRepository stockRepository;

    public List<Stock> getAllStock() { return stockRepository.findAll(); }
    public Stock ajouterIntrant(Stock stock) { return stockRepository.save(stock); }
    public Stock findById(Long id) { return stockRepository.findById(id).orElse(null); }

    // US 52 : Soustraire du stock
    public Stock consommerStock(Long id, Double quantite) throws Exception {
        Stock stock = stockRepository.findById(id)
            .orElseThrow(() -> new Exception("Produit introuvable en stock"));

        if (stock.isPerime()) throw new Exception("Action impossible : " + stock.getNom() + " est périmé !");
        if (stock.getQuantite() < quantite) throw new Exception("Stock insuffisant (Reste: " + stock.getQuantite() + ")");

        stock.setQuantite(stock.getQuantite() - quantite);
        return stockRepository.save(stock);
    }

    // NOUVEAU : Réajuster le stock (en cas de suppression de médicament)
    public void retournerAuStock(Long id, Double quantite) {
        stockRepository.findById(id).ifPresent(stock -> {
            stock.setQuantite(stock.getQuantite() + quantite);
            stockRepository.save(stock);
        });
    }

    public List<Stock> getAlertesQuantite() { return stockRepository.findStockCritique(); }
    public List<Stock> getAlertesPeremption() { return stockRepository.findProduitsPerimes(LocalDate.now()); }
}