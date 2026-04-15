package com.firmatrack.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.firmatrack.model.ProductionLait;

public interface ProductionLaitRepository extends JpaRepository<ProductionLait, Long> {
    
    // Pourra servir plus tard pour voir l'évolution d'un animal précis
    List<ProductionLait> findByCheptelId(Long cheptelId);
    
    // Pourra servir plus tard pour voir l'évolution d'un lot
    List<ProductionLait> findByLotId(Long lotId);
}