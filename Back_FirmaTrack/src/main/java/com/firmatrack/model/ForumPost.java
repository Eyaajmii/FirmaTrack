package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "forum_posts")
@Getter
@Setter
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT") // Pour permettre des longs messages
    private String contenu;

    // Catégorie : ALIMENTATION, SANTE, PRIX_MARCHE, GENERAL
    private String categorie;

    private String imageUrl; // Optionnel : pour illustrer un problème visuel (US 71)

    private LocalDateTime createdAt;

    // L'auteur du post (Éleveur ou Vétérinaire)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User auteur;

    // Une question peut avoir plusieurs réponses (commentaires)
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ForumComment> commentaires;

    public ForumPost() {
        this.createdAt = LocalDateTime.now();
    }
}