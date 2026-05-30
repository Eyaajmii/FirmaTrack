package com.firmatrack.config;

import com.firmatrack.model.*;
import com.firmatrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private FermierAutoriseRepository fermierAutoriseRepo;
    @Autowired private VeterinaireAutoriseRepository vetAutoriseRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. CRÉATION AUTOMATIQUE DE L'ADMIN PAR DÉFAUT
        // Les identifiants officiels de connexion : admin@fermatrack.com / admin123
        if (userRepo.findByEmail("admin@fermatrack.com") == null) {
            User admin = new User();
            admin.setName("Admin Système");
            admin.setEmail("admin@fermatrack.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("APPROVED");
            
            userRepo.save(admin);
            System.out.println("Compte ADMINISTRATEUR par défaut créé avec succès !");
            System.out.println("   Email : admin@fermatrack.com");
            System.out.println("   Mdp : admin123");
        }

        
        // 2. Remplissage automatique de la Liste Blanche des Fermiers (APIA)
        if (fermierAutoriseRepo.count() == 0) {
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-0954", "Mohamed aloui"));
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-1122", "Youssef Ajmi"));
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-3344", "Maram Jlassi"));
            System.out.println("Liste blanche des FERMIERS initialisée automatiquement !");
        }

        // 3. Remplissage automatique de la Liste Blanche des Vétérinaires (CNOMVT)
        if (vetAutoriseRepo.count() == 0) {
            vetAutoriseRepo.save(new VeterinaireAutorise("VT-2026-1485", "Dr Ahmed Ben Ali"));
            vetAutoriseRepo.save(new VeterinaireAutorise("VT-2026-9999", "Dr Yassine Kharrat"));
            System.out.println("Liste blanche des VÉTÉRINAIRES initialisée automatiquement !");
        }
    }
}