package com.firmatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Maladie;

public interface MaladieRepository extends JpaRepository<Maladie, Long> {
    //maladies d’un carnet
    List<Maladie> findByCarnetSanteId(Long carnetId);
    //maladies gérées par un vétérinaire
    List<Maladie> findByVeterinaireId(Long veterinaireId);
    //Rechercher par statut
    List<Maladie> findByStatut(String statut);

}
