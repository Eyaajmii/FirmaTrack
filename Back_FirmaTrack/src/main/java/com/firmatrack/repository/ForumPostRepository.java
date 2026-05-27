package com.firmatrack.repository;

import com.firmatrack.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    // Permet de filtrer par catégorie (US 70)
    List<ForumPost> findByCategorieOrderByCreatedAtDesc(String categorie);
    
    // Récupérer tous les posts triés par date décroissante
    List<ForumPost> findAllByOrderByCreatedAtDesc();
}