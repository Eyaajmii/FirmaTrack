package com.firmatrack.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
    public User() {
    	this.createdAt=LocalDateTime.now();
    }
}
