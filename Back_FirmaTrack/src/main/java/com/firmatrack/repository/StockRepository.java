package com.firmatrack.repository;

import com.firmatrack.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {

    // Filtrage par fermier connecté
    List<Stock> findByFermierId(Long fermierId);

    // US 55 : Alerte quantité critique (filtré par fermier)
    @Query("SELECT s FROM Stock s WHERE s.fermier.id = :fermierId AND s.quantite <= s.seuilAlerte")
    List<Stock> findStockCritiqueByFermierId(@Param("fermierId") Long fermierId);

    // Alerte produits périmés (filtré par fermier)
    @Query("SELECT s FROM Stock s WHERE s.fermier.id = :fermierId AND s.dateExpiration <= :today")
    List<Stock> findProduitsPerimesByFermierId(@Param("fermierId") Long fermierId, @Param("today") LocalDate today);

    // Alerte expiration proche (filtré par fermier)
    @Query("SELECT s FROM Stock s WHERE s.fermier.id = :fermierId AND s.dateExpiration BETWEEN :today AND :soon")
    List<Stock> findExpirationProcheByFermierId(@Param("fermierId") Long fermierId, @Param("today") LocalDate today, @Param("soon") LocalDate soon);
}