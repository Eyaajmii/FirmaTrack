import api from '../../../api/api';

const forumService = {
  // 1. Récupérer tous les posts (Fil d'actualité)
  getAllPosts: async () => {
    const response = await api.get('/forum/posts');
    return response.data;
  },

  // 2. Filtrer par catégorie (US 70)
  getPostsByCategory: async (categorie) => {
    const response = await api.get(`/forum/posts/categorie/${categorie}`);
    return response.data;
  },

  // 3. Récupérer les détails d'un post (avec ses commentaires)
  getPostById: async (id) => {
    const response = await api.get(`/forum/posts/${id}`);
    return response.data;
  },

  // 4. Créer un post avec option Photo (US 71 - Utilise FormData)
  createPost: async (postData) => {
    const response = await api.post('/forum/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Obligatoire pour envoyer un fichier !
      },
    });
    return response.data;
  },

  // 5. Ajouter un commentaire
  addComment: async (postId, contenu) => {
    const response = await api.post(`/forum/posts/${postId}/commentaires`, { contenu });
    return response.data;
  },

  // 6. Valider la meilleure réponse (US 72)
  validerSolution: async (commentId) => {
    const response = await api.put(`/forum/commentaires/${commentId}/solution`);
    return response.data;
  }
};

export default forumService;