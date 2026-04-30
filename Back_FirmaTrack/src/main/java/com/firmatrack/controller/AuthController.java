package com.firmatrack.controller;

import com.firmatrack.dto.LoginRequest;
import com.firmatrack.dto.RegisterRequest;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.model.Veterinaire;
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

    // 1. INSCRIPTION (Register)
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        
        // Vérifier si l'email existe déjà
        if (userService.getUserByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé !");
        }

        // Créer l'objet User de base
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        user.setRole(request.getRole());
        user.setTelephone(request.getTelephone());
        
        // Sauvegarder le User
        User savedUser = userService.saveUser(user);

        // Routage selon le rôle
        if ("FERMIER".equalsIgnoreCase(request.getRole())) {
            Fermier f = new Fermier();
            f.setUser(savedUser);
            f.setNomFerme(request.getNomFerme());
            f.setSurfaceFerme(request.getSurfaceFerme());
            fermierService.saveFarmer(f);
            
        } else if ("VETERINAIRE".equalsIgnoreCase(request.getRole())) {
            Veterinaire v = new Veterinaire();
            v.setUser(savedUser);
            v.setNomVet(request.getName());
            v.setSpecialite(request.getSpecialite());
            v.setDiplome(request.getDiplome());
            veterinaireService.saveVeterinaire(v);
            
        } else {
            throw new RuntimeException("Rôle invalide !"); 
        }

        return ResponseEntity.ok("Compte " + request.getRole() + " créé avec succès !");
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
        response.put("nom", user.getName()); // <--- AJOUTE CETTE LIGNE
        // -----------------------------
        return ResponseEntity.ok(response);
    }
}