package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.CategorieRepository;
import com.firmatrack.model.Categorie;
import java.util.List;

@Service
public class CategorieService {
	@Autowired
    private CategorieRepository categoryRepository;

    public List<Categorie> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Categorie getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Categorie getCategoryByName(String nom) {
        return categoryRepository.findByNom(nom);
    }

    public Categorie saveCategory(Categorie c) {
        return categoryRepository.save(c);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}