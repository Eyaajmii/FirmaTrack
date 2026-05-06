import api from '../../../api/api';

const financeService = {
  addDepense: async (fermierId, data) => {
    const response = await api.post(`/finance/depenses/${fermierId}`, data);
    return response.data;
  },
  getAnalyseLait: async (fermierId) => {
    const response = await api.get(`/finance/analyse/lait/${fermierId}`);
    return response.data;
  },
  getAnalyseOeufs: async (fermierId) => {
    const response = await api.get(`/finance/analyse/oeufs/${fermierId}`); 
    return response.data;
  },
  getRepartition: async (fermierId) => {
    const response = await api.get(`/finance/repartition/${fermierId}`);
    return response.data;
  }
};

export default financeService;