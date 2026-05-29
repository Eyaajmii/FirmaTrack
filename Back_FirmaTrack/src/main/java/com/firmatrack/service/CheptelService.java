package com.firmatrack.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.firmatrack.model.Cheptel;
import com.firmatrack.repository.cheptelRepository;

@Service
public class CheptelService {
	@Autowired
	private cheptelRepository cheptelrepository;
	public List<Cheptel> getAllAnimals() {
        return cheptelrepository.findAll();
    }

    public Cheptel getAnimalById(Long id) {
        return cheptelrepository.findById(id).orElse(null);
    }

    public Cheptel getAnimalByNumber(String chepnumber) {
        return cheptelrepository.findByChepnumber(chepnumber);
    }

    public List<Cheptel> getAnimalsByStatus(String statut) {
        return cheptelrepository.findByStatut(statut);
    }

    public List<Cheptel> getAnimalsByLot(Long lotId) {
        return cheptelrepository.findByLotId(lotId);
    }

    public List<Cheptel> getAnimalsByZone(Long zoneId) {
        return cheptelrepository.findByZoneId(zoneId);
    }

    public List<Cheptel> getAnimalsByCategory(Long categoryId) {
        return cheptelrepository.findByCategorieId(categoryId);
    }

    public Cheptel saveAnimal(Cheptel ch) {
        return cheptelrepository.save(ch);
    }

    public void deleteAnimal(Long id) {
    	cheptelrepository.deleteById(id);
    }
}