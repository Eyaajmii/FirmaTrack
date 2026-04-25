package com.firmatrack.repository;

import com.firmatrack.model.ProductionOeuf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductionOeufRepository extends JpaRepository<ProductionOeuf, Long> {

    // Toutes les productions d'un animal
    List<ProductionOeuf> findByCheptelId(Long cheptelId);

    // Toutes les productions d'un lot
    List<ProductionOeuf> findByLotId(Long lotId);

    // Productions entre deux dates
    List<ProductionOeuf> findByDateProductionBetween(LocalDate debut, LocalDate fin);

    // Productions d'un animal entre deux dates
    List<ProductionOeuf> findByCheptelIdAndDateProductionBetween(Long cheptelId, LocalDate debut, LocalDate fin);
}