package com.firmatrack.service;

import com.firmatrack.model.ForumComment;
import com.firmatrack.model.ForumPost;
import com.firmatrack.model.User;
import com.firmatrack.repository.ForumCommentRepository;
import com.firmatrack.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ForumService {

    @Autowired private ForumPostRepository postRepo;
    @Autowired private ForumCommentRepository commentRepo;
    @Autowired private FileStorageService fileStorageService; // Ton service de stockage local !

    // 1. CRÉER UN SUJET DE DISCUSSION (US 70 & US 71 avec Photo)
    public ForumPost creerPost(String titre, String contenu, String categorie, MultipartFile image, User auteur) {
        ForumPost post = new ForumPost();
        post.setTitre(titre);
        post.setContenu(contenu);
        post.setCategorie(categorie);
        post.setAuteur(auteur);

        // Si l'utilisateur a joint une photo (US 71)
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image); // Enregistre sur ton PC
            post.setImageUrl(imageUrl); // Enregistre le lien en DB
        }

        return postRepo.save(post);
    }

    // 2. RÉCUPÉRER LES SUJETS TRIÉS PAR DATE (Le fil d'actualité)
    public List<ForumPost> getTousLesPosts() {
        return postRepo.findAllByOrderByCreatedAtDesc();
    }

    // 3. FILTRER LES SUJETS PAR CATÉGORIE (US 70)
    public List<ForumPost> getPostsParCategorie(String categorie) {
        return postRepo.findByCategorieOrderByCreatedAtDesc(categorie);
    }

    // 4. RÉCUPÉRER LES DÉTAILS D'UN POST (Avec ses commentaires)
    public ForumPost getPostById(Long id) {
        return postRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet de discussion introuvable !"));
    }

    // 5. AJOUTER UNE RÉPONSE / COMMENTAIRE
    public ForumComment ajouterCommentaire(Long postId, String contenu, User auteur) {
        ForumPost post = getPostById(postId);

        ForumComment comment = new ForumComment();
        comment.setContenu(contenu);
        comment.setPost(post);
        comment.setAuteur(auteur);

        return commentRepo.save(comment);
    }

    // 6. VALIDER LA MEILLEURE RÉPONSE (US 72)
    @Transactional
    public ForumComment validerSolution(Long commentId, Long userId) {
        ForumComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Commentaire introuvable !"));

        // SÉCURITÉ CRITIQUE : Seul l'auteur de la question d'origine peut valider la solution !
        if (!comment.getPost().getAuteur().getId().equals(userId)) {
            throw new RuntimeException("Action refusée : Vous n'êtes pas l'auteur de cette question !");
        }

        comment.setIsSolution(true);
        return commentRepo.save(comment);
    }
}