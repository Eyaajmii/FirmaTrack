package com.firmatrack.service;

import com.firmatrack.dto.ProductionOeufDTO;
import com.firmatrack.model.Cheptel;
import com.firmatrack.model.Lot;
import com.firmatrack.model.ProductionOeuf;
import com.firmatrack.repository.LotRepository;
import com.firmatrack.repository.cheptelRepository;
import com.firmatrack.repository.ProductionOeufRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionOeufService {

    private final ProductionOeufRepository productionOeufRepository;
    private final cheptelRepository cheptelRepository;
    private final LotRepository lotRepository;

    // ── Mapper Entity → DTO ──────────────────────────────────────────
    private ProductionOeufDTO toDTO(ProductionOeuf p) {
        ProductionOeufDTO dto = new ProductionOeufDTO();
        dto.setId(p.getId());
        dto.setDateProduction(p.getDateProduction());
        dto.setQuantiteOeufs(p.getQuantiteOeufs());
        dto.setQualite(p.getQualite());
        dto.setNotes(p.getNotes());

        if (p.getCheptel() != null) {
            dto.setCheptelId(p.getCheptel().getId());
            dto.setCheptelNom(p.getCheptel().getNom());
            dto.setCheptelNumber(p.getCheptel().getChepnumber());
        }
        if (p.getLot() != null) {
            dto.setLotId(p.getLot().getId());
            dto.setLotNom(p.getLot().getNom());
        }
        return dto;
    }

    // ── Mapper DTO → Entity ──────────────────────────────────────────
    private ProductionOeuf toEntity(ProductionOeufDTO dto) {
        ProductionOeuf p = new ProductionOeuf();
        p.setDateProduction(dto.getDateProduction());
        p.setQuantiteOeufs(dto.getQuantiteOeufs());
        p.setQualite(dto.getQualite());
        p.setNotes(dto.getNotes());

        if (dto.getCheptelId() != null) {
            Cheptel cheptel = cheptelRepository.findById(dto.getCheptelId())
                    .orElseThrow(() -> new RuntimeException("Animal introuvable : " + dto.getCheptelId()));
            p.setCheptel(cheptel);
        }
        if (dto.getLotId() != null) {
            Lot lot = lotRepository.findById(dto.getLotId())
                    .orElseThrow(() -> new RuntimeException("Lot introuvable : " + dto.getLotId()));
            p.setLot(lot);
        }
        return p;
    }

    // ── CRUD ──────────────────────────────────────────────────────────
    public List<ProductionOeufDTO> getAll() {
        return productionOeufRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProductionOeufDTO getById(Long id) {
        return productionOeufRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Production introuvable : " + id));
    }

    public ProductionOeufDTO create(ProductionOeufDTO dto) {
        ProductionOeuf saved = productionOeufRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    public ProductionOeufDTO update(Long id, ProductionOeufDTO dto) {
        ProductionOeuf existing = productionOeufRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production introuvable : " + id));
        existing.setDateProduction(dto.getDateProduction());
        existing.setQuantiteOeufs(dto.getQuantiteOeufs());
        existing.setQualite(dto.getQualite());
        existing.setNotes(dto.getNotes());
        return toDTO(productionOeufRepository.save(existing));
    }

    public void delete(Long id) {
        productionOeufRepository.deleteById(id);
    }

    // ── Filtres ───────────────────────────────────────────────────────
    public List<ProductionOeufDTO> getByAnimal(Long cheptelId) {
        return productionOeufRepository.findByCheptelId(cheptelId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ProductionOeufDTO> getByLot(Long lotId) {
        return productionOeufRepository.findByLotId(lotId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
}