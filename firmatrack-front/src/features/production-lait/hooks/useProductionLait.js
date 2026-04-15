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

  return {
    productions,
    cheptels,
    lots,
    loading,
    error,
    fetchAllProductions,
    fetchCheptels,
    fetchLots,
    addProduction,
    setError,
  };
};