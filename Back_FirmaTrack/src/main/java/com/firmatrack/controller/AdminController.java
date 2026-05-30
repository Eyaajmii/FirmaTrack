package com.firmatrack.controller;

import com.firmatrack.model.FermierAutorise;
import com.firmatrack.model.VeterinaireAutorise;
import com.firmatrack.repository.FermierAutoriseRepository;
import com.firmatrack.repository.VeterinaireAutoriseRepository;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.repository.VeterinaireRepository;
import com.firmatrack.repository.EpidemieRepository;
import com.firmatrack.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private FermierAutoriseRepository fermierAutoriseRepo;
    @Autowired private VeterinaireAutoriseRepository vetAutoriseRepo;
    @Autowired private ForumPostRepository forumPostRepo;
    
    @Autowired private FermierRepository fermierRepo;
    @Autowired private VeterinaireRepository vetRepo;
    @Autowired private EpidemieRepository epidemieRepo;

    // 1. AJOUTER UN FERMIER À LA LISTE BLANCHE (US 58)
    @PostMapping("/whitelist/fermier")
    public ResponseEntity<?> ajouterFermierAutorise(@RequestBody FermierAutorise fa) {
        fermierAutoriseRepo.save(fa);
        return ResponseEntity.ok("Fermier " + fa.getNomComplet() + " ajouté à la liste blanche !");
    }

    // 2. AJOUTER UN VÉTÉRINAIRE À LA LISTE BLANCHE (US 58)
    @PostMapping("/whitelist/veterinaire")
    public ResponseEntity<?> ajouterVetAutorise(@RequestBody VeterinaireAutorise va) {
        vetAutoriseRepo.save(va);
        return ResponseEntity.ok("Vétérinaire " + va.getNomComplet() + " ajouté à la liste blanche !");
    }

    // 3. MODÉRATION : SUPPRIMER UN POST DU FORUM (US 78)
    @DeleteMapping("/forum/posts/{id}")
    public ResponseEntity<?> supprimerPost(@PathVariable Long id) {
        forumPostRepo.deleteById(id);
        return ResponseEntity.ok("Message modéré et supprimé du forum avec succès !");
    }

    // 4. STATISTIQUES GLOBALES DU SYSTÈME (KPIs)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getSystemStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalFermiers", fermierRepo.count());
        stats.put("totalVeterinaires", vetRepo.count());
        stats.put("totalEpidemies", epidemieRepo.count());
        return ResponseEntity.ok(stats);
    }
 // 5. RÉCUPÉRER TOUS LES FERMIERS AUTORISÉS (Pour ton tableau Admin)
    @GetMapping("/whitelist/fermiers")
    public ResponseEntity<List<FermierAutorise>> getFermiersAutorises() {
        return ResponseEntity.ok(fermierAutoriseRepo.findAll());
    }

    // 6. RÉCUPÉRER TOUS LES VÉTÉRINAIRES AUTORISÉS
    @GetMapping("/whitelist/veterinaires")
    public ResponseEntity<List<VeterinaireAutorise>> getVetsAutorises() {
        return ResponseEntity.ok(vetAutoriseRepo.findAll());
    }

    // 7. RÉVOQUER / SUPPRIMER UN FERMIER DE LA LISTE BLANCHE
    @DeleteMapping("/whitelist/fermier/{matricule}")
    public ResponseEntity<?> supprimerFermierAutorise(@PathVariable String matricule) {
        fermierAutoriseRepo.deleteById(matricule);
        return ResponseEntity.ok("Matricule Fermier révoqué avec succès !");
    }

    // 8. RÉVOQUER / SUPPRIMER UN VÉTÉRINAIRE DE LA LISTE BLANCHE
    @DeleteMapping("/whitelist/veterinaire/{numero}")
    public ResponseEntity<?> supprimerVetAutorise(@PathVariable String numero) {
        vetAutoriseRepo.deleteById(numero);
        return ResponseEntity.ok("Numéro d'Ordre Vétérinaire révoqué avec succès !");
    }
}