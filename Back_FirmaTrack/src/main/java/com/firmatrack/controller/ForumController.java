package com.firmatrack.controller;

import com.firmatrack.model.ForumComment;
import com.firmatrack.model.ForumPost;
import com.firmatrack.model.User;
import com.firmatrack.service.ForumService;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*")
public class ForumController {

    @Autowired private ForumService forumService;
    @Autowired private UserService userService;

    // Fonction utilitaire pour récupérer l'utilisateur connecté via le Token JWT
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Accès refusé : Utilisateur non trouvé !");
        }
        return user;
    }

    // 1. CRÉER UN POST (US 70 & US 71 - Gère l'upload de photo)
    @PostMapping(value = "/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ForumPost> creerPost(
            @RequestParam("titre") String titre,
            @RequestParam("contenu") String contenu,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        User auteur = getCurrentUser();
        ForumPost post = forumService.creerPost(titre, contenu, categorie, image, auteur);
        return ResponseEntity.ok(post);
    }

    // 2. RÉCUPÉRER TOUS LES POSTS (Fil d'actualité)
    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getTousLesPosts() {
        return ResponseEntity.ok(forumService.getTousLesPosts());
    }

    // 3. FILTRER PAR CATÉGORIE (US 70)
    @GetMapping("/posts/categorie/{categorie}")
    public ResponseEntity<List<ForumPost>> getPostsParCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(forumService.getPostsParCategorie(categorie));
    }

    // 4. RÉCUPÉRER LES DÉTAILS D'UN POST
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    // 5. AJOUTER UNE RÉPONSE / COMMENTAIRE
    @PostMapping("/posts/{postId}/commentaires")
    public ResponseEntity<ForumComment> ajouterCommentaire(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload // On récupère le texte sous forme de JSON {"contenu": "..."}
    ) {
        User auteur = getCurrentUser();
        String contenu = payload.get("contenu");
        return ResponseEntity.ok(forumService.ajouterCommentaire(postId, contenu, auteur));
    }

    // 6. VALIDER LA MEILLEURE RÉPONSE (US 72)
    @PutMapping("/commentaires/{commentId}/solution")
    public ResponseEntity<ForumComment> validerSolution(@PathVariable Long commentId) {
        User user = getCurrentUser();
        return ResponseEntity.ok(forumService.validerSolution(commentId, user.getId()));
    }
}