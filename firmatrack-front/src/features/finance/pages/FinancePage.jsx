import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import financeService from '../services/financeService';
import AddExpenseForm from '../components/AddExpenseForm';

// --- Icônes ---
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconInfo = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

const CATEGORY_MAP = {
  ALIMENTATION: { label: 'Alimentation / Fourrage', color: '#f59e0b' },
  SANTE_VETERINAIRE: { label: 'Santé & Vétérinaire', color: '#3b82f6' },
  EAU_ELECTRICITE: { label: 'Eau & Électricité', color: '#6366f1' },
  TRANSPORT: { label: 'Logistique & Transport', color: '#8b5cf6' },
  AUTRES: { label: 'Autres charges fixes', color: '#94a3b8' }
};

const FinancePage = () => {
  const [typeFiliere, setTypeFiliere] = useState('LAIT'); 
  const [analyse, setAnalyse] = useState(null);
  const [repartition, setRepartition] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [prixEtat, setPrixEtat] = useState(typeFiliere === 'LAIT' ? 1.340 : 0.340);
  const [prixSimule, setPrixSimule] = useState(typeFiliere === 'LAIT' ? 1.500 : 0.450);

  const loadData = useCallback(async () => {
    try {
      setAnalyse(null); 
      let resAnalyse = typeFiliere === 'LAIT' ? await financeService.getAnalyseLait() : await financeService.getAnalyseOeufs();
      setAnalyse(resAnalyse);
      const resRep = await financeService.getRepartition();
      setRepartition(resRep);
    } catch (err) { toast.error("Erreur de chargement."); }
  }, [typeFiliere]);

  useEffect(() => { loadData(); }, [loadData]); 

  const totalRep = Object.values(repartition).reduce((a, b) => a + b, 0);

  // Calculs de marge
  const margeReelle = analyse ? (prixEtat - analyse.coutRevientParUnite).toFixed(3) : "0.000";
  const margeSimulee = analyse ? (prixSimule - analyse.coutRevientParUnite).toFixed(3) : "0.000";
  const isRentableReel = parseFloat(margeReelle) >= 0;

  return (
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh' }}>
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a18', margin: 0, letterSpacing: '-0.5px' }}>Analyse Financière</h1>
            <button onClick={() => setShowModal(true)} style={styles.addBtn}>
                <IconPlus /> Ajouter une dépense
            </button>
        </div>

        {/* BARRE DE CONTRÔLE (Sélécteur + Prix + Astuce) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={styles.pillSelector}>
                <button onClick={() => setTypeFiliere('LAIT')} style={{...styles.pillBtn, background: typeFiliere === 'LAIT' ? '#fff' : 'transparent', color: typeFiliere === 'LAIT' ? '#1a1a18' : '#a0a098'}}>Lait</button>
                <button onClick={() => setTypeFiliere('OEUFS')} style={{...styles.pillBtn, background: typeFiliere === 'OEUFS' ? '#fff' : 'transparent', color: typeFiliere === 'OEUFS' ? '#1a1a18' : '#a0a098'}}>Œufs</button>
            </div>

            <div style={styles.statePriceBox}>
                <span style={{fontSize: '11px', fontWeight: '700', color: '#a0a098'}}>PRIX ÉTAT (DT) :</span>
                <input 
                  type="number" step="0.010" value={prixEtat} 
                  onChange={(e) => setPrixEtat(parseFloat(e.target.value))}
                  style={styles.stateInput}
                />
            </div>

            {/* ASTUCE / CONSEIL PLACÉ ICI (HEADER) */}
            <div style={styles.headerAdvice}>
                <span style={{fontSize:'18px'}}>💡</span>
                <p style={{margin:0, fontSize:'12.5px', fontWeight:'500', color:'#92400e'}}>
                    {parseFloat(margeReelle) < 0 
                      ? "Attention ! Votre coût de revient dépasse le prix fixé." 
                      : "Gestion optimale : votre marge réelle est actuellement positive."}
                </p>
            </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        
        {/* --- COLONNE GAUCHE --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{...styles.kpiCard, borderTop: isRentableReel ? '4px solid #16a34a' : '4px solid #ef4444'}}>
               <span style={styles.kpiLabel}>COÛT DE REVIENT RÉEL / {typeFiliere === 'LAIT' ? 'L' : 'U'}</span>
               <div style={{ fontSize: '30px', fontWeight: '800', color: '#1a1a18', margin: '10px 0' }}>
                 {analyse ? analyse.coutRevientParUnite.toFixed(3) : '0.000'} <span style={{ fontSize: '14px', color: '#a0a098' }}>DT</span>
               </div>
               <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <div style={{ ...styles.badge, background: isRentableReel ? '#f0fdf4' : '#fef2f2', color: isRentableReel ? '#16a34a' : '#ef4444' }}>
                    {isRentableReel ? 'RENTABLE' : 'EN PERTE'}
                  </div>
                  <span style={{fontSize:'13px', fontWeight:'700', color: isRentableReel ? '#16a34a' : '#ef4444'}}>
                    {isRentableReel ? '+' : ''}{margeReelle} DT
                  </span>
               </div>
            </div>

            <div style={styles.kpiCard}>
               <span style={styles.kpiLabel}>PRODUCTION TOTALE</span>
               <div style={{ fontSize: '30px', fontWeight: '800', color: '#1a1a18', margin: '10px 0' }}>{analyse?.totalProduction || 0}</div>
               <span style={{ fontSize: '13px', color: '#16a34a', fontWeight:'600' }}>Volume ce mois</span>
            </div>

            <div style={styles.kpiCard}>
               <span style={styles.kpiLabel}>DÉPENSES CUMULÉES</span>
               <div style={{ fontSize: '30px', fontWeight: '800', color: '#1a1a18', margin: '10px 0' }}>{analyse?.totalDepenses || 0} <span style={{fontSize:'14px'}}>DT</span></div>
               <span style={{ fontSize: '13px', color: '#a0a098' }}>Toutes charges</span>
            </div>
          </div>
{/* --- SECTION IMPACT DES CHARGES (US-34) --- */}

          {/* --- SECTION IMPACT DES CHARGES (US-34) --- */}
<div style={styles.mainCard}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Impact sur le Coût de Production</h3>
          <p style={{ fontSize: '12px', color: '#a0a098', marginTop: '4px' }}>Détail de la contribution de chaque dépense par unité produite.</p>
      </div>
      <span style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a18', background: '#f1f0ec', padding: '5px 12px', borderRadius: '10px' }}>US-34 Analysis</span>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    {Object.entries(repartition).map(([cat, val]) => {
      const config = CATEGORY_MAP[cat] || CATEGORY_MAP.AUTRES;
      const percentage = totalRep > 0 ? (val / totalRep) * 100 : 0;
      
      // CALCUL DE L'IMPACT RÉEL (US-34) : Valeur de la catégorie / Nombre de litres
      const impactParLitre = analyse?.totalProduction > 0 ? (val / analyse.totalProduction).toFixed(3) : "0.000";

      return (
        <div key={cat} style={{ borderLeft: `3px solid ${config.color}`, paddingLeft: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
            <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a18', display: 'block' }}>{config.label}</span>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                   Impact : {impactParLitre} DT / {typeFiliere === 'LAIT' ? 'Litre' : 'Unité'}
                </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a18' }}>{val.toFixed(2)} DT</span>
              <span style={{ fontSize: '11px', color: '#a0a098', display: 'block' }}>{percentage.toFixed(1)}% du budget</span>
            </div>
          </div>
          
          {/* Barre de progression avec épaisseur pro */}
          <div style={{ width: '100%', height: '6px', background: '#f1f1f1', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${percentage}%`, 
              height: '100%', 
              background: config.color, 
              borderRadius: '10px',
              transition: 'width 1s ease' 
            }} />
          </div>
        </div>
      );
    })}
  </div>
</div>

          <div style={styles.infoBox}>
             <IconInfo />
             <p style={{margin:0, fontSize:'12px', color:'#7a7a74'}}>
               <b>Note :</b> Les charges d'alimentation sont calculées automatiquement en fonction de vos stocks.
             </p>
          </div>
        </div>

        {/* --- COLONNE DROITE --- */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          
          <div style={{...styles.mainCard, background: '#1a1a18', color: '#fff', border: 'none'}}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '1px' }}>Simulation de marge </h3>
            <div style={{ margin: '25px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#a0a098' }}>Prix de vente simulé :</span>
                <span style={{ fontSize: '20px', fontWeight: '800' }}>{prixSimule.toFixed(3)} DT</span>
              </div>
<input 
  type="range" 
  // Bornes réalistes
  min={typeFiliere === 'LAIT' ? "1.100" : "0.200"} 
  max={typeFiliere === 'LAIT' ? "1.800" : "0.500"} 
  step="0.005" // Plus de précision
  value={prixSimule} 
  onChange={(e) => setPrixSimule(parseFloat(e.target.value))} 
  style={{
    width:'100%', 
    accentColor:'#16a34a', 
    cursor:'pointer',
    height: '6px',
    borderRadius: '5px'
  }} 
/>            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <span style={{ fontSize: '11px', color: '#a0a098', display:'block', marginBottom:'5px' }}>MARGE ESTIMÉE</span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: parseFloat(margeSimulee) >= 0 ? '#16a34a' : '#ef4444' }}>
                {parseFloat(margeSimulee) >= 0 ? '+' : ''}{margeSimulee} <span style={{fontSize:'12px'}}>DT / U</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.2rem', background: '#fff', borderRadius: '20px', border: '1px dashed #e8e7e2' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#7a7a74', textAlign:'center' }}>
              Utilisez le curseur pour prévoir vos bénéfices futurs en cas de hausse des prix du marché.
            </p>
          </div>
        </aside>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
                <h2 style={{margin:0, fontSize:'20px', fontWeight:'700'}}>Nouvelle dépense</h2>
                <button onClick={() => setShowModal(false)} style={styles.closeBtn}>×</button>
            </div>
            <AddExpenseForm onExpenseAdded={() => { loadData(); setShowModal(false); }} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  kpiCard: { background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e8e7e2', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' },
  mainCard: { background: '#fff', padding: '2.2rem', borderRadius: '28px', border: '1px solid #e8e7e2' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a18', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  pillSelector: { display: 'flex', background: '#f1f0ec', padding: '4px', borderRadius: '12px' },
  pillBtn: { border: 'none', padding: '8px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  statePriceBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '6px 15px', borderRadius: '12px', border: '1px solid #e8e7e2' },
  stateInput: { width: '65px', border: 'none', background: '#f8f9fa', padding: '4px', borderRadius: '6px', fontWeight: '800', fontSize: '14px', textAlign: 'center', outline: 'none' },
  headerAdvice: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', flex: 1 },
  kpiLabel: { fontSize: '10px', fontWeight: '700', color: '#a0a098', letterSpacing: '0.05em' },
  badge: { padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' },
  infoBox: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '1rem', padding: '10px 15px', background: '#f8f9fa', borderRadius: '12px' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#fff', padding: '35px', borderRadius: '32px', width: '100%', maxWidth: '460px' },
  closeBtn: { background: '#f1f0ec', border: 'none', fontSize: '20px', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }
};

export default FinancePage;