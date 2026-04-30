package com.firmatrack.repository;

import com.firmatrack.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
    
    // US 55 : Alerte quantité critique
    @Query("SELECT s FROM Stock s WHERE s.quantite <= s.seuilAlerte")
    List<Stock> findStockCritique();

    // NOUVEAU : Alerte produits périmés
    @Query("SELECT s FROM Stock s WHERE s.dateExpiration <= :today")
    List<Stock> findProduitsPerimes(@Param("today") LocalDate today);

    // NOUVEAU : Alerte expiration proche (ex: dans 7 jours)
    @Query("SELECT s FROM Stock s WHERE s.dateExpiration BETWEEN :today AND :soon")
    List<Stock> findExpirationProche(@Param("today") LocalDate today, @Param("soon") LocalDate soon);
}