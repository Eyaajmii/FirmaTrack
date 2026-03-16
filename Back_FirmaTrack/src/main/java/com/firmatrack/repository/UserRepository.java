package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.user;

public interface UserRepository extends JpaRepository <user,Long> {
	user findByEmail(String email);
}
