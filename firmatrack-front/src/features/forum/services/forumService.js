import api from '../../../api/api';

const forumService = {
  getAllPosts: async () => {
    const response = await api.get('/forum/posts');
    return response.data;
  },

  getPostsByCategory: async (categorie) => {
    const response = await api.get(`/forum/posts/categorie/${categorie}`);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/forum/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/forum/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  },

  addComment: async (postId, contenu) => {
    const response = await api.post(`/forum/posts/${postId}/commentaires`, { contenu });
    return response.data;
  },

  validerSolution: async (commentId) => {
    const response = await api.put(`/forum/commentaires/${commentId}/solution`);
    return response.data;
  },

    getCarnetByAnimalId: async (animalId) => {
    const response = await api.get(`/carnetsante/animal/${animalId}`);
    return response.data;
  }
};

export default forumService;