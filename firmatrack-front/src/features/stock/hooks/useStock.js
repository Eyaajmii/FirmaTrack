import { useState, useCallback } from 'react';
import { stockService } from '../services/stockService';

export const useStock = () => {
  const [stocks, setStocks] = useState([]);
  const [alertes, setAlertes] = useState({ quantite: [], peremption: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await stockService.getAllStock();
      setStocks(res.data);
    } catch (err) {
      setError("Erreur chargement stock");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlertes = useCallback(async () => {
    try {
      const resQte = await stockService.getAlertesQuantite();
      const resExp = await stockService.getAlertesPeremption();
      setAlertes({ quantite: resQte.data, peremption: resExp.data });
    } catch (err) {
      console.error("Erreur alertes", err);
    }
  }, []);

  const addStock = async (data) => {
    setLoading(true);
    try {
      const res = await stockService.createStock(data);
      setStocks(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError("Erreur lors de l'ajout au stock");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stocks, alertes, loading, error,
    fetchAllStock, fetchAlertes, addStock
  };
};