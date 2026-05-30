// src/features/auth/authService.js
import api from '../../api/api'; 

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  console.log("Réponse du serveur :", response.data); 

  if (response.data.token) {
    localStorage.setItem('user_token', response.data.token);
    localStorage.setItem('user_role', response.data.role);
    localStorage.setItem('user_name', response.data.nom);
    localStorage.setItem('user_id', response.data.userId);
    localStorage.setItem('user_status', response.data.status); 
  }
  if (response.data.role === "FERMIER" && response.data.nomFerme) {
    localStorage.setItem("farm_name", response.data.nomFerme);
  } else {
    localStorage.removeItem("farm_name");
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_id');
  localStorage.removeItem("farm_name");
  // Nraja3 l-user lel login
  window.location.href = '/login';
};

const getMyProfile = async () => {
  const response = await api.get('/users/profile/me'); 
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

const addFermierWhitelist = async (data) => {
  const response = await api.post('/admin/whitelist/fermier', data);
  return response.data;
};

const addVetWhitelist = async (data) => {
  const response = await api.post('/admin/whitelist/veterinaire', data);
  return response.data;
};
const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

const deletePostAdmin = async (id) => {
  const response = await api.delete(`/admin/forum/posts/${id}`);
  return response.data;
};

const getFermiersWhitelist = async () => {
  const response = await api.get('/admin/whitelist/fermiers');
  return response.data;
};

const getVetsWhitelist = async () => {
  const response = await api.get('/admin/whitelist/veterinaires');
  return response.data;
};

const deleteFermierWhitelist = async (matricule) => {
  const response = await api.delete(`/admin/whitelist/fermier/${matricule}`);
  return response.data;
};

const deleteVetWhitelist = async (numero) => {
  const response = await api.delete(`/admin/whitelist/veterinaire/${numero}`);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMyProfile,
  updateProfile,
  addFermierWhitelist,
  addVetWhitelist,
  getAdminStats,
  deletePostAdmin,
  getFermiersWhitelist,   
  getVetsWhitelist,       
  deleteFermierWhitelist, 
  deleteVetWhitelist, 
};

export default authService;