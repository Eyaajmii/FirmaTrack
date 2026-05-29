package com.firmatrack.service;

import com.firmatrack.model.Cheptel;
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
    @Autowired private FileStorageService fileStorageService;

    public ForumPost creerPost(String titre, String contenu, String categorie, MultipartFile image, Cheptel cheptel, User auteur) {
        ForumPost post = new ForumPost();
        post.setTitre(titre);
        post.setContenu(contenu);
        post.setCategorie(categorie);
        post.setAuteur(auteur);
        post.setCheptel(cheptel); 

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            post.setImageUrl(imageUrl);
        }

        return postRepo.save(post);
    }
    public List<ForumPost> getTousLesPosts() {
        return postRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<ForumPost> getPostsParCategorie(String categorie) {
        return postRepo.findByCategorieOrderByCreatedAtDesc(categorie);
    }

    public ForumPost getPostById(Long id) {
        return postRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet de discussion introuvable !"));
    }

    public ForumComment ajouterCommentaire(Long postId, String contenu, User auteur) {
        ForumPost post = getPostById(postId);

        ForumComment comment = new ForumComment();
        comment.setContenu(contenu);
        comment.setPost(post);
        comment.setAuteur(auteur);

        return commentRepo.save(comment);
    }

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