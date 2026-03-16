package com.firmatrack.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.firmatrack.model.cheptel;
import com.firmatrack.repository.cheptelRepository;

@Service
public class CheptelService {
	@Autowired
	private cheptelRepository cheptelrepository;
	public List<cheptel> getAllAnimals() {
        return cheptelrepository.findAll();
    }

    public cheptel getAnimalById(Long id) {
        return cheptelrepository.findById(id).orElse(null);
    }

    public cheptel getAnimalByTag(String chepnumber) {
        return cheptelrepository.findByCheptelNumber(chepnumber);
    }

    public List<cheptel> getAnimalsByStatus(String statut) {
        return cheptelrepository.findByStatut(statut);
    }

    public List<cheptel> getAnimalsByLot(Long lotId) {
        return cheptelrepository.findByLotId(lotId);
    }

    public List<cheptel> getAnimalsByZone(Long zoneId) {
        return cheptelrepository.findByZoneId(zoneId);
    }

    public List<cheptel> getAnimalsByCategory(Long categoryId) {
        return cheptelrepository.findByCategoryId(categoryId);
    }

    public cheptel saveAnimal(cheptel ch) {
        return cheptelrepository.save(ch);
    }

    public void deleteAnimal(Long id) {
    	cheptelrepository.deleteById(id);
    }
}
