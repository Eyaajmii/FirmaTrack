import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import forumService from '../services/forumService';

// --- Icônes SVG Pro ---
const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconStethoscope = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <path d="M4.8 2.4A4.8 4.8 0 0 1 14.4 2.4V12a4.8 4.8 0 0 1-9.6 0Z" />
    <path d="M14.4 7.2h4.8a2.4 2.4 0 0 1 2.4 2.4v4.8a2.4 2.4 0 0 1-2.4 2.4h-4.8" />
    <path d="M8.4 16.8v3.6M6 21.6h4.8" />
  </svg>
);

const PostDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('user_id'); 

  const [post, setPost] = useState(null);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPostDetails();
  }, [id]);

  const loadPostDetails = async () => {
    try {
      const data = await forumService.getPostById(id);
      setPost(data);
    } catch (err) {
      toast.error("Erreur de chargement de la discussion.");
    }
  };

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

  if (!post) return <div style={{ padding: '3rem', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: '#7a7a74' }}>Chargement...</div>;

  const isAuthor = String(post.auteur?.id) === String(currentUserId);

  return (
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />

      <button onClick={() => navigate('/forum')} style={styles.backBtn}>
        <IconArrowLeft /> Retour au Forum
      </button>

      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* --- LA QUESTION PRINCIPALE --- */}
        <div style={styles.mainCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a098', fontSize: '12px', alignItems: 'center' }}>
            <span style={styles.categoryBadge}>{post.categorie}</span>
            <span style={{ fontSize: '11px', color: '#a0a098' }}>Publié par <b style={{ color: '#1a1a18' }}>{post.auteur?.name}</b></span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a18', margin: '15px 0' }}>{post.titre}</h1>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{post.contenu}</p>

          {post.imageUrl && (
            <div style={styles.imageContainer}>
              <img src={post.imageUrl} alt="Symptôme animal" style={styles.image} />
            </div>
          )}
        </div>

        {/* --- SECTION RÉPONSES --- */}
        <div style={styles.mainCard}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #f0efe9', paddingBottom: '10px', color: '#1a1a18' }}>
            Réponses de la communauté ({post.commentaires?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {post.commentaires && post.commentaires.map(comment => {
              const isVerifiedVet = comment.auteur?.role === 'VETERINAIRE' && comment.auteur?.status === 'APPROVED';
              return (
                <div key={comment.id} style={{
                  ...styles.commentBox,
                  borderLeft: comment.isSolution ? '4px solid #16a34a' : '1px solid #e8e7e2', 
                  background: comment.isSolution ? '#f0fdf4' : '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a18' }}>{comment.auteur?.name}</span>
                      {isVerifiedVet && (
                        <span style={styles.vetBadge}>
                          <IconStethoscope /> Expert Vérifié
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#a0a098' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#4b5563', margin: 0 }}>{comment.contenu}</p>

                  {isAuthor && !comment.isSolution && (
                    <button 
                      onClick={() => handleAcceptSolution(comment.id)}
                      style={styles.solutionBtn}
                    >
                      <IconCheck /> Accepter comme solution
                    </button>
                  )}

                  {comment.isSolution && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                      <IconCheck /> Solution acceptée par l'auteur
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- FORMULAIRE AJOUT RÉPONSE --- */}
        <div style={styles.mainCard}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1rem', color: '#1a1a18' }}>Votre réponse</h3>
          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea 
              required 
              placeholder="Apportez votre conseil ou votre avis médical..." 
              style={{ ...styles.input, height: '100px', resize: 'none' }} 
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
            />
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Publication...' : 'Publier ma réponse'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

const styles = {
  backBtn: { display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#1a1a18', fontWeight: '700', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '14px', padding: 0 },
  mainCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e8e7e2' },
  categoryBadge: { fontSize: '10px', fontWeight: '700', color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #dcfce7' },
  imageContainer: { marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e8e7e2', maxWidth: '500px' },
  image: { width: '100%', height: 'auto', display: 'block' },
  commentBox: { padding: '1.25rem', borderRadius: '16px', border: '1px solid #e8e7e2' },
  vetBadge: { background: '#eff6ff', color: '#2563eb', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center' },
  solutionBtn: { background: 'none', border: 'none', color: '#16a34a', fontWeight: '700', fontSize: '12px', cursor: 'pointer', marginTop: '12px', padding: 0, display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #f0f0ee', background: '#f9f9f7', fontSize: '13px', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '12px', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', background: '#1a1a18', color: '#fff', cursor: 'pointer', alignSelf: 'flex-end', width: '180px' }
};

export default PostDetail;