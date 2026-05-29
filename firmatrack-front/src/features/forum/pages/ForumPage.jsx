import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import forumService from '../services/forumService';
import api from '../../../api/api';

// --- Icônes SVG Épurées (Coordonnées avec le style global) ---
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconFolder = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M1.5 3.5v9a1 1 0 001 1h11a1 1 0 001-1V5.5a1 1 0 00-1-1H7.5L6 2.5H2.5a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChat = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M14 8a6 6 0 11-12 0 6 6 0 0112 0z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 11.5l-3 2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconHeart = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 13s-5-3-5-6a3 3 0 015.15-2.1L8 5.1l.85-.2A3 3 0 0113 7c0 3-5 6-5 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconWheat = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5v13M11 4.5H7.5a2.5 2.5 0 000 5h1a2.5 2.5 0 010 5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDollar = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5v13M11.5 4H7a3 3 0 000 6h2a3 3 0 010 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CATEGORIES = [
  { value: 'GENERAL', label: 'Général', icon: <IconChat />, color: '#2563eb', bg: '#eff6ff' },
  { value: 'SANTE', label: 'Santé Animale', icon: <IconHeart />, color: '#A32D2D', bg: '#FCEBEB' },
  { value: 'ALIMENTATION', label: 'Alimentation', icon: <IconWheat />, color: '#d97706', bg: '#FAEEDA' },
  { value: 'PRIX_MARCHE', label: 'Prix du Marché', icon: <IconDollar />, color: '#2a7a4b', bg: '#EAF3DE' }
];

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPost, setNewPost] = useState({ titre: '', contenu: '', categorie: 'GENERAL' });
  const [imageFile, setImageFile] = useState(null);

  const [mesAnimaux, setMesAnimaux] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');

  const navigate = useNavigate();

  // Chargement des animaux du cheptel (US 74)
  useEffect(() => {
    const fetchMyAnimals = async () => {
       try {
         const res = await api.get('/cheptel');
         setMesAnimaux(res.data || []);
       } catch (e) {
         console.error("Erreur chargement animaux", e);
       }
    };
    fetchMyAnimals();
  }, []);

  // Chargement des posts
  const loadPosts = useCallback(async () => {
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
  }, [selectedCategory]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
      
      if (selectedAnimalId) {
        formData.append('cheptelId', selectedAnimalId);
      }

      await forumService.createPost(formData);
      setSelectedAnimalId('');
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
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />

      {/* --- MAX-WIDTH WRAPPER --- */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Ferme El Baraka</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Forum d'Entraide</span>
        </div>

        {/* --- HEADER --- */}
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
              Forum d'Entraide
            </h1>
            <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
              Posez vos questions et obtenez des conseils d'experts ou de confrères.
            </p>
          </div>
          
          <button onClick={() => setShowForm(!showForm)} style={showForm ? s.btnCancel : s.btnPrimary}>
            {showForm ? 'Fermer la saisie' : <><IconPlus /> Poser une question</>}
          </button>
        </header>

        {/* --- GRILLE LATÉRALE + ZONE DE CONTENU --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* BARRE LATÉRALE DES CATÉGORIES (Vertical Selector) */}
          <aside style={s.sidebar}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: '#9a9a96', padding: '4px 12px 10px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Catégories
            </div>
            
            <button 
              onClick={() => { setSelectedCategory('ALL'); setShowForm(false); }}
              style={{ 
                ...s.categoryBtn, 
                background: selectedCategory === 'ALL' ? '#faf9f7' : 'transparent', 
                color: selectedCategory === 'ALL' ? '#1a1a18' : '#6b6b67',
                borderLeft: selectedCategory === 'ALL' ? '3px solid #1a1a18' : '3px solid transparent',
                fontWeight: selectedCategory === 'ALL' ? '500' : '400'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: selectedCategory === 'ALL' ? '#1a1a18' : '#9a9a96' }}><IconFolder /></span>
              Tout voir
            </button>

            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button 
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value); setShowForm(false); }}
                  style={{ 
                    ...s.categoryBtn, 
                    background: isSelected ? '#faf9f7' : 'transparent', 
                    color: isSelected ? '#1a1a18' : '#6b6b67',
                    borderLeft: isSelected ? `3px solid ${cat.color}` : '3px solid transparent',
                    fontWeight: isSelected ? '500' : '400'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: isSelected ? cat.color : '#9a9a96' }}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </aside>

          {/* ZONE PRINCIPALE (FORMULAIRE OU LISTE DES POSTS) */}
          <main>
            {showForm ? (
              /* FORMULAIRE DE CRÉATION */
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={s.cardTitle}>Nouvelle question</span>
                  <span style={s.badge}>Publique</span>
                </div>

                <form onSubmit={handleCreatePost} style={s.form}>
                  <div>
                    <label style={s.label}>Titre de votre question</label>
                    <input type="text" required placeholder="Ex: Ma vache ne mange plus depuis hier" style={s.input} value={newPost.titre} onChange={(e) => setNewPost({...newPost, titre: e.target.value})} />
                  </div>

                  {/* --- US 74 : SÉLECTION DE L'ANIMAL --- */}
                  <div>
                    <label style={s.label}>Associer un animal de votre cheptel (Optionnel)</label>
                    <select 
                      style={s.select} 
                      value={selectedAnimalId} 
                      onChange={(e) => setSelectedAnimalId(e.target.value)}
                    >
                      <option value="">-- Aucun animal associé --</option>
                      {mesAnimaux.map(a => (
                        <option key={a.id} value={a.id}>{a.nom || 'Anonyme'} ({a.chepnumber})</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.grid2Col}>
                    <div>
                      <label style={s.label}>Catégorie</label>
                      <select style={s.select} value={newPost.categorie} onChange={(e) => setNewPost({...newPost, categorie: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={s.label}>Joindre une photo (Optionnel)</label>
                      <input type="file" accept="image/*" style={s.fileInput} onChange={(e) => setImageFile(e.target.files[0])} />
                    </div>
                  </div>
                  <div>
                    <label style={s.label}>Description détaillée</label>
                    <textarea required placeholder="Décrivez précisément les symptômes ou les détails de votre question..." style={{ ...s.input, height: '120px', resize: 'none' }} value={newPost.contenu} onChange={(e) => setNewPost({...newPost, contenu: e.target.value})} />
                  </div>
                  
                  <button type="submit" disabled={loading} style={{ ...s.btnPrimary, width: '100%', padding: '12px' }}>
                    {loading ? 'Publication en cours...' : 'Publier la question'}
                  </button>
                </form>
              </div>
            ) : (
              /* LISTE DES POSTS (FIL D'ACTUALITÉ) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {posts.length > 0 ? (
                  posts.map(post => {
                    const resolvedCategory = CATEGORIES.find(c => c.value === post.categorie);
                    const catStyle = resolvedCategory || { color: '#6b6b67', bg: '#f1f0ec' };
                    return (
                      <div 
                        key={post.id} 
                        onClick={() => navigate(`/forum/posts/${post.id}`)} 
                        style={s.postCard}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            ...s.categoryBadge, 
                            color: catStyle.color, 
                            background: catStyle.bg,
                            border: `0.5px solid ${catStyle.color}1a`
                          }}>
                            {resolvedCategory ? resolvedCategory.label : post.categorie}
                          </span>
                          <span style={{ fontSize: '11px', color: '#9a9a96' }}>
                            Publié le {new Date(post.createdAt).toLocaleDateString()} par <strong>{post.auteur?.name || 'Anonyme'}</strong>
                          </span>
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: '500', margin: '12px 0 6px 0', color: '#1a1a18', letterSpacing: '-0.2px' }}>
                          {post.titre}
                        </h3>
                        <p style={{ fontSize: '12.5px', color: '#6b6b67', margin: 0, lineHeight: '1.6', lineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {post.contenu}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div style={s.emptyContainer}>
                    <IconChat />
                    <span style={{ marginTop: '8px' }}>Aucune question dans cette catégorie pour le moment.</span>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};

// ── SYSTÈME DE STYLE DIRECTEMENT ALIGNÉ AVEC LE PROJET ──
const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a18',
  },
  badge: {
    background: '#f1f0ec',
    color: '#6b6b67',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    border: '0.5px solid #e8e7e2',
  },
  sidebar: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '12px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  btnPrimary: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#1a1a18', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
  },
  btnCancel: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #A32D2D33',
    padding: '8px 16px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
  },
  categoryBtn: {
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12.5px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.14s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box'
  },
  postCard: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }
  },
  categoryBadge: {
    fontSize: '10px',
    fontWeight: '500',
    padding: '3px 9px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9a9a96',
    textTransform: 'uppercase',
    marginBottom: '6px',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  fileInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12px',
    color: '#6b6b67',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    border: '1px dashed #e8e7e2',
    borderRadius: '14px',
    color: '#9a9a96',
    fontSize: '13px',
    background: '#fff',
    textAlign: 'center'
  }
};

export default ForumPage;