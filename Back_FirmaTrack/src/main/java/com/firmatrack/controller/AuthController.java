package com.firmatrack.controller;

import com.firmatrack.dto.LoginRequest;
import com.firmatrack.dto.RegisterRequest;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.model.Veterinaire;
import com.firmatrack.repository.FermierAutoriseRepository;
import com.firmatrack.repository.VeterinaireAutoriseRepository;
import com.firmatrack.security.JwtUtil;
import com.firmatrack.service.FermierService;
import com.firmatrack.service.UserService;
import com.firmatrack.service.VeterinaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private FermierService fermierService;

    @Autowired
    private VeterinaireService veterinaireService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Repositories requis pour la sécurité de la liste blanche (US 58)
    @Autowired 
    private VeterinaireAutoriseRepository vetAutoriseRepo;

    @Autowired 
    private FermierAutoriseRepository fermierAutoriseRepo;

    // 1. INSCRIPTION (Register avec automatisation US 58)
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        
        // Vérifier si l'email existe déjà
        if (userService.getUserByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé !");
        }

        // SÉCURITÉ LISTE BLANCHE (US 58 - AUTOMATION SANS ADMIN)
        if ("FERMIER".equalsIgnoreCase(request.getRole())) {
            // Vérification APIA / Patente Agricole
            boolean autorise = fermierAutoriseRepo.existsById(request.getMatriculeApia());
            if (!autorise) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Inscription refusée : Votre Matricule APIA/Patente n'est pas répertorié auprès du Ministère de l'Agriculture !");
            }
        } 
        else if ("VETERINAIRE".equalsIgnoreCase(request.getRole())) {
            // Vérification Numéro d'Ordre CNOMVT (Le champ diplôme est utilisé comme numéro d'ordre)
            boolean autorise = vetAutoriseRepo.existsById(request.getNumeroOrdreVeterinaire());
            if (!autorise) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Inscription refusée : Votre Numéro d'Ordre n'est pas enregistré au tableau de l'Ordre National des Vétérinaires de Tunisie !");
            }
        } else {
            return ResponseEntity.badRequest().body("Inscription refusée : Rôle invalide !");
        }

        // Si présent dans la liste blanche, on crée le compte avec le statut APPROVED immédiatement
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        user.setRole(request.getRole());
        user.setTelephone(request.getTelephone());
        user.setStatus("APPROVED"); // Validé automatiquement !
        
        // Sauvegarder le User
        User savedUser = userService.saveUser(user);

        // Sauvegarde du profil lié
        if ("FERMIER".equalsIgnoreCase(request.getRole())) {
            Fermier f = new Fermier();
            f.setUser(savedUser);
            f.setNomFerme(request.getNomFerme());
            f.setSurfaceFerme(request.getSurfaceFerme());
            f.setMatriculeApia(request.getMatriculeApia()); // Sauvegarde du matricule
            fermierService.saveFarmer(f);
            
        } else {
            Veterinaire v = new Veterinaire();
            v.setUser(savedUser);
            v.setNomVet(request.getName());
            v.setSpecialite(request.getSpecialite());
            v.setDiplome(request.getDiplome());
            v.setNumeroOrdreVeterinaire(request.getNumeroOrdreVeterinaire());// Le matricule professionnel
            veterinaireService.saveVeterinaire(v);
        }

        return ResponseEntity.ok("Compte " + request.getRole() + " créé et validé automatiquement !");
    }

    // 2. CONNEXION (Login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.getUserByEmail(request.getEmail());

        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email introuvable !");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe incorrect !");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Génération du Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        
        // Réponse au Front
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Connexion réussie !");
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("userId", user.getId());
        response.put("nom", user.getName());
        response.put("status", user.getStatus());
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {
            Optional<Fermier> fermier = fermierService.getFermierByUserId(user.getId());
            if (fermier.isPresent()) {                             // ← FIX 2
                response.put("nomFerme", fermier.get().getNomFerme());
            }
        }  
        return ResponseEntity.ok(response);
    }
}