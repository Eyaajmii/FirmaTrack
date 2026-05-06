package com.firmatrack.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="users")
@Getter
@Setter
public class User {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    // role : Fermier / Veterinaire / Admin
    private String role;
    private String telephone;
    private String adresse;
    private LocalDateTime createdAt;
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Fermier fermier;
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Veterinaire Veterinaire;
    public User() {
    	this.createdAt=LocalDateTime.now();
    }
}
