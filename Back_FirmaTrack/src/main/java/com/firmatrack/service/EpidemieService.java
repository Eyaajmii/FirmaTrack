package com.firmatrack.service;

import com.firmatrack.model.*;
import com.firmatrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EpidemieService {

    @Autowired private EpidemieRepository epidemieRepo;
    @Autowired private FermierRepository fermierRepo; 
    @Autowired private NotificationRepository notificationRepo;

    public List<Epidemie> getAllEpidemies() {
        return epidemieRepo.findAll();
    }

    public List<Epidemie> getEpidemiesByVet(Long vetId) {
        return epidemieRepo.findByVeterinaireIdOrderByDateSignalementDesc(vetId);
    }

 // Sécurité : Si une alerte plante, tout s'annule pour rester propre
    @Transactional 
    public Epidemie signalerEpidemie(Epidemie ep, Veterinaire vet) {
        ep.setVeterinaire(vet);

        // 1. AUTOMATION DES COORDONNÉES GPS DE TUNISIE (US 75)
        String gov = ep.getGouvernorat().toUpperCase();
        switch (gov) {
            case "TUNIS":
                ep.setLatitude(36.8065); ep.setLongitude(10.1815);
                break;
            case "ARIANA":
                ep.setLatitude(36.8625); ep.setLongitude(10.1956);
                break;
            case "BEJA":
                ep.setLatitude(36.7256); ep.setLongitude(9.1817);
                break;
            case "BIZERTE":
                ep.setLatitude(37.2744); ep.setLongitude(9.8739);
                break;
            case "JENDOUBA":
                ep.setLatitude(36.5011); ep.setLongitude(8.7802);
                break;
            default:
                ep.setLatitude(35.6712); ep.setLongitude(10.0989);
                break;
        }

        // Sauvegarder d'abord l'épidémie en base
        Epidemie savedEpidemie = epidemieRepo.save(ep);

        // On cherche tous les fermiers qui habitent dans le même gouvernorat !
        List<Fermier> fermiersRegion = fermierRepo.findAll().stream()
                .filter(f -> f.getLocalisation() != null && f.getLocalisation().equalsIgnoreCase(ep.getGouvernorat()))
                .toList();

        for (Fermier f : fermiersRegion) {
            Notification alerte = new Notification();
            alerte.setTitre(" ALERTE ÉPIDÉMIE : " + ep.getMaladie());
            alerte.setMessage("Le Dr. " + vet.getNomVet() + " a signalé un foyer de " + ep.getMaladie() + " à " + ep.getGouvernorat() + ". Consignes : " + ep.getDescription());
            alerte.setType("SANTE");
            alerte.setLu(false);
            alerte.setFermier(f);
            alerte.setCreatedAt(LocalDateTime.now());

            notificationRepo.save(alerte);
        }
        // --------------------------------------------------

        return savedEpidemie;
    }
}