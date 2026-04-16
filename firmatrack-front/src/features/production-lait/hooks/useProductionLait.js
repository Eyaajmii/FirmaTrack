import { useState, useCallback } from 'react';
import { productionLaitService } from '../services/productionLaitService';

// On garde un seul import pour Cheptel et on corrige le chemin vers Lot
import * as cheptelService from '../../cheptel/services/CheptelService'; 
import { lotService } from '../../cheptel/Lot/Services/LotService'; 

export const useProductionLait = () => {
  const [productions, setProductions] = useState([]);
  const [cheptels, setCheptels] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger tous les cheptels (animaux)
  const fetchCheptels = useCallback(async () => {
    try {
      const res = await cheptelService.getAllAnimals();
      setCheptels(res.data);
    } catch (err) {
      console.error("Erreur chargement cheptels:", err);
      setError("Impossible de charger les animaux");
    }
  }, []);

  // Charger tous les lots
  const fetchLots = useCallback(async () => {
    try {
      const res = await lotService.getAll();
      setLots(res.data);
    } catch (err) {
      console.error("Erreur chargement lots:", err);
      setError("Impossible de charger les lots");
    }
  }, []);

  // Charger toutes les productions
  const fetchAllProductions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionLaitService.getAllProductions();
      setProductions(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des productions");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduction = async (productionData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionLaitService.createProduction(productionData);
      setProductions(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'ajout";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOUVEAU
  const updateProduction = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionLaitService.updateProduction(id, data);
      // Met à jour uniquement la ligne modifiée dans le state
      setProductions(prev => prev.map(p => p.id === id ? res.data : p));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la mise à jour";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NOUVEAU
  const deleteProduction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productionLaitService.deleteProduction(id);
      // Retire la ligne supprimée du state sans recharger toute la liste
      setProductions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la suppression";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NOUVEAU : Récupérer par Animal
  const fetchProductionsByAnimal = useCallback(async (cheptelId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionLaitService.getProductionsByCheptel(cheptelId);
      setProductions(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des productions de cet animal.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NOUVEAU : Récupérer par Lot
  const fetchProductionsByLot = useCallback(async (lotId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionLaitService.getProductionsByLot(lotId);
      setProductions(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des productions de ce lot.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    productions,
    cheptels,
    lots,
    loading,
    error,
    setError,
    fetchAllProductions,
    fetchCheptels,
    fetchLots,
    addProduction,
    updateProduction,  
    deleteProduction,
    fetchProductionsByAnimal, // N'oublie pas de les exporter ici !
    fetchProductionsByLot,    // N'oublie pas de les exporter ici !
  };
};