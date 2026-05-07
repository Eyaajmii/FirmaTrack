import api from '../../../api/api';

const financeService = {
  // US 30 : Ajouter une dépense (L'ID est deviné par le Token au Back)
  addDepense: async (depenseData) => {
    // Ma3adech n-passiw fermierId hna
    const response = await api.post('/finance/depenses', depenseData);
    return response.data;
  },

  // US 31 : Analyse Lait (Le serveur sait qui demande grâce au Token)
  getAnalyseLait: async (prixVente = 1.340) => {
    const response = await api.get(`/finance/analyse/lait?prixVente=${prixVente}`);
    return response.data;
  },

  // US 31 : Analyse Oeufs
  getAnalyseOeufs: async (prixVente = 0.340) => {
    const response = await api.get(`/finance/analyse/oeufs?prixVente=${prixVente}`); 
    return response.data;
  },

  // US 34 : Répartition (Camembert)
  getRepartition: async () => {
    const response = await api.get('/finance/repartition');
    return response.data;
  },

  // Récupérer la liste de toutes mes dépenses (Optionnel ama bahi)
  getMyDepenses: async () => {
    const response = await api.get('/finance/depenses');
    return response.data;
  }
};

export default financeService;