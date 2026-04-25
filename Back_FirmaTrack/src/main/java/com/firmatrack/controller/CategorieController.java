package com.firmatrack.controller;

import com.firmatrack.model.Categorie;
import com.firmatrack.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategorieController {
    @Autowired
    private CategorieService catService;

    @GetMapping
    public List<Categorie> getAllCategories() {
        return catService.getAllCategories();
    }

    @PostMapping
    public Categorie createCategory(@RequestBody Categorie cat) {
        return catService.saveCategory(cat);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
    	catService.deleteCategory(id);
    }
}
