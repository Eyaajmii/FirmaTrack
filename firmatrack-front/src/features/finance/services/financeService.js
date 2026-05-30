import api from '../../../api/api';

const financeService = {
  addDepense: async (depenseData) => {
    const response = await api.post('/finance/depenses', depenseData);
    return response.data;
  },

getAnalyseLait: async (prixVente = 1.340, mois) => {
    const response = await api.get(`/finance/analyse/lait?prixVente=${prixVente}&mois=${mois}`);
    return response.data;
  },

  getAnalyseOeufs: async (prixVente = 0.340, mois) => {
    const response = await api.get(`/finance/analyse/oeufs?prixVente=${prixVente}&mois=${mois}`); 
    return response.data;
  },

    getRepartition: async (mois) => {
    const response = await api.get(`/finance/repartition?mois=${mois}`);
    return response.data;
  },

  getMyDepenses: async () => {
    const response = await api.get('/finance/depenses');
    return response.data;
  },
   getEvolutionAlimentation: async () => {
    const response = await api.get('/finance/evolution-alimentation');
    return response.data;
  },
getClassementAnimaux: async (mois) => {
    const response = await api.get(`/finance/analyse/classement-animaux?mois=${mois}`);
    return response.data;
  }

};


export default financeService;