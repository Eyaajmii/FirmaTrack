// src/features/auth/authService.js
import api from '../../api/api'; // Nasta3mlou l-instance mta3 lebnet

// Fonction pour l'inscription (Register)
const register = async (userData) => {
  // Nasta3mlou api.post mouch axios.post
  // El path ywalli juste '/auth/register' 5ater el Base URL dja fih /api
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Fonction pour la connexion (Login)
const login = async (email, password) => {
  // Nab3thou email w password kima l-back-end yestanna
  const response = await api.post('/auth/login', { email, password });
  console.log("Réponse du serveur :", response.data); // <--- AJOUTE ÇA POUR VOIR

  // Ken el Back-end b3ath Token, nkhabiweh
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

// Fonction pour se déconnecter (Logout)
const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_id');
  localStorage.removeItem("farm_name");
  // Nraja3 l-user lel login
  window.location.href = '/login';
};

// US 62/63/64 : Récupérer mon profil complet
const getMyProfile = async () => {
  // On appelle l'API pour lire le user connecté
  // (Le token est géré automatiquement par les intercepteurs configurés sur l'instance "api")
  const response = await api.get('/users/profile/me'); 
  return response.data;
};

// US 62/63/64/65 : Mettre à jour mon profil
const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMyProfile,
  updateProfile,
};

export default authService;