package com.firmatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Medicament;

public interface MedicamentRepository extends JpaRepository<Medicament,Long> {
    //List des medicaments dans un traitement
    List<Medicament> findByTraitementId(Long traitementId);
}
