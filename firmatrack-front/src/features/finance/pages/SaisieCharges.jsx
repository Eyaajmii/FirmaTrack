import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import financeService from '../services/financeService';

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11 3L6 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 10V8M8 6h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SaisieCharges = () => {
  const farmName = localStorage.getItem("farm_name") || "Ma Ferme";
  const [activeTab, setActiveTab] = useState('EAU_ELEC'); 
  const [loading, setLoading] = useState(false);
  const [allDepenses, setAllDepenses] = useState([]); // Pour l'historique

  const navigate = useNavigate();

  // States pour les formulaires
  const [fraisPublics, setFraisPublics] = useState({ eau: '', electricite: '', date: new Date().toISOString().split('T')[0], description: '' });
  const [salaires, setSalaires] = useState({ ouvrier: '', montant: '', typePaiement: 'JOURNALIER', date: new Date().toISOString().split('T')[0], description: '' });
  const [fraisFixes, setFraisFixes] = useState({ categorie: 'SANTE_VETERINAIRE', montant: '', date: new Date().toISOString().split('T')[0], description: '' });

  // Charger l'historique depuis le serveur
  const loadHistory = useCallback(async () => {
    try {
      const data = await financeService.getMyDepenses();
      setAllDepenses(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // --- FILTRES POUR LES TABLEAUX D'HISTORIQUE ---
  const listEauElec = allDepenses.filter(d => d.categorie === 'EAU_ELECTRICITE');
  const listSalaires = allDepenses.filter(d => d.categorie === 'SALAIRE_OUVRIER');
  const listFraisFixes = allDepenses.filter(d => d.categorie !== 'EAU_ELECTRICITE' && d.categorie !== 'SALAIRE_OUVRIER' && d.categorie !== 'ALIMENTATION');

  // --- SOUMISSION US 28 (Eau & Électricité) ---
  const handleFraisPublics = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (fraisPublics.eau) {
        await financeService.addDepense({
          categorie: 'EAU_ELECTRICITE',
          montant: parseFloat(fraisPublics.eau),
          dateDepense: fraisPublics.date,
          description: "Facture Eau" + (fraisPublics.description ? ` - ${fraisPublics.description}` : '')
        });
      }
      if (fraisPublics.electricite) {
        await financeService.addDepense({
          categorie: 'EAU_ELECTRICITE',
          montant: parseFloat(fraisPublics.electricite),
          dateDepense: fraisPublics.date,
          description: "Facture Électricité" + (fraisPublics.description ? ` - ${fraisPublics.description}` : '')
        });
      }
      toast.success("Factures enregistrées !");
      setFraisPublics({ eau: '', electricite: '', date: new Date().toISOString().split('T')[0], description: '' });
      loadHistory();
    } catch (err) { toast.error("Erreur d'enregistrement"); }
    finally { setLoading(false); }
  };

  // --- SOUMISSION US 29 (Salaires) ---
  const handleSalaires = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeService.addDepense({
        categorie: 'SALAIRE_OUVRIER',
        montant: parseFloat(salaires.montant),
        dateDepense: salaires.date,
        description: `Ouvrier: ${salaires.ouvrier} (Type: ${salaires.typePaiement})` + (salaires.description ? ` - ${salaires.description}` : '')
      });
      toast.success("Salaire enregistré !");
      setSalaires({ ouvrier: '', montant: '', typePaiement: 'JOURNALIER', date: new Date().toISOString().split('T')[0], description: '' });
      loadHistory();
    } catch (err) { toast.error("Erreur d'enregistrement"); }
    finally { setLoading(false); }
  };

  // --- SOUMISSION US 30 (Frais Fixes) ---
  const handleFraisFixes = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeService.addDepense({
        categorie: fraisFixes.categorie,
        montant: parseFloat(fraisFixes.montant),
        dateDepense: fraisFixes.date,
        description: fraisFixes.description
      });
      toast.success("Frais fixe enregistré !");
      setFraisFixes({ categorie: 'SANTE_VETERINAIRE', montant: '', date: new Date().toISOString().split('T')[0], description: '' });
      loadHistory();
    } catch (err) { toast.error("Erreur d'enregistrement"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span> {farmName} </span>
          <span>/</span>
          <span>Analyse Financière</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Enregistrer des charges</span>
        </div>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
              Saisie des Charges
            </h1>
            <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
              Enregistrez vos dépenses pour actualiser vos coûts de production.
            </p>
          </div>
          
          <button onClick={() => navigate('/finance')} style={s.btnSecondary}>
            <IconBack /> Retour au tableau de bord
          </button>
        </div>

        {/* ALERTE DÉPENSES (La faza alerte toujours affichée) */}
        <div style={s.alertBanner}>
          <IconInfo />
          <span>
            <strong>Rappel important :</strong> Veillez à saisir la <strong>date exacte</strong> de facturation ou de paiement. Les charges saisies impactent directement le coût de production et le statut de rentabilité du mois concerné.
          </span>
        </div>

        {/* TABS DE NAVIGATION (Pilules cohérentes avec le projet) */}
        <div style={s.tabContainer}>
          <button onClick={() => setActiveTab('EAU_ELEC')} style={{
            ...s.tabBtn,
            background: activeTab === 'EAU_ELEC' ? '#1a1a18' : 'transparent',
            color: activeTab === 'EAU_ELEC' ? '#fff' : '#9a9a96'
          }}>
            Services Publics
          </button>
          <button onClick={() => setActiveTab('SALAIRES')} style={{
            ...s.tabBtn,
            background: activeTab === 'SALAIRES' ? '#1a1a18' : 'transparent',
            color: activeTab === 'SALAIRES' ? '#fff' : '#9a9a96'
          }}>
            Main d'œuvre
          </button>
          <button onClick={() => setActiveTab('FIXES')} style={{
            ...s.tabBtn,
            background: activeTab === 'FIXES' ? '#1a1a18' : 'transparent',
            color: activeTab === 'FIXES' ? '#fff' : '#9a9a96'
          }}>
            Frais Généraux
          </button>
        </div>

        {/* GRILLE PRINCIPALE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1.25rem', alignItems: 'start' }}>
          
          {/* COLONNE GAUCHE : FORMULAIRES */}
          <div style={s.card}>
            
            {/* FORMULAIRE SERVICES PUBLICS */}
            {activeTab === 'EAU_ELEC' && (
              <form onSubmit={handleFraisPublics} style={s.form}>
                <div style={s.grid2Col}>
                  <div>
                    <label style={s.label}>Facture Eau (DT)</label>
                    <input type="number" step="0.001" placeholder="0.000" style={s.input} value={fraisPublics.eau} onChange={(e) => setFraisPublics({...fraisPublics, eau: e.target.value})} />
                  </div>
                  <div>
                    <label style={s.label}>Facture Électricité (DT)</label>
                    <input type="number" step="0.001" placeholder="0.000" style={s.input} value={fraisPublics.electricite} onChange={(e) => setFraisPublics({...fraisPublics, electricite: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Date de facturation</label>
                  <input type="date" style={s.input} value={fraisPublics.date} onChange={(e) => setFraisPublics({...fraisPublics, date: e.target.value})} required />
                </div>
                <div>
                  <label style={s.label}>Note / Description</label>
                  <input type="text" placeholder="Ex: Facture trimestre 1" style={s.input} value={fraisPublics.description} onChange={(e) => setFraisPublics({...fraisPublics, description: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  <IconPlus /> Enregistrer les factures
                </button>
              </form>
            )}

            {/* FORMULAIRE MAIN D'ŒUVRE */}
            {activeTab === 'SALAIRES' && (
              <form onSubmit={handleSalaires} style={s.form}>
                <div style={s.grid2Col}>
                  <div>
                    <label style={s.label}>Nom de l'ouvrier</label>
                    <input type="text" placeholder="Ex: Ahmed" required style={s.input} value={salaires.ouvrier} onChange={(e) => setSalaires({...salaires, ouvrier: e.target.value})} />
                  </div>
                  <div>
                    <label style={s.label}>Type de paiement</label>
                    <select style={s.select} value={salaires.typePaiement} onChange={(e) => setSalaires({...salaires, typePaiement: e.target.value})}>
                      <option value="JOURNALIER">Paiement Journalier</option>
                      <option value="MENSUEL">Salaire Mensuel</option>
                    </select>
                  </div>
                </div>
                <div style={s.grid2Col}>
                  <div>
                    <label style={s.label}>Montant payé (DT)</label>
                    <input type="number" step="0.001" placeholder="0.000" required style={s.input} value={salaires.montant} onChange={(e) => setSalaires({...salaires, montant: e.target.value})} />
                  </div>
                  <div>
                    <label style={s.label}>Date du paiement</label>
                    <input type="date" style={s.input} value={salaires.date} onChange={(e) => setSalaires({...salaires, date: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Note supplémentaire</label>
                  <input type="text" placeholder="Détails du travail..." style={s.input} value={salaires.description} onChange={(e) => setSalaires({...salaires, description: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  <IconPlus /> Enregistrer le paiement
                </button>
              </form>
            )}

            {/* FORMULAIRE FRAIS GÉNÉRAUX */}
            {activeTab === 'FIXES' && (
              <form onSubmit={handleFraisFixes} style={s.form}>
                <div style={s.grid2Col}>
                  <div>
                    <label style={s.label}>Type de frais général</label>
                    <select style={s.select} value={fraisFixes.categorie} onChange={(e) => setFraisFixes({...fraisFixes, categorie: e.target.value})}>
                      <option value="SANTE_VETERINAIRE">Frais Vétérinaires / Médicaments</option>
                      <option value="TRANSPORT">Logistique & Transport</option>
                      <option value="ENTRETIEN_MATERIEL">Entretien & Réparation</option>
                      <option value="AUTRES">Autre charge fixe</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Montant de la facture (DT)</label>
                    <input type="number" step="0.001" placeholder="0.000" required style={s.input} value={fraisFixes.montant} onChange={(e) => setFraisFixes({...fraisFixes, montant: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Date de la dépense</label>
                  <input type="date" style={s.input} value={fraisFixes.date} onChange={(e) => setFraisFixes({...fraisFixes, date: e.target.value})} required />
                </div>
                <div>
                  <label style={s.label}>Détail de la dépense</label>
                  <input type="text" placeholder="Ex: Achat de vaccins" style={s.input} value={fraisFixes.description} onChange={(e) => setFraisFixes({...fraisFixes, description: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  <IconPlus /> Valider le frais fixe
                </button>
              </form>
            )}

          </div>

          {/* COLONNE DROITE : TABLEAU D'HISTORIQUE */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={s.cardTitle}>Historique des enregistrements</span>
              <span style={s.badge}>Aperçu</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Description</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'EAU_ELEC' && (
                  listEauElec.length > 0 ? listEauElec.map((d, i) => (
                    <tr key={d.id || i} style={s.tr}>
                      <td style={s.td}>{d.dateDepense}</td>
                      <td style={s.td}>{d.description}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontWeight: '500', color: '#1a1a18' }}>{d.montant.toFixed(2)} DT</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} style={s.emptyTd}>Aucune facture enregistrée pour ce mois.</td></tr>
                  )
                )}

                {activeTab === 'SALAIRES' && (
                  listSalaires.length > 0 ? listSalaires.map((d, i) => (
                    <tr key={d.id || i} style={s.tr}>
                      <td style={s.td}>{d.dateDepense}</td>
                      <td style={s.td}>{d.description}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontWeight: '500', color: '#1a1a18' }}>{d.montant.toFixed(2)} DT</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} style={s.emptyTd}>Aucun salaire enregistré pour ce mois.</td></tr>
                  )
                )}

                {activeTab === 'FIXES' && (
                  listFraisFixes.length > 0 ? listFraisFixes.map((d, i) => (
                    <tr key={d.id || i} style={s.tr}>
                      <td style={s.td}>{d.dateDepense}</td>
                      <td style={s.td}>
                        {d.description} <span style={s.smallCategory}>{d.categorie?.replace('_', ' ')}</span>
                      </td>
                      <td style={{ ...s.td, textAlign: 'right', fontWeight: '500', color: '#1a1a18' }}>{d.montant.toFixed(2)} DT</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} style={s.emptyTd}>Aucune charge fixe enregistrée pour ce mois.</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

// ── SYSTÈME DE STYLES HARMONISÉ AVEC LE PROJET ──
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
  btnPrimary: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    background: '#1a1a18', color: '#fff', border: 'none',
    padding: '10px 18px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
    width: '100%',
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#EAF3DE', color: '#3B6D11', border: '0.5px solid #3B6D1133',
    padding: '8px 16px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
  },
  tabContainer: {
    display: 'flex',
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    padding: '4px',
    borderRadius: '10px',
    gap: '4px',
    width: 'fit-content',
    marginBottom: '1.25rem',
  },
  tabBtn: {
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontFamily: "'DM Sans', sans-serif",
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '12.5px',
    fontWeight: '500',
    background: '#FAEEDA',
    border: '0.5px solid #d9770633',
    color: '#854F0B',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
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
  },
  td: {
    padding: '11px 8px',
    fontSize: '12.5px',
    color: '#1a1a18',
  },
  emptyTd: {
    padding: '2rem 8px',
    fontSize: '12.5px',
    color: '#9a9a96',
    textAlign: 'center',
  },
  smallCategory: {
    fontSize: '10px',
    background: '#f1f0ec',
    padding: '2px 8px',
    borderRadius: '20px',
    color: '#6b6b67',
    fontWeight: '500',
    marginLeft: '6px',
    border: '0.5px solid #e8e7e2',
    textTransform: 'uppercase',
  }
};

export default SaisieCharges;