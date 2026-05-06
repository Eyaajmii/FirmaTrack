import React, { useState, useEffect, useCallback } from 'react'; // 1. Ajoute useCallback
import { Toaster, toast } from 'react-hot-toast';
import financeService from '../services/financeService';
import AddExpenseForm from '../components/AddExpenseForm';

const CATEGORY_MAP = {
  ALIMENTATION: { label: 'Alimentation / 3alef', color: '#f59e0b', icon: '🌾' },
  SANTE_VETERINAIRE: { label: 'Santé & Vétérinaire', color: '#3b82f6', icon: '⚕️' },
  EAU_ELECTRICITE: { label: 'Eau & Électricité', color: '#6366f1', icon: '💧' },
  TRANSPORT: { label: 'Logistique & Transport', color: '#8b5cf6', icon: '🚛' },
  AUTRES: { label: 'Autres charges fixes', color: '#94a3b8', icon: '📦' }
};

const FinancePage = () => {
  const [typeFiliere, setTypeFiliere] = useState('LAIT'); 
  const [analyse, setAnalyse] = useState(null);
  const [repartition, setRepartition] = useState({});
  const fermierId = localStorage.getItem('user_id');

  // 2. Entoure loadData avec useCallback
  const loadData = useCallback(async () => {
    try {
      // 1. N-fars-7ou el analyse el 9dima 9bal ma n-nad-iou el jdid
      setAnalyse(null); 
      
      let resAnalyse;
      if (typeFiliere === 'LAIT') {
        resAnalyse = await financeService.getAnalyseLait(fermierId);
      } else {
        // ⚠️ THABBET FIL SERVICE : est-ce que getAnalyseOeufs t-kallem fi /analyse/oeufs ?
        resAnalyse = await financeService.getAnalyseOeufs(fermierId);
      }
      
      console.log("Données reçues :", resAnalyse); // <--- Dima a3mel log bech tchouf chnowa jek mel base
      setAnalyse(resAnalyse);
      
      const resRep = await financeService.getRepartition(fermierId);
      setRepartition(resRep);
    } catch (err) { 
      console.error("Erreur API :", err);
      toast.error("Erreur lors du chargement des données");
    }
  }, [typeFiliere, fermierId]);// Ces variables sont les dépendances de loadData

  // 3. Maintenant, loadData peut être mis en dépendance ici sans erreur
  useEffect(() => {
    loadData();
  }, [loadData]); 

  const totalRep = Object.values(repartition).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: '1.5rem 2.5rem', backgroundColor: '#faf9f6', minHeight: '100vh' }}>
      <Toaster />
      
      {/* Breadcrumbs dynamiques */}
      <nav style={{ fontSize: '12px', color: '#a0a098', marginBottom: '1rem' }}>
        Ferme El Baraka / Économie / <span style={{ color: '#1a1a18', fontWeight: '500' }}>
          {typeFiliere === 'LAIT' ? 'Filière Lait' : 'Filière Œufs'}
        </span>
      </nav>

      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a18', margin: 0 }}>Analyse Financière</h1>
            <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '4px' }}>Suivi de rentabilité par secteur de production.</p>
        </div>

        {/* SELECTEUR DE FILIÈRE (UI Améliorée) */}
        <div style={{ display: 'flex', background: '#eeeede', padding: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setTypeFiliere('LAIT')}
            style={{
              padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: typeFiliere === 'LAIT' ? '#1a1a18' : 'transparent',
              color: typeFiliere === 'LAIT' ? '#fff' : '#6a6a64',
              fontWeight: '600', fontSize: '13px', transition: '0.3s'
            }}
          >
            🐮 Lait
          </button>
          <button 
            onClick={() => setTypeFiliere('OEUFS')}
            style={{
              padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: typeFiliere === 'OEUFS' ? '#1a1a18' : 'transparent',
              color: typeFiliere === 'OEUFS' ? '#fff' : '#6a6a64',
              fontWeight: '600', fontSize: '13px', transition: '0.3s'
            }}
          >
            🥚 Œufs
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* SECTION GAUCHE : ANALYSE DYNAMIQUE */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginBottom: '2.5rem' }}>
            
            {/* CARTE COÛT DE REVIENT DYNAMIQUE */}
            <div style={styles.kpiCard}>
               <div style={{...styles.iconCircle, background: '#fef2f2'}}><span>📉</span></div>
               <span style={styles.kpiLabel}>COÛT DE REVIENT / {typeFiliere === 'LAIT' ? 'L' : 'UNITÉ'}</span>
               <div style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0', color: analyse?.messageStatus === 'EN PERTE' ? '#ef4444' : '#1a1a18' }}>
                 {analyse ? analyse.coutRevientParUnite.toFixed(3) : '0.000'} <span style={{ fontSize: '13px', color: '#a0a098' }}>DT</span>
               </div>
               <div style={{ ...styles.badge, background: analyse?.messageStatus === 'EN PERTE' ? '#fef2f2' : '#f0fdf4', color: analyse?.messageStatus === 'EN PERTE' ? '#ef4444' : '#16a34a' }}>
                 {analyse?.messageStatus}
               </div>
            </div>

            {/* PRODUCTION DYNAMIQUE */}
            <div style={styles.kpiCard}>
               <div style={{...styles.iconCircle, background: '#eff6ff'}}><span>{typeFiliere === 'LAIT' ? '🥛' : '🥚'}</span></div>
               <span style={styles.kpiLabel}>PRODUCTION TOTALE</span>
               <div style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0' }}>
                 {analyse?.totalProduction || 0} <span style={{ fontSize: '13px', color: '#a0a098' }}>{typeFiliere === 'LAIT' ? 'Litres' : 'Œufs'}</span>
               </div>
               <span style={{ fontSize: '12px', color: '#16a34a' }}>Volume collecté</span>
            </div>

            {/* TOTAL DÉPENSES */}
            <div style={styles.kpiCard}>
               <div style={{...styles.iconCircle, background: '#f0fdf4'}}><span>💸</span></div>
               <span style={styles.kpiLabel}>TOTAL DÉPENSES</span>
               <div style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0' }}>
                 {analyse?.totalDepenses || 0} <span style={{ fontSize: '13px', color: '#a0a098' }}>DT</span>
               </div>
               <span style={{ fontSize: '12px', color: '#a0a098' }}>Ce mois-ci</span>
            </div>
          </div>

          {/* IMPACT DES CHARGES */}
          <div style={styles.mainCard}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2rem' }}>Répartition des charges sur la rentabilité</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(repartition).map(([cat, val]) => {
                const config = CATEGORY_MAP[cat] || CATEGORY_MAP.AUTRES;
                const percentage = totalRep > 0 ? (val / totalRep) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{config.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{config.label}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{val.toFixed(2)} DT <span style={{ fontSize: '12px', color: '#a0a098', fontWeight: '400' }}>({percentage.toFixed(1)}%)</span></span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: '#f1f1f1', borderRadius: '10px' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: config.color, borderRadius: '10px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION DROITE */}
        <aside>
          <div style={styles.formCard}>
             <AddExpenseForm onExpenseAdded={loadData} />
          </div>
          <div style={styles.adviceCard}>
             <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#92400e' }}>💡 Conseil Optimisation</h4>
             <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#b45309', lineHeight: '1.5' }}>
               {typeFiliere === 'LAIT' 
                 ? "L'alimentation bovine pèse lourd. Vérifiez le gaspillage au niveau des auges."
                 : "La casse d'œufs et l'alimentation des poules pondeuses sont vos leviers de rentabilité."}
             </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

// Styles (Gardés identiques pour la cohérence)
const styles = {
  kpiCard: { background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(26,26,24,0.06)' },
  mainCard: { background: '#fff', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(26,26,24,0.06)' },
  formCard: { background: '#fff', borderRadius: '18px', border: '1px solid rgba(26,26,24,0.08)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  adviceCard: { marginTop: '1.5rem', padding: '1.25rem', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fef3c7' },
  iconCircle: { width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' },
  kpiLabel: { fontSize: '10px', fontWeight: '700', color: '#a0a098', textTransform: 'uppercase', letterSpacing: '0.05em' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '700' }
};

export default FinancePage;