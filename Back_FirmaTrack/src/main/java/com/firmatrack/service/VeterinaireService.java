package com.firmatrack.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Veterinaire;
import com.firmatrack.repository.VeterinaireRepository;

@Service
public class VeterinaireService {
    @Autowired
    private VeterinaireRepository veterinaireRepository;

    public Veterinaire saveVeterinaire(Veterinaire v) {
        return veterinaireRepository.save(v);
    }
    public void deleteVeterinaire(Long id) {
        veterinaireRepository.deleteById(id);
    }
    public Veterinaire getById(Long id) {
        return veterinaireRepository.findById(id).orElse(null);
    }
    public List<Veterinaire> getAll() {
        return veterinaireRepository.findAll();
    }
    public List<Veterinaire> getBySpecialite(String specialite) {
        return veterinaireRepository.findBySpecialite(specialite);
    }
    public List<Veterinaire> getUrgence() {
        return veterinaireRepository.findByDisponibleUrgenceTrue();
    }
    public List<Veterinaire> getDeplacementFerme() {
        return veterinaireRepository.findByDeplacementFermeTrue();
    }
    //formule Haversine (distance GPS).
    private double calculDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double R = 6371; // rayon terre en km

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2)
                * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
    public List<Veterinaire> getProches(
            Double lat,
            Double lng,
            Double rayonKm) {

        return veterinaireRepository.findAll()
                .stream()
                .filter(v -> v.getLatitude() != null
                        && v.getLongitude() != null)
                .filter(v -> {

                    double distance = calculDistance(
                            lat,
                            lng,
                            v.getLatitude(),
                            v.getLongitude()
                    );

                    System.out.println(
                            v.getNomVet() + " => " + distance + " km"
                    );

                    return distance <= rayonKm;
                })
                .collect(Collectors.toList());
    }
    
    
}