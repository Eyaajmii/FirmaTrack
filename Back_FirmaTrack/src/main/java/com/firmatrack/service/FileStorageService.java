package com.firmatrack.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // On récupère la valeur de ton application.properties !
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        try {
            // Créer le dossier s'il n'existe pas
            Path pathDir = Paths.get(uploadDir);
            if (!Files.exists(pathDir)) {
                Files.createDirectories(pathDir);
            }

            // Donner un nom unique au fichier (ex: 3f8a2b1c-vache.jpg)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = pathDir.resolve(fileName);

            // Enregistrer le fichier physiquement
            Files.copy(file.getInputStream(), targetLocation);

            // Retourner l'URL pour React (ex: http://localhost:8888/uploads/nom-fichier.jpg)
            return "http://localhost:8888/uploads/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Impossible d'enregistrer le fichier. Veuillez réessayer !", ex);
        }
    }
}