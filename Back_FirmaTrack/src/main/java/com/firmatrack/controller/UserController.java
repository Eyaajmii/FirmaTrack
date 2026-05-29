package com.firmatrack.controller;

import com.firmatrack.dto.ProfileDTO;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.model.Veterinaire;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.repository.VeterinaireRepository;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FermierRepository fermierRepo;

    @Autowired
    private VeterinaireRepository vetRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User u) {
        u.setId(id);
        return userService.saveUser(u);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    
    
 // US 62, 63, 64 : RÉCUPÉRER MON PROFIL DYNAMIQUE (Depuis le Token JWT)
    @GetMapping("/profile/me")
    public ResponseEntity<?> getMyProfile() {
        // 1. On récupère le user connecté via son Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        
        if (user == null) {
            return ResponseEntity.status(403).body("Utilisateur non trouvé !");
        }

        // 2. On mappe les données réelles de l'entité vers le DTO plat
        com.firmatrack.dto.ProfileDTO dto = new com.firmatrack.dto.ProfileDTO();
        dto.setName(user.getName());
        dto.setTelephone(user.getTelephone());
        dto.setAdresse(user.getAdresse());

        // Si c'est un Fermier, on récupère ses données de ferme réelles
        if ("FERMIER".equalsIgnoreCase(user.getRole()) && user.getFermier() != null) {
            Fermier f = user.getFermier();
            dto.setNomFerme(f.getNomFerme());
            dto.setSurfaceFerme(f.getSurfaceFerme());
            dto.setLocalisationFerme(f.getLocalisation());
            dto.setDateCreationFerme(f.getDateCreationFerme());
        } 
        // Si c'est un Vétérinaire, on récupère ses données de cabinet réelles
        else if ("VETERINAIRE".equalsIgnoreCase(user.getRole()) && user.getVeterinaire() != null) {
            Veterinaire v = user.getVeterinaire();
            dto.setSpecialite(v.getSpecialite());
            dto.setNomCabinet(v.getNomCabinet());
            dto.setHorairesConsultation(v.getHorairesConsultation());
            dto.setUniversite(v.getUniversite());
            dto.setAnneesExperience(v.getAnneesExperience());
            dto.setDisponibleUrgence(v.getDisponibleUrgence());
            dto.setTarifConsultation(v.getTarifConsultation());
            dto.setMoyenTransport(v.getMoyenTransport());
            dto.setLocalisationCabinet(v.getLocalisation());
        }

        return ResponseEntity.ok(dto); // On renvoie le DTO au Front-end !
    }
    
    // US 62, 63, 64, 65 : MISE À JOUR DU PROFIL VIA LE TOKEN
    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<?> updateMyProfile(@RequestBody ProfileDTO dto) {
        // 1. Validation de la connexion et récupération de l'utilisateur connecté via le Token
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("Utilisateur non authentifié !");
        }
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(403).body("Utilisateur non trouvé !");
        }

        // 2. US 64 : Mise à jour des informations communes (Nom, Téléphone, Adresse)
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getTelephone() != null) user.setTelephone(dto.getTelephone());
        if (dto.getAdresse() != null) user.setAdresse(dto.getAdresse());

        // 3. US 65 : Changement de mot de passe (si saisi dans le formulaire)
        if (dto.getNouveauPassword() != null && !dto.getNouveauPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getNouveauPassword()));
        }
        userService.saveUser(user);

        // 4. US 62 : Mise à jour spécifique de l'Éleveur (Nom de ferme, Surface, Localisation)
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {
            Fermier f = fermierRepo.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Profil fermier introuvable"));
            if (dto.getNomFerme() != null) f.setNomFerme(dto.getNomFerme());
            if (dto.getSurfaceFerme() != null) f.setSurfaceFerme(dto.getSurfaceFerme());
            if (dto.getLocalisationFerme() != null) f.setLocalisation(dto.getLocalisationFerme());
            if (dto.getDateCreationFerme() != null) f.setDateCreationFerme(dto.getDateCreationFerme());
            fermierRepo.save(f);
        } 
        
        // US 63 : Mise à jour spécifique Vétérinaire
        else if ("VETERINAIRE".equalsIgnoreCase(user.getRole())) {
            Veterinaire v = vetRepo.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Profil vétérinaire introuvable"));
            if (dto.getSpecialite() != null) v.setSpecialite(dto.getSpecialite());
            if (dto.getNomCabinet() != null) v.setNomCabinet(dto.getNomCabinet());
            if (dto.getHorairesConsultation() != null) v.setHorairesConsultation(dto.getHorairesConsultation());
            if (dto.getUniversite() != null) v.setUniversite(dto.getUniversite());
            if (dto.getAnneesExperience() != null) v.setAnneesExperience(dto.getAnneesExperience());
            if (dto.getDisponibleUrgence() != null) v.setDisponibleUrgence(dto.getDisponibleUrgence());
            if (dto.getTarifConsultation() != null) v.setTarifConsultation(dto.getTarifConsultation());
            if (dto.getMoyenTransport() != null) v.setMoyenTransport(dto.getMoyenTransport());
            if (dto.getLocalisationCabinet() != null) v.setLocalisation(dto.getLocalisationCabinet());
            vetRepo.save(v);
        }

        return ResponseEntity.ok("Profil mis à jour avec succès !");
    }
}