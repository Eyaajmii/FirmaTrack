package com.firmatrack.repository;

import com.firmatrack.model.Depense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepenseRepository extends JpaRepository<Depense, Long> {
    // Trouver toutes les dépenses d'un fermier spécifique
    List<Depense> findByFermierId(Long fermierId);
}