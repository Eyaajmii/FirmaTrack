import api from '../../../api/api';

const financeService = {
   // US 27, 28, 29, 30 : Enregistrer une dépense
  addDepense: async (depenseData) => {
    // Note : Le Token JWT s'occupe de dire au serveur qui est le fermier
    const response = await api.post('/finance/depenses', depenseData);
    return response.data;
  },

  // US 31 : Analyse Lait (Le serveur sait qui demande grâce au Token)
getAnalyseLait: async (prixVente = 1.340, mois) => {
    // On passe le prix de vente ET le mois sélectionné dans la requête
    const response = await api.get(`/finance/analyse/lait?prixVente=${prixVente}&mois=${mois}`);
    return response.data;
  },

  getAnalyseOeufs: async (prixVente = 0.340, mois) => {
    const response = await api.get(`/finance/analyse/oeufs?prixVente=${prixVente}&mois=${mois}`); 
    return response.data;
  },

  // US 34 : Répartition (Camembert)
    getRepartition: async (mois) => {
    const response = await api.get(`/finance/repartition?mois=${mois}`);
    return response.data;
  },

  // Récupérer la liste de toutes mes dépenses (Optionnel ama bahi)
  getMyDepenses: async () => {
    const response = await api.get('/finance/depenses');
    return response.data;
  },
   getEvolutionAlimentation: async () => {
    const response = await api.get('/finance/evolution-alimentation');
    return response.data;
  },
  // US 37 : Récupérer le classement des vaches par rentabilité
getClassementAnimaux: async (mois) => {
    // On passe le mois dans l'URL
    const response = await api.get(`/finance/analyse/classement-animaux?mois=${mois}`);
    return response.data;
  }

};


export default financeService;