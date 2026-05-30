import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import forumService from '../services/forumService';

// --- Icônes SVG Épurées et Cohérentes ---
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px' }}>
    <path d="M13.5 4.5l-7 7-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconStethoscope = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px' }}>
    <path d="M3 2v6a4 4 0 008 0V2M11 5h3.5a1.5 1.5 0 011.5 1.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// Configuration des catégories pour harmoniser les badges de couleur
const CATEGORY_MAP = {
  GENERAL:      { label: 'Général', color: '#2563eb', bg: '#eff6ff' },
  SANTE:        { label: 'Santé Animale', color: '#A32D2D', bg: '#FCEBEB' },
  ALIMENTATION: { label: 'Alimentation', color: '#d97706', bg: '#FAEEDA' },
  PRIX_MARCHE:  { label: 'Prix du Marché', color: '#2a7a4b', bg: '#EAF3DE' }
};

const PostDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('user_id'); 
  const userRole = localStorage.getItem('user_role'); 

  const [post, setPost] = useState(null);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  // Chargement des détails
  const loadPostDetails = useCallback(async () => {
    try {
      const data = await forumService.getPostById(id);
      setPost(data);
    } catch (err) {
      toast.error("Erreur de chargement de la discussion.");
    }
  }, [id]);

  useEffect(() => {
    loadPostDetails();
  }, [loadPostDetails]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!nouveauCommentaire.trim()) return;
    setLoading(true);

    try {
      await forumService.addComment(id, nouveauCommentaire);
      toast.success("Votre réponse a été publiée !");
      setNouveauCommentaire('');
      loadPostDetails(); 
    } catch (err) {
      toast.error("Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSolution = async (commentId) => {
    try {
      await forumService.validerSolution(commentId);
      toast.success("Solution acceptée ! Cette discussion est résolue.");
      loadPostDetails();
    } catch (err) {
      toast.error(err.response?.data || "Erreur de validation.");
    }
  };

  // --- REDIRECTION VERS LE CARNET DE SANTÉ (US 74) ---
  const handleGoToCarnet = async () => {
    setLoading(true);
    try {
      const carnet = await forumService.getCarnetByAnimalId(post.cheptel.id);
      navigate(`/carnetsante/${carnet.id}`);
    } catch (err) {
      toast.error("Cet animal n'a pas encore de carnet de santé créé !");
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f6f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#9a9a96' }}>
        Chargement de la discussion...
      </div>
    );
  }

  const isAuthor = String(post.auteur?.id) === String(currentUserId);
  const canSeeHealthRecord = isAuthor || userRole === 'VETERINAIRE' || userRole === 'ADMIN';

  // Récupération de la couleur du badge de la question
  const categoryConfig = CATEGORY_MAP[post.categorie] || { label: post.categorie, color: '#6b6b67', bg: '#f1f0ec' };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />

      {/* Wrapper de largeur maximale centrée pour un rendu professionnel */}
      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* BOUTON RETOUR */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={() => navigate('/forum')} style={s.btnBack}>
            <IconArrowLeft /> Retour au Forum
          </button>
        </div>

        {/* --- LA QUESTION PRINCIPALE --- */}
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
              ...s.categoryBadge, 
              color: categoryConfig.color, 
              background: categoryConfig.bg,
              border: `0.5px solid ${categoryConfig.color}1a`
            }}>
              {categoryConfig.label}
            </span>
            <span style={{ fontSize: '11px', color: '#9a9a96' }}>
              Publié par <strong style={{ color: '#1a1a18' }}>{post.auteur?.name || 'Anonyme'}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a18', margin: '12px 0', letterSpacing: '-0.3px' }}>
            {post.titre}
          </h1>
          
          <p style={{ fontSize: '13.5px', color: '#6b6b67', lineHeight: '1.6', whiteSpace: 'pre-line', margin: '0 0 1rem 0' }}>
            {post.contenu}
          </p>

          {post.imageUrl && (
            <div style={s.imageContainer}>
              <img src={post.imageUrl} alt="Symptôme animal" style={s.image} />
            </div>
          )}

          {/* --- PARTAGE DU DOSSIER MEDICAL (US 74) --- */}
          {post.cheptel && canSeeHealthRecord && (
            <div style={s.healthShareBox}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3B6D11', display: 'block' }}>
                   Dossier médical partagé : {post.cheptel.nom || 'Animal Anonyme'}
                </span>
                <span style={{ fontSize: '11.5px', color: '#2a7a4b', marginTop: '2px', display: 'block' }}>
                   N° ID unique : <strong>{post.cheptel.chepnumber}</strong> ({post.cheptel.race || 'Race non renseignée'})
                </span>
              </div>
              <button 
                onClick={handleGoToCarnet} 
                disabled={loading}
                style={s.btnConsultRecord}
              >
                {loading ? 'Chargement...' : 'Consulter le carnet'}
              </button>
            </div>
          )}
        </div>

        {/* --- SECTION DES RÉPONSES --- */}
        <div style={s.card}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1.25rem', borderBottom: '0.5px solid #e8e7e2', paddingBottom: '10px', color: '#1a1a18' }}>
            Réponses de la communauté ({post.commentaires?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {post.commentaires && post.commentaires.length > 0 ? post.commentaires.map((comment, i) => {
              const isVerifiedVet = comment.auteur?.role === 'VETERINAIRE' && comment.auteur?.status === 'APPROVED';
              return (
                <div key={comment.id || i} style={{
                  ...s.commentBox,
                  borderLeft: comment.isSolution ? '3px solid #3B6D11' : '0.5px solid #e8e7e2', 
                  background: comment.isSolution ? '#EAF3DE' : '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '500', fontSize: '12.5px', color: '#1a1a18' }}>{comment.auteur?.name}</span>
                      {isVerifiedVet && (
                        <span style={s.vetBadge}>
                          <IconStethoscope /> Vétérinaire Expert
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#9a9a96' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6b6b67', margin: 0, lineHeight: '1.5' }}>{comment.contenu}</p>

                  {isAuthor && !comment.isSolution && (
                    <button 
                      onClick={() => handleAcceptSolution(comment.id)}
                      style={s.btnAcceptSolution}
                    >
                      <IconCheck /> Accepter comme solution
                    </button>
                  )}

                  {comment.isSolution && (
                    <div style={{ marginTop: '10px', fontSize: '11.5px', color: '#3B6D11', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      <IconCheck /> Solution approuvée par l'éleveur
                    </div>
                  )}
                </div>
              );
            }) : (
              <span style={{ fontSize: '12.5px', color: '#9a9a96', textAlign: 'center', display: 'block', padding: '1rem 0' }}>
                Pas encore de réponses. Soyez le premier à donner votre avis !
              </span>
            )}
          </div>
        </div>

        {/* --- FORMULAIRE AJOUT RÉPONSE --- */}
        <div style={s.card}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '1rem', color: '#1a1a18' }}>Votre réponse</h3>
          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea 
              required 
              placeholder="Apportez un conseil, une expérience vécue ou un avis médical..." 
              style={{ ...s.input, height: '100px', resize: 'none' }} 
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loading} style={s.btnSubmitComment}>
                {loading ? 'Publication...' : 'Publier ma réponse'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

// ── SYSTÈME DE STYLES HARMONISÉ ET ÉPURÉ ──
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
  btnBack: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: '#6b6b67',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '12.5px',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'background 0.15s, color 0.15s',
    outline: 'none',
    ':hover': {
      background: '#fff',
      color: '#1a1a18'
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
  imageContainer: {
    marginTop: '1rem',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '0.5px solid #e8e7e2',
    maxWidth: '480px'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  healthShareBox: {
    marginTop: '1.25rem',
    padding: '12px 16px',
    background: '#EAF3DE',
    borderRadius: '10px',
    border: '0.5px solid #3B6D1133',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  btnConsultRecord: {
    background: '#1a1a18',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '11.5px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s',
  },
  commentBox: {
    padding: '1rem',
    borderRadius: '10px',
    border: '0.5px solid #e8e7e2',
    boxSizing: 'border-box'
  },
  vetBadge: {
    background: '#eff6ff',
    color: '#2563eb',
    fontSize: '9.5px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '0.5px solid #2563eb1a',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase'
  },
  btnAcceptSolution: {
    background: 'transparent',
    border: 'none',
    color: '#3B6D11',
    fontWeight: '600',
    fontSize: '11.5px',
    cursor: 'pointer',
    marginTop: '10px',
    padding: '4px 8px',
    borderRadius: '6px',
    background: '#EAF3DE',
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s'
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
  btnSubmitComment: {
    background: '#1a1a18',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s'
  }
};

export default PostDetail;