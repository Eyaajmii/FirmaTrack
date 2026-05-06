package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.firmatrack.model.Lot;

public interface LotRepository extends JpaRepository <Lot,Long> {
	Lot findByNom(String nom);
	List<Lot> findByFermierId(Long fermierId);
}

