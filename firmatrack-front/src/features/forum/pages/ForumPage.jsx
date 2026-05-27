import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import forumService from '../services/forumService';

// --- Icônes SVG Pro ---
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconFolder = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconChat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconHeart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconWheat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconDollar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CATEGORIES = [
  { value: 'GENERAL', label: 'Général', icon: <IconChat /> },
  { value: 'SANTE', label: 'Santé Animale', icon: <IconHeart /> },
  { value: 'ALIMENTATION', label: 'Alimentation', icon: <IconWheat /> },
  { value: 'PRIX_MARCHE', label: 'Prix du Marché', icon: <IconDollar /> }
];

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPost, setNewPost] = useState({ titre: '', contenu: '', categorie: 'GENERAL' });
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      let data;
      if (selectedCategory === 'ALL') {
        data = await forumService.getAllPosts();
      } else {
        data = await forumService.getPostsByCategory(selectedCategory);
      }
      setPosts(Array.isArray(data) ? data : []); 
    } catch (err) {
      toast.error("Erreur de chargement du forum.");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('titre', newPost.titre);
      formData.append('contenu', newPost.contenu);
      formData.append('categorie', newPost.categorie);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await forumService.createPost(formData);
      toast.success("Votre question a été publiée !");
      setShowForm(false);
      setNewPost({ titre: '', contenu: '', categorie: 'GENERAL' });
      setImageFile(null);
      loadPosts();
    } catch (err) {
      toast.error("Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />

      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a18', margin: 0, letterSpacing: '-0.5px' }}>Forum d'Entraide</h1>
          <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '4px' }}>Posez vos questions et obtenez des conseils d'experts.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Fermer' : <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IconPlus /> Poser une question</span>}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* BARRE LATÉRALE DES CATÉGORIES */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={() => setSelectedCategory('ALL')}
            style={{ 
              ...styles.categoryBtn, 
              background: selectedCategory === 'ALL' ? '#1a1a18' : 'transparent', 
              color: selectedCategory === 'ALL' ? '#fff' : '#6b6b67',
              fontWeight: selectedCategory === 'ALL' ? '600' : '400'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', opacity: selectedCategory === 'ALL' ? 1 : 0.7 }}><IconFolder /></span>
            Tout voir
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button 
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                style={{ 
                  ...styles.categoryBtn, 
                  background: isSelected ? '#1a1a18' : 'transparent', 
                  color: isSelected ? '#fff' : '#6b6b67',
                  fontWeight: isSelected ? '600' : '400'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', opacity: isSelected ? 1 : 0.7 }}>{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </aside>

        {/* ZONE PRINCIPALE (FORMULAIRE OU LISTE DES POSTS) */}
        <main>
          {showForm ? (
            /* FORMULAIRE DE CRÉATION */
            <div style={styles.mainCard}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1.5rem' }}>Nouvelle question</h3>
              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={styles.label}>Titre de votre question</label>
                  <input type="text" required placeholder="Ex: Ma vache ne mange plus depuis hier" style={styles.input} value={newPost.titre} onChange={(e) => setNewPost({...newPost, titre: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={styles.label}>Catégorie</label>
                    <select style={styles.input} value={newPost.categorie} onChange={(e) => setNewPost({...newPost, categorie: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Joindre une photo (Optionnel)</label>
                    <input type="file" accept="image/*" style={styles.input} onChange={(e) => setImageFile(e.target.files[0])} />
                  </div>
                </div>
                <div>
                  <label style={styles.label}>Description détaillée</label>
                  <textarea required placeholder="Décrivez les symptômes ou votre problème..." style={{ ...styles.input, height: '120px', resize: 'none' }} value={newPost.contenu} onChange={(e) => setNewPost({...newPost, contenu: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Publication en cours...' : 'Publier la question'}
                </button>
              </form>
            </div>
          ) : (
            /* LISTE DES POSTS (FIL D'ACTUALITÉ) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {posts.length > 0 ? (
                posts.map(post => {
                  const resolvedCategory = CATEGORIES.find(c => c.value === post.categorie);
                  return (
                    <div 
                      key={post.id} 
                      onClick={() => navigate(`/forum/posts/${post.id}`)} 
                      style={styles.postCard}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.categoryBadge}>
                          {resolvedCategory ? resolvedCategory.label : post.categorie}
                        </span>
                        <span style={{ fontSize: '11px', color: '#a0a098' }}>
                          Publié le {new Date(post.createdAt).toLocaleDateString()} par <b>{post.auteur?.name || 'Anonyme'}</b>
                        </span>
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '12px 0 6px 0', color: '#1a1a18' }}>{post.titre}</h3>
                      <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.contenu}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div style={styles.emptyContainer}>
                  Aucune question dans cette catégorie pour le moment. Soyez le premier à poser une question !
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  addBtn: { background: '#1a1a18', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center' },
  categoryBtn: { border: 'none', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.12s ease', display: 'flex', alignItems: 'center', gap: '10px' },
  mainCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e8e7e2' },
  postCard: { background: '#fff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e8e7e2', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  categoryBadge: { fontSize: '10px', fontWeight: '700', color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #dcfce7' },
  label: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#a0a098', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #f0f0ee', background: '#f9f9f7', fontSize: '13px', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '14px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: '#1a1a18', color: '#fff', cursor: 'pointer', marginTop: '10px' },
  emptyContainer: { textAlign: 'center', padding: '3rem', border: '1px dashed #e8e7e2', borderRadius: '20px', color: '#a0a098', fontSize: '14px', background: '#fff' }
};

export default ForumPage;