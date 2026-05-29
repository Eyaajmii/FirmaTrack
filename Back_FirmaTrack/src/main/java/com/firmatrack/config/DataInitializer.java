package com.firmatrack.config;

import com.firmatrack.model.FermierAutorise;
import com.firmatrack.model.VeterinaireAutorise;
import com.firmatrack.repository.FermierAutoriseRepository;
import com.firmatrack.repository.VeterinaireAutoriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FermierAutoriseRepository fermierAutoriseRepo;

    @Autowired
    private VeterinaireAutoriseRepository vetAutoriseRepo;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. Remplissage automatique de la Liste Blanche des Fermiers (APIA)
        if (fermierAutoriseRepo.count() == 0) {
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-0954", "Mohamed aloui"));
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-1122", "Youssef Ajmi"));
            fermierAutoriseRepo.save(new FermierAutorise("APIA-2026-3344", "Maram Jlassi"));
            System.out.println("🌱 Liste blanche des FERMIERS initialisée automatiquement !");
        }

        // 2. Remplissage automatique de la Liste Blanche des Vétérinaires (CNOMVT)
        if (vetAutoriseRepo.count() == 0) {
            vetAutoriseRepo.save(new VeterinaireAutorise("VT-2026-1485", "Dr Ahmed Ben Ali"));
            vetAutoriseRepo.save(new VeterinaireAutorise("VT-2026-9999", "Dr Yassine Kharrat"));
            System.out.println("⚕️ Liste blanche des VÉTÉRINAIRES initialisée automatiquement !");
        }
    }
}