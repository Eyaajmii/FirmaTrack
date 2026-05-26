import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import financeService from '../services/financeService';

const SaisieCharges = () => {
  const [activeTab, setActiveTab] = useState('EAU_ELEC'); 
  const [loading, setLoading] = useState(false);
  const [allDepenses, setAllDepenses] = useState([]); // Pour l'historique

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

  // --- FILTRES POUR LES TABLEAUX D'HISTORIQUE (RÉTABLIS SUR SALAIRE_OUVRIER) ---
  const listEauElec = allDepenses.filter(d => d.categorie === 'EAU_ELECTRICITE');
  const listSalaires = allDepenses.filter(d => d.categorie === 'SALAIRE_OUVRIER');
  const listFraisFixes = allDepenses.filter(d => d.categorie !== 'EAU_ELECTRICITE' && d.categorie !== 'SALAIRE_OUVRIER' && d.categorie !== 'ALIMENTATION');

  // --- SOUMISSION US 28 (Eau & Électricité par Date) ---
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
      loadHistory(); // Rafraîchir le tableau
    } catch (err) { toast.error("Erreur d'enregistrement"); }
    finally { setLoading(false); }
  };

  // --- SOUMISSION US 29 (Salaires : Journalier / Mensuel - RÉTABLI) ---
  const handleSalaires = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeService.addDepense({
        categorie: 'SALAIRE_OUVRIER', // Rétabli sur l'enum correct du backend
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
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a18' }}>Enregistrement des Charges</h1>
        <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '4px' }}>Saisissez et gérez vos dépenses de manière structurée.</p>
      </header>

      {/* TABS COMPTABLES */}
      <div style={styles.tabContainer}>
        <button onClick={() => setActiveTab('EAU_ELEC')} style={{...styles.tabBtn, borderBottom: activeTab === 'EAU_ELEC' ? '2px solid #1a1a18' : 'none', color: activeTab === 'EAU_ELEC' ? '#1a1a18' : '#a0a098'}}>
          Services Publics
        </button>
        <button onClick={() => setActiveTab('SALAIRES')} style={{...styles.tabBtn, borderBottom: activeTab === 'SALAIRES' ? '2px solid #1a1a18' : 'none', color: activeTab === 'SALAIRES' ? '#1a1a18' : '#a0a098'}}>
          Main d'œuvre
        </button>
        <button onClick={() => setActiveTab('FIXES')} style={{...styles.tabBtn, borderBottom: activeTab === 'FIXES' ? '2px solid #1a1a18' : 'none', color: activeTab === 'FIXES' ? '#1a1a18' : '#a0a098'}}>
          Frais Généraux
        </button>
      </div>

      {/* GRILLE : FORMULAIRE À GAUCHE, TABLEAU À DROITE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* COLONNE FORMULAIRE */}
        <div style={styles.formCard}>
          
          {/* FORMULAIRE US 28 (EAU / ELEC) */}
          {activeTab === 'EAU_ELEC' && (
            <form onSubmit={handleFraisPublics} style={styles.form}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Facture Eau (DT)</label>
                  <input type="number" step="0.001" placeholder="0.000" style={styles.input} value={fraisPublics.eau} onChange={(e) => setFraisPublics({...fraisPublics, eau: e.target.value})} />
                </div>
                <div>
                  <label style={styles.label}>Facture Électricité (DT)</label>
                  <input type="number" step="0.001" placeholder="0.000" style={styles.input} value={fraisPublics.electricite} onChange={(e) => setFraisPublics({...fraisPublics, electricite: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Date de facturation (US 28)</label>
                <input type="date" style={styles.input} value={fraisPublics.date} onChange={(e) => setFraisPublics({...fraisPublics, date: e.target.value})} required />
              </div>
              <div>
                <label style={styles.label}>Note / Description</label>
                <input type="text" placeholder="Ex: Facture trimestre 1" style={styles.input} value={fraisPublics.description} onChange={(e) => setFraisPublics({...fraisPublics, description: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} style={styles.submitBtn}>Enregistrer les factures</button>
            </form>
          )}

          {/* FORMULAIRE US 29 (SALAIRES) */}
          {activeTab === 'SALAIRES' && (
            <form onSubmit={handleSalaires} style={styles.form}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Nom de l'ouvrier</label>
                  <input type="text" placeholder="Ex: Ahmed" required style={styles.input} value={salaires.ouvrier} onChange={(e) => setSalaires({...salaires, ouvrier: e.target.value})} />
                </div>
                <div>
                  <label style={styles.label}>Type de paiement (US 29)</label>
                  <select style={styles.input} value={salaires.typePaiement} onChange={(e) => setSalaires({...salaires, typePaiement: e.target.value})}>
                    <option value="JOURNALIER">Paiement Journalier</option>
                    <option value="MENSUEL">Salaire Mensuel</option>
                  </select>
                </div>
              </div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Montant payé (DT)</label>
                  <input type="number" step="0.001" placeholder="0.000" required style={styles.input} value={salaires.montant} onChange={(e) => setSalaires({...salaires, montant: e.target.value})} />
                </div>
                <div>
                  <label style={styles.label}>Date du paiement</label>
                  <input type="date" style={styles.input} value={salaires.date} onChange={(e) => setSalaires({...salaires, date: e.target.value})} required />
                </div>
              </div>
              <div>
                <label style={styles.label}>Note supplémentaire</label>
                <input type="text" placeholder="Détails..." style={styles.input} value={salaires.description} onChange={(e) => setSalaires({...salaires, description: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} style={styles.submitBtn}>Enregistrer le paiement</button>
            </form>
          )}

          {/* FORMULAIRE US 30 (FRAIS GENERAUX) */}
          {activeTab === 'FIXES' && (
            <form onSubmit={handleFraisFixes} style={styles.form}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Type de frais fixe</label>
                  <select style={styles.input} value={fraisFixes.categorie} onChange={(e) => setFraisFixes({...fraisFixes, categorie: e.target.value})}>
                    <option value="SANTE_VETERINAIRE">Frais Vétérinaires / Médicaments</option>
                    <option value="TRANSPORT">Logistique & Transport</option>
                    <option value="ENTRETIEN_MATERIEL">Entretien & Réparation</option>
                    <option value="AUTRES">Autre charge fixe</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Montant de la facture (DT)</label>
                  <input type="number" step="0.001" placeholder="0.000" required style={styles.input} value={fraisFixes.montant} onChange={(e) => setFraisFixes({...fraisFixes, montant: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Date de la dépense</label>
                <input type="date" style={styles.input} value={fraisFixes.date} onChange={(e) => setFraisFixes({...fraisFixes, date: e.target.value})} required />
              </div>
              <div>
                <label style={styles.label}>Détail (ex: Achat de vaccins / Vidange tracteur)</label>
                <input type="text" placeholder="Description..." style={styles.input} value={fraisFixes.description} onChange={(e) => setFraisFixes({...fraisFixes, description: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} style={styles.submitBtn}>Valider le frais fixe</button>
            </form>
          )}

        </div>

        {/* COLONNE TABLEAU D'HISTORIQUE */}
        <div style={styles.tableCard}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1.25rem', color: '#1a1a18' }}>
            Historique des enregistrements
          </h3>

          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {/* Rendu dynamique du tableau selon le tab actif */}
              {activeTab === 'EAU_ELEC' && listEauElec.map(d => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.td}>{d.dateDepense}</td>
                  <td style={styles.td}>{d.description}</td>
                  <td style={{...styles.td, fontWeight: '700'}}>{d.montant.toFixed(2)} DT</td>
                </tr>
              ))}

              {activeTab === 'SALAIRES' && listSalaires.map(d => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.td}>{d.dateDepense}</td>
                  <td style={styles.td}>{d.description}</td>
                  <td style={{...styles.td, fontWeight: '700'}}>{d.montant.toFixed(2)} DT</td>
                </tr>
              ))}

              {activeTab === 'FIXES' && listFraisFixes.map(d => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.td}>{d.dateDepense}</td>
                  <td style={styles.td}>{d.description} <span style={styles.smallCategory}>{d.categorie}</span></td>
                  <td style={{...styles.td, fontWeight: '700'}}>{d.montant.toFixed(2)} DT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const styles = {
  tabContainer: { display: 'flex', gap: '15px', borderBottom: '1px solid #e8e7e2', marginBottom: '2rem' },
  tabBtn: { background: 'none', border: 'none', padding: '10px 5px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
  formCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e8e7e2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' },
  tableCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e8e7e2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  label: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#a0a098', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #f0f0ee', background: '#f9f9f7', fontSize: '13px', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '14px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: '#1a1a18', color: '#fff', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '1px solid #e8e7e2', textAlign: 'left' },
  th: { padding: '12px 8px', fontSize: '11px', fontWeight: '700', color: '#a0a098', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '0.5px solid #f0efe9' },
  td: { padding: '12px 8px', fontSize: '13px', color: '#1a1a18' },
  smallCategory: { fontSize: '9px', background: '#f1f0ec', padding: '2px 6px', borderRadius: '5px', color: '#7a7a74', fontWeight: '700', marginLeft: '5px' }
};

export default SaisieCharges;