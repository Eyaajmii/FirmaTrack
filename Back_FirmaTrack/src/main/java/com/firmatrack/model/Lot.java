package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="lots")
@Getter
@Setter
public class Lot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;

    public Lot() {}
}

