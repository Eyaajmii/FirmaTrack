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

    @Column(columnDefinition = "TEXT") 
    private String contenu;

    private String categorie;

    private String imageUrl; 

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User auteur;
    
    @ManyToOne
    @JoinColumn(name = "cheptel_id") 
    private Cheptel cheptel;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ForumComment> commentaires;

    public ForumPost() {
        this.createdAt = LocalDateTime.now();
    }
}