package com.firmatrack.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.firmatrack.model.ProductionLait;

public interface ProductionLaitRepository extends JpaRepository<ProductionLait, Long> {

    // Filtrage par fermier connecté (via Cheptel → Fermier)
    @Query("SELECT p FROM ProductionLait p WHERE p.cheptel.fermier.id = :fermierId")
    List<ProductionLait> findByCheptelFermierId(@Param("fermierId") Long fermierId);

    // Pourra servir plus tard pour voir l'évolution d'un animal précis
    List<ProductionLait> findByCheptelId(Long cheptelId);

    // Pourra servir plus tard pour voir l'évolution d'un lot
    List<ProductionLait> findByLotId(Long lotId);
}