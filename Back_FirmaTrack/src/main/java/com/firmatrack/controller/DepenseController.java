package com.firmatrack.controller;

import com.firmatrack.dto.AnalyseRentabiliteDTO;
import com.firmatrack.model.Depense;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.User;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.service.FinanceService;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
public class DepenseController {

    @Autowired
    private FinanceService financeService;

    @Autowired
    private UserService userService;

    @Autowired
    private FermierRepository fermierRepository; // Injecti el repo mta3 fermier zeda

    private Fermier getCurrentFermier() {
        // 1. Njibou l-email mel Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Njibou el User object
        User user = userService.getUserByEmail(email);
        if (user == null) throw new RuntimeException("Utilisateur non trouvé !");

        // 3. Njibou el Fermier eli marbout b hal User (Houni el faza !)
        return fermierRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil Fermier introuvable pour cet utilisateur !"));
    }
    // US 30 : Ajout d'une dépense (L'ID est récupéré du Token automatiquement)
    @PostMapping("/depenses")
    public ResponseEntity<Depense> addDepense(@RequestBody Depense depense) {
        Fermier fermier = getCurrentFermier();
        return ResponseEntity.ok(financeService.saveDepense(depense, fermier.getId()));
    }

    // Récupérer les dépenses du fermier connecté
    @GetMapping("/depenses")
    public ResponseEntity<List<Depense>> getMyDepenses() {
        Fermier fermier = getCurrentFermier();
        return ResponseEntity.ok(financeService.getDepensesByFermier(fermier.getId()));
    }

    // US 31 : Analyse Lait (ID via Token)
    @GetMapping("/analyse/lait")
    public ResponseEntity<AnalyseRentabiliteDTO> getAnalyseLait(
            @RequestParam(required = false) Double prixVente 
    ) {
        Fermier fermier = getCurrentFermier();
        return ResponseEntity.ok(financeService.calculerAnalyseLait(fermier.getId(), prixVente));
    }

    // US 31 : Analyse Oeufs (ID via Token)
    @GetMapping("/analyse/oeufs")
    public ResponseEntity<AnalyseRentabiliteDTO> getAnalyseOeufs(
            @RequestParam(required = false) Double prixVente
    ) {
        Fermier fermier = getCurrentFermier();
        return ResponseEntity.ok(financeService.calculerAnalyseOeufs(fermier.getId(), prixVente));
    }

    // US 34 : Répartition (ID via Token)
    @GetMapping("/repartition")
    public ResponseEntity<Map<String, Double>> getRepartition() {
        Fermier fermier = getCurrentFermier();
        return ResponseEntity.ok(financeService.getRepartitionDepenses(fermier.getId()));
    }

    @DeleteMapping("/depenses/{id}")
    public ResponseEntity<?> deleteDepense(@PathVariable Long id) {
        // Optionnel : vérifier si la dépense appartient bien au fermier avant de delete
        financeService.deleteDepense(id);
        return ResponseEntity.ok("Dépense supprimée !");
    }
}