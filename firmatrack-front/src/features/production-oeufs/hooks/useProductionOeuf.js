import { useState, useCallback } from 'react';
import { productionOeufService } from '../services/productionOeufService';
import API from '../../../api/api';

// Types d'animaux qui pondent des oeufs
const TYPES_PONDEUSES = ['poule', 'poulet', 'oie', 'canard', 'dinde', 'pintade', 'caille'];

const isPondeuse = (animal) => {
  if (!animal.type) return false;
  return TYPES_PONDEUSES.some(t => animal.type.toLowerCase().includes(t));
};

export const useProductionOeuf = () => {
  const [productions, setProductions] = useState([]);
  const [cheptels, setCheptels]       = useState([]);
  const [lots, setLots]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchAllProductions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productionOeufService.getAllProductions();
      setProductions(res.data);
    } catch (e) {
      setError("Impossible de charger les productions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductionsByAnimal = useCallback(async (cheptelId) => {
    setLoading(true);
    try {
      const res = await productionOeufService.getProductionsByCheptel(cheptelId);
      setProductions(res.data);
    } catch (e) {
      setError("Erreur lors du chargement par animal.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductionsByLot = useCallback(async (lotId) => {
    setLoading(true);
    try {
      const res = await productionOeufService.getProductionsByLot(lotId);
      setProductions(res.data);
    } catch (e) {
      setError("Erreur lors du chargement par lot.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduction = useCallback(async (data) => {
    setLoading(true);
    try {
      await productionOeufService.createProduction(data);
    } catch (e) {
      setError("Erreur lors de l'enregistrement.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduction = useCallback(async (id, data) => {
    setLoading(true);
    try {
      await productionOeufService.updateProduction(id, data);
      await fetchAllProductions();
    } catch (e) {
      setError("Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  }, [fetchAllProductions]);

  const deleteProduction = useCallback(async (id) => {
    setLoading(true);
    try {
      await productionOeufService.deleteProduction(id);
      setProductions(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtre uniquement les pondeuses (poules, oies, canards...)
  const fetchCheptels = useCallback(async () => {
    try {
      const res = await API.get('/cheptel');
      setCheptels(res.data.filter(isPondeuse));
    } catch (e) {
      console.error("Erreur chargement animaux", e);
    }
  }, []);

  const fetchLots = useCallback(async () => {
    try {
      const res = await API.get('/lots');
      setLots(res.data);
    } catch (e) {
      console.error("Erreur chargement lots", e);
    }
  }, []);

  return {
    productions, cheptels, lots,
    loading, error, setError,
    fetchAllProductions,
    fetchProductionsByAnimal,
    fetchProductionsByLot,
    addProduction,
    updateProduction,
    deleteProduction,
    fetchCheptels,
    fetchLots,
  };
};