package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_comments")
@Getter
@Setter
public class ForumComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    private LocalDateTime createdAt;

    // US 72 : Est-ce que cette réponse est la solution acceptée par le fermier ?
    private Boolean isSolution = false;

    // Liaison avec le sujet de discussion principal
    @ManyToOne
    @JoinColumn(name = "post_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ForumPost post;

    // L'auteur de la réponse (L'éleveur ou le vétérinaire expert)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User auteur;

    public ForumComment() {
        this.createdAt = LocalDateTime.now();
    }
}