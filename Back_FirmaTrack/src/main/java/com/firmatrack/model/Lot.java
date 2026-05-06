package com.firmatrack.model;
import java.util.*;

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
    @OneToMany(mappedBy = "lot")
    private List<Cheptel> cheptels = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "fermier_id")
    private Fermier fermier;
    public Lot() {}
}

