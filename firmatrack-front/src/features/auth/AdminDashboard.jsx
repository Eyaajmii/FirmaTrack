import React, { useState, useEffect, useCallback } from 'react';
import { useToast, ToastContainer } from '../../components/common/Toast';
import authService from './authService';
import forumService from '../forum/services/forumService';

const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '14.5px',
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
  pillSelector: {
    display: 'flex',
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    padding: '3px',
    borderRadius: '10px',
    gap: '3px',
    width: 'fit-content',
    marginBottom: '1.5rem'
  },
  pillBtn: {
    border: 'none',
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '12.2px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontFamily: "'DM Sans', sans-serif",
  },
  kpiCard: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  kpiLabel: {
    fontSize: '10.5px',
    fontWeight: '500',
    color: '#9a9a96',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#1a1a18',
    lineHeight: 1
  },
  kpiUnit: {
    fontSize: '11px',
    color: '#9a9a96',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '10.5px',
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
  btnPrimary: {
    background: '#1a1a18',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s',
    width: 'fit-content'
  },
  btnDangerText: {
    background: 'transparent',
    border: 'none',
    color: '#A32D2D',
    fontWeight: '500',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background 0.15s'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '10px 8px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#9a9a96',
    textAlign: 'left',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '0.5px solid #f1f0ec',
    transition: 'background 0.14s ease'
  },
  td: {
    padding: '11px 8px',
    fontSize: '12.5px',
    color: '#1a1a18',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  modalContent: {
    background: '#fff',
    borderRadius: '14px',
    border: '0.5px solid #e8e7e2',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '380px',
    boxSizing: 'border-box'
  },
  modalHeader: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a18',
    marginBottom: '8px'
  },
  modalMessage: {
    fontSize: '13px',
    color: '#6b6b67',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.5'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
  },
  btnCancel: {
    background: '#f1f0ec',
    color: '#6b6b67',
    border: '0.5px solid #e8e7e2',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif"
  },
  btnConfirm: {
    background: '#A32D2D',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif"
  }
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('FERMIER');
  const [stats, setStats] = useState({ totalFermiers: 0, totalVeterinaires: 0, totalEpidemies: 0 });
  const [posts, setPosts] = useState([]);
  
  const [whitelistFermiers, setWhitelistFermiers] = useState([]);
  const [whitelistVets, setWhitelistVets] = useState([]);

  const [fermierData, setFermierData] = useState({ matriculeApia: '', nomComplet: '' });
  const [vetData, setVetData] = useState({ numeroOrdre: '', nomComplet: '' });

  const [confirmAction, setConfirmAction] = useState({ show: false, message: '', action: null });

  const { toasts, removeToast, toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const resStats = await authService.getAdminStats();
      setStats(resStats);
      
      const resPosts = await forumService.getAllPosts();
      setPosts(resPosts || []);

      const resFermiers = await authService.getFermiersWhitelist();
      setWhitelistFermiers(resFermiers || []);

      const resVets = await authService.getVetsWhitelist();
      setWhitelistVets(resVets || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddFermier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.addFermierWhitelist(fermierData);
      toast.success("Fermier autorisé avec succès !");
      setFermierData({ matriculeApia: '', nomComplet: '' });
      loadData(); 
    } catch (err) { 
      toast.error("Erreur d'autorisation."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleAddVet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.addVetWhitelist(vetData);
      toast.success("Vétérinaire autorisé avec succès !");
      setVetData({ numeroOrdre: '', nomComplet: '' });
      loadData();
    } catch (err) { 
      toast.error("Erreur d'autorisation."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDeleteFermierWhitelist = (matricule) => {
    setConfirmAction({
      show: true,
      message: "Voulez-vous révoquer l'autorisation de ce fermier ?",
      action: async () => {
        try {
          await authService.deleteFermierWhitelist(matricule);
          toast.success("Autorisation révoquée !");
          loadData();
        } catch (err) {
          toast.error("Erreur de révocation.");
        }
      }
    });
  };

  const handleDeleteVetWhitelist = (numero) => {
    setConfirmAction({
      show: true,
      message: "Voulez-vous révoquer l'autorisation de ce vétérinaire ?",
      action: async () => {
        try {
          await authService.deleteVetWhitelist(numero);
          toast.success("Autorisation révoquée !");
          loadData();
        } catch (err) {
          toast.error("Erreur de révocation.");
        }
      }
    });
  };

  const handleDeletePost = (id) => {
    setConfirmAction({
      show: true,
      message: "Voulez-vous vraiment supprimer ce message du forum ?",
      action: async () => {
        try {
          await authService.deletePostAdmin(id);
          toast.success("Sujet de discussion supprimé !");
          loadData();
        } catch (err) { 
          toast.error("Erreur de suppression."); 
        }
      }
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Administration</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Panneau de Contrôle</span>
        </div>

        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
            Panneau d'Administration
          </h1>
          <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
            Gérez la liste blanche de sécurité d'inscription et modérez l'activité de la plateforme.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ ...s.kpiCard, borderTop: '3px solid #3B6D11' }}>
            <span style={s.kpiLabel}>Éleveurs Inscrits</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
              <span style={s.kpiValue}>{stats.totalFermiers}</span>
              <span style={s.kpiUnit}>fermes</span>
            </div>
          </div>
          <div style={{ ...s.kpiCard, borderTop: '3px solid #2563eb' }}>
            <span style={s.kpiLabel}>Experts Agréés</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
              <span style={s.kpiValue}>{stats.totalVeterinaires}</span>
              <span style={s.kpiUnit}>cabinets</span>
            </div>
          </div>
          <div style={{ ...s.kpiCard, borderTop: '3px solid #A32D2D' }}>
            <span style={s.kpiLabel}>Urgences et Épidémies</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
              <span style={{ ...s.kpiValue, color: '#A32D2D' }}>{stats.totalEpidemies}</span>
              <span style={s.kpiUnit}>alertes</span>
            </div>
          </div>
        </div>

        <div style={s.pillSelector}>
          <button 
            onClick={() => setActiveTab('FERMIER')} 
            style={{
              ...s.pillBtn,
              background: activeTab === 'FERMIER' ? '#1a1a18' : 'transparent',
              color: activeTab === 'FERMIER' ? '#fff' : '#9a9a96'
            }}
          >
            Liste Blanche Éleveurs
          </button>
          <button 
            onClick={() => setActiveTab('VETERINAIRE')} 
            style={{
              ...s.pillBtn,
              background: activeTab === 'VETERINAIRE' ? '#1a1a18' : 'transparent',
              color: activeTab === 'VETERINAIRE' ? '#fff' : '#9a9a96'
            }}
          >
            Liste Blanche Vétérinaires
          </button>
          <button 
            onClick={() => setActiveTab('MODERATION')} 
            style={{
              ...s.pillBtn,
              background: activeTab === 'MODERATION' ? '#1a1a18' : 'transparent',
              color: activeTab === 'MODERATION' ? '#fff' : '#9a9a96'
            }}
          >
            Modération Forum
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: activeTab !== 'MODERATION' ? '1fr 1.2fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
          
          {activeTab !== 'MODERATION' && (
            <div style={s.card}>
              {activeTab === 'FERMIER' ? (
                <form onSubmit={handleAddFermier} style={s.form}>
                  <div>
                    <label style={s.label}>Matricule APIA (Clé d'inscription)</label>
                    <input type="text" placeholder="APIA-2026-XXXX" required style={s.input} value={fermierData.matriculeApia} onChange={(e) => setFermierData({...fermierData, matriculeApia: e.target.value})} />
                  </div>
                  <div>
                    <label style={s.label}>Nom Complet de l'Éleveur</label>
                    <input type="text" placeholder="Ex: Firas Taboubi" required style={s.input} value={fermierData.nomComplet} onChange={(e) => setFermierData({...fermierData, nomComplet: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} style={s.btnPrimary}>Autoriser l'Éleveur</button>
                </form>
              ) : (
                <form onSubmit={handleAddVet} style={s.form}>
                  <div>
                    <label style={s.label}>Numéro d'Ordre CNOMVT</label>
                    <input type="text" placeholder="VT-2026-XXXX" required style={s.input} value={vetData.numeroOrdre} onChange={(e) => setVetData({...vetData, numeroOrdre: e.target.value})} />
                  </div>
                  <div>
                    <label style={s.label}>Nom Complet du Vétérinaire</label>
                    <input type="text" placeholder="Ex: Dr Ahmed Ben Ali" required style={s.input} value={vetData.nomComplet} onChange={(e) => setVetData({...vetData, nomComplet: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} style={s.btnPrimary}>Autoriser le Vétérinaire</button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'FERMIER' && (
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={s.cardTitle}>Fermiers autorisés</span>
                <span style={s.badge}>{whitelistFermiers.length} clés</span>
              </div>
              <table style={s.table}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                    <th style={s.th}>Matricule APIA</th>
                    <th style={s.th}>Nom complet</th>
                    <th style={{...s.th, textAlign: 'right'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelistFermiers.map((f, i) => (
                    <tr key={f.matriculeApia || i} style={s.tr}>
                      <td style={{...s.td, fontWeight: '500'}}>{f.matriculeApia}</td>
                      <td style={s.td}>{f.nomComplet}</td>
                      <td style={{...s.td, textAlign: 'right'}}>
                        <button onClick={() => handleDeleteFermierWhitelist(f.matriculeApia)} style={s.btnDangerText}>Révoquer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'VETERINAIRE' && (
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={s.cardTitle}>Vétérinaires autorisés</span>
                <span style={s.badge}>{whitelistVets.length} clés</span>
              </div>
              <table style={s.table}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                    <th style={s.th}>N° d'Ordre</th>
                    <th style={s.th}>Nom complet</th>
                    <th style={{...s.th, textAlign: 'right'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelistVets.map((v, i) => (
                    <tr key={v.numeroOrdre || i} style={s.tr}>
                      <td style={{...s.td, fontWeight: '500'}}>{v.numeroOrdre}</td>
                      <td style={s.td}>{v.nomComplet}</td>
                      <td style={{...s.td, textAlign: 'right'}}>
                        <button onClick={() => handleDeleteVetWhitelist(v.numeroOrdre)} style={s.btnDangerText}>Révoquer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'MODERATION' && (
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={s.cardTitle}>Modération du Forum</span>
                <span style={s.badge}>{posts.length} messages</span>
              </div>
              <table style={s.table}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                    <th style={s.th}>Sujet de discussion</th>
                    <th style={s.th}>Auteur</th>
                    <th style={s.th}>Catégorie</th>
                    <th style={{...s.th, textAlign: 'right'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, i) => (
                    <tr key={post.id || i} style={s.tr}>
                      <td style={{...s.td, fontWeight: '500'}}>{post.titre}</td>
                      <td style={s.td}>{post.auteur?.name || 'Anonyme'}</td>
                      <td style={s.td}>{post.categorie}</td>
                      <td style={{...s.td, textAlign: 'right'}}>
                        <button onClick={() => handleDeletePost(post.id)} style={s.btnDangerText}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {confirmAction.show && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmAction({ show: false, message: '', action: null });
          }}
          style={s.modalBackdrop}
        >
          <div style={s.modalContent}>
            <div style={s.modalHeader}>Confirmer l'action</div>
            <p style={s.modalMessage}>{confirmAction.message}</p>
            <div style={s.modalActions}>
              <button 
                onClick={() => setConfirmAction({ show: false, message: '', action: null })}
                style={s.btnCancel}
              >
                Annuler
              </button>
              <button 
                onClick={async () => {
                  await confirmAction.action();
                  setConfirmAction({ show: false, message: '', action: null });
                }}
                style={s.btnConfirm}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;