import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import financeService from '../services/financeService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importation comptable parfaite

// --- Icônes SVG Pro ---
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconLightbulb = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "#b0afa8"} strokeWidth="2" style={{ marginRight: '2px' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// MAPPING DES CATÉGORIES MIS À JOUR AVEC LE SALAIRE OUVRIER
const CATEGORY_MAP = {
  ALIMENTATION: { label: 'Alimentation / Fourrage', color: '#f59e0b' },
  SANTE_VETERINAIRE: { label: 'Santé & Vétérinaire', color: '#3b82f6' },
  EAU_ELECTRICITE: { label: 'Eau & Électricité', color: '#6366f1' },
  TRANSPORT: { label: 'Logistique & Transport', color: '#8b5cf6'},
  SALAIRE_OUVRIER: { label: "Main d'œuvre / Salaires", color: '#10b981'},
  AUTRES: { label: 'Autres charges fixes', color: '#94a3b8'}
};

// --- US 37 : FONCTION D'AFFICHAGE DES ÉTOILES SAAS COMPACTES ---
const renderStars = (score) => {
  const stars = [];
  const starCount = score === 5 ? 5 : (score === 3 ? 3 : 1);
  for (let i = 1; i <= 5; i++) {
    stars.push(<StarIcon key={i} filled={i <= starCount} />);
  }
  return <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>{stars}</div>;
};

const FinancePage = () => {
  const [typeFiliere, setTypeFiliere] = useState('LAIT'); 
  const [analyse, setAnalyse] = useState(null);
  const [repartition, setRepartition] = useState({});
  const [evolutionAliment, setEvolutionAliment] = useState({});
  const [prixEtat, setPrixEtat] = useState(1.340);
  const [classement, setClassement] = useState([]);

  // --- FILTRE PAR MOIS ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mois actuel (1-12)
  
  // --- US 35 : SIMULATION INFLATION ALIMENTATION ---
  const [inflationAliment, setInflationAliment] = useState(0); // 0% d'augmentation par défaut

  const navigate = useNavigate();
  const fermierId = localStorage.getItem('user_id');

  const handleFiliereChange = (filiere) => {
    setTypeFiliere(filiere);
    setPrixEtat(filiere === 'LAIT' ? 1.340 : 0.340);
  };

  const loadData = useCallback(async () => {
    try {
      setAnalyse(null); 
      let resAnalyse = typeFiliere === 'LAIT' 
        ? await financeService.getAnalyseLait(prixEtat, selectedMonth) 
        : await financeService.getAnalyseOeufs(prixEtat, selectedMonth);
      setAnalyse(resAnalyse);

      // 🚨 --- DÉTECTEUR DE CRISE AUTOMATIQUE ---
      if (resAnalyse && resAnalyse.messageStatus === 'EN PERTE') {
        toast.error(
          `Alerte Rentabilité : Votre filière ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'} produit actuellement à perte !`, 
          {
            duration: 6000, 
            id: 'alerte-crise-' + typeFiliere, 
            style: {
              border: '1px solid #ef4444',
              padding: '16px',
              color: '#991b1b',
              background: '#fef2f2',
              fontWeight: '600',
              fontSize: '13.5px',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.1)'
            }
          }
        );
      } else if (resAnalyse && resAnalyse.messageStatus === 'RENTABLE') {
        toast.success(
          `Félicitations ! Votre filière ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'} est actuellement rentable.`,
          {
            id: 'alerte-succes-' + typeFiliere,
            style: {
              border: '1px solid #16a34a',
              padding: '16px',
              color: '#14532d',
              background: '#f0fdf4',
              fontWeight: '600'
            }
          }
        );
      }
      
      const resRep = await financeService.getRepartition(selectedMonth);
      setRepartition(resRep);

      const resEvol = await financeService.getEvolutionAlimentation();
      setEvolutionAliment(resEvol || {});

      // --- CHARGEMENT CLASSEMENT RENTABILITÉ ANIMAUX ---
      const resClass = await financeService.getClassementAnimaux(selectedMonth); 
      setClassement(resClass || []);

    } catch (err) { 
      toast.error("Erreur de chargement des données."); 
    }
  }, [typeFiliere, prixEtat, selectedMonth]);

  useEffect(() => { 
    loadData(); 
  }, [loadData]); 

  const totalRep = Object.values(repartition).reduce((a, b) => a + b, 0);

  // --- CALCULS DE MARGE ET DE RENTABILITÉ ---
  const margeProd = (analyse && analyse.margeProductionUnitaire) ? analyse.margeProductionUnitaire.toFixed(3) : "0.000";
  const margeGlobale = (analyse && analyse.margeGlobale) ? analyse.margeGlobale.toFixed(3) : "0.000";
  const isProdRentable = parseFloat(margeProd) >= 0;
  const isExploitRentable = analyse?.messageStatus === 'RENTABLE';
  const isNoProd = analyse?.messageStatus === 'PAS DE PRODUCTION';
  const isLoss = analyse?.messageStatus === 'EN PERTE';

  // --- US 35 : CALCULS DE SIMULATION INFLATION ALIMENTATION ---
  const alimentationOriginale = repartition['ALIMENTATION'] || 0;
  const alimentationSimulee = alimentationOriginale * (1 + inflationAliment / 100);
  const autresDepenses = (analyse?.totalToutesDepenses || 0) - alimentationOriginale;
  const totalDepensesSimulees = autresDepenses + alimentationSimulee;
  
  const coutGlobalSimule = (analyse && analyse.totalProduction > 0) 
    ? totalDepensesSimulees / analyse.totalProduction 
    : 0;

  const margeReelle = (analyse && analyse.coutGlobalParUnite) 
    ? (prixEtat - analyse.coutGlobalParUnite).toFixed(3) 
    : "0.000";

  const margeSimulee = (analyse && analyse.totalProduction > 0) 
    ? (prixEtat - coutGlobalSimule).toFixed(3) 
    : "0.000";

  const isRentableSimule = parseFloat(margeSimulee) >= 0;

  const monthsList = [
    { val: 1, label: 'Janvier' }, { val: 2, label: 'Février' }, { val: 3, label: 'Mars' },
    { val: 4, label: 'Avril' }, { val: 5, label: 'Mai' }, { val: 6, label: 'Juin' },
    { val: 7, label: 'Juillet' }, { val: 8, label: 'Août' }, { val: 9, label: 'Septembre' },
    { val: 10, label: 'Octobre' }, { val: 11, label: 'Novembre' }, { val: 12, label: 'Décembre' }
  ];

  // --- US 38 : GÉNÉRATION DU RAPPORT FINANCIER PDF (CORRIGÉ) ---
  const exportToPDF = () => {
    if (!analyse) {
      toast.error("Aucune donnée disponible à exporter !");
      return;
    }

    const doc = new jsPDF();
    const dateGen = new Date().toLocaleDateString();

    // 1. En-tête / Logo (Style Officiel)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); // Vert FirmaTrack
    doc.text("FIRMATRACK v2.0", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Gestion d'Exploitation Agricole Intelligente", 14, 25);
    doc.text(`Date de génération : ${dateGen}`, 150, 20);

    // Ligne de séparation grise
    doc.setDrawColor(232, 231, 226);
    doc.line(14, 30, 196, 30);

    // 2. Informations de la Ferme
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 24);
    doc.text("RAPPORT D'ANALYSE FINANCIÈRE ET DE RENTABILITÉ", 14, 40);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Éleveur exploitant : ${localStorage.getItem('user_name') || 'Non renseigné'}`, 14, 50);
    doc.text(`Rôle : ${localStorage.getItem('user_role') || 'Éleveur'}`, 14, 56);
    doc.text(`Filière analysée : Filière ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'}`, 14, 62);
    doc.text(`Mois de l'exercice comptable : ${monthsList.find(m => m.val === selectedMonth)?.label} 2026`, 14, 68);

    // 3. TABLEAU DES RENDEMENTS & COÛTS (autoTable(doc, ...) corrigé)
    autoTable(doc, {
      startY: 76,
      head: [['Indicateur de Rentabilité', 'Valeur en Dinars (DT)']],
      body: [
        ['Coût de Production Variable / Unité', `${analyse.coutProductionParUnite.toFixed(3)} DT`],
        ['Coût de Production Global / Unité', `${analyse.coutGlobalParUnite.toFixed(3)} DT`],
        ['Prix de Vente de l\'État (Marché)', `${(analyse.prixMarcheActuel || prixEtat).toFixed(3)} DT`],
        ['Marge Nette Unitaire', `${(prixEtat - analyse.coutGlobalParUnite).toFixed(3)} DT`],
        ['Volume Total de Production', `${analyse.totalProduction} ${typeFiliere === 'LAIT' ? 'Litres' : 'Œufs'}`],
        ['Rentabilité Nette Globale de l\'Exploitation', `${analyse.margeGlobale.toFixed(3)} DT`],
        ['Statut Financier', analyse.messageStatus]
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 24], fontStyle: 'bold' },
      columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } }
    });

    // 4. TABLEAU DES DÉPENSES PAR CATÉGORIE
    const finalYFirstTable = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
    const startYDepenses = finalYFirstTable + 15;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("RÉPARTITION DES CHARGES DU MOIS", 14, startYDepenses - 5);

    const bodyRepartition = Object.entries(repartition).map(([cat, val]) => [
      cat.replace('_', ' '), 
      `${val.toFixed(2)} DT`
    ]);

    // autoTable(doc, ...) corrigé
    autoTable(doc, {
      startY: startYDepenses,
      head: [['Catégorie de Dépense', 'Montant']],
      body: bodyRepartition,
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74], fontStyle: 'bold' },
      columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } }
    });

    // 5. Signature et Bas de page
    const finalYSecondTable = doc.lastAutoTable ? doc.lastAutoTable.finalY : 220;
    const finalY = finalYSecondTable + 25;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Ce document est généré de manière sécurisée par la plateforme FirmaTrack.", 14, finalY);
    doc.text("Cachet de l'exploitation & Signature :", 140, finalY);

    doc.save(`FirmaTrack_Bilan_Ferme_${typeFiliere}_${selectedMonth}_2026.pdf`);
    toast.success("Rapport financier exporté en PDF !");
  };

  return (
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a18', margin: 0, letterSpacing: '-0.5px' }}>Analyse Financière</h1>
            <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '4px' }}>Pilotez la rentabilité de votre exploitation.</p>
          </div>
          {/* GRILLE DE BOUTONS D'ACTIONS SANS ÉMOJIS */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportToPDF} style={{...styles.addBtn, background: '#16a34a'}}>
              Exporter Bilan
            </button>
            <button onClick={() => navigate('/finance/enregistrer')} style={styles.addBtn}>
              <IconPlus /> Saisir des charges
            </button>
          </div>
        </div>

        {/* BARRE DE CONTRÔLE AVEC FILTRE PAR MOIS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <div style={styles.pillSelector}>
            <button onClick={() => handleFiliereChange('LAIT')} style={{...styles.pillBtn, background: typeFiliere === 'LAIT' ? '#1a1a18' : 'transparent', color: typeFiliere === 'LAIT' ? '#fff' : '#a0a098'}}>Lait</button>
            <button onClick={() => handleFiliereChange('OEUFS')} style={{...styles.pillBtn, background: typeFiliere === 'OEUFS' ? '#1a1a18' : 'transparent', color: typeFiliere === 'OEUFS' ? '#fff' : '#a0a098'}}>Œufs</button>
          </div>

          {/* SÉLECTEUR DE MOIS DYNAMIQUE */}
          <div style={styles.statePriceBox}>
            <span style={{fontSize: '11px', fontWeight: '700', color: '#a0a098'}}>MOIS D'ANALYSE :</span>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ border: 'none', background: 'none', fontWeight: '800', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              {monthsList.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
            </select>
          </div>

          <div style={styles.statePriceBox}>
            <span style={{fontSize: '11px', fontWeight: '700', color: '#a0a098'}}>PRIX ÉTAT (DT) :</span>
            <input type="number" step="0.010" value={prixEtat} onChange={(e) => setPrixEtat(parseFloat(e.target.value) || 0)} style={styles.stateInput} />
          </div>

          <div style={{ ...styles.headerAdvice, background: isNoProd ? '#f3f4f6' : '#fffbeb', borderColor: isNoProd ? '#e5e7eb' : '#fef3c7' }}>
            <span style={{ display: 'flex', alignItems: 'center', color: isNoProd ? '#4b5563' : (isLoss ? '#92400e' : '#16a34a') }}><IconLightbulb /></span>
            <p style={{margin:0, fontSize:'12.5px', fontWeight:'500', color: isNoProd ? '#4b5563' : (isLoss ? '#92400e' : '#16a34a')}}>
              {isNoProd 
                ? "Aucune production enregistrée pour ce mois-ci." 
                : (isLoss ? "Attention ! Votre coût global dépasse le prix de vente fixé." : "Gestion optimale : votre marge réelle est positive.")}
            </p>
          </div>
        </div>
      </header>

      {/* --- MISE EN PAGE SUR DEUX COLONNES ASYMÉTRIQUES --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        
        {/* COLONNE GAUCHE (70% - DONNÉES ET KPI) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* CARDS KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            
            {/* 1. Coût de Production */}
            <div style={{...styles.kpiCard, borderTop: isProdRentable ? '4px solid #16a34a' : '4px solid #ef4444'}}>
               <span style={styles.kpiLabel}>COÛT DE PRODUCTION / {typeFiliere === 'LAIT' ? 'L' : 'U'}</span>
               <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a18', margin: '8px 0' }}>
                 {analyse?.coutProductionParUnite ? analyse.coutProductionParUnite.toFixed(3) : '0.000'} <span style={{ fontSize: '13px', color: '#a0a098' }}>DT</span>
               </div>
               <div style={{display:'flex', alignItems:'center', gap:'8px', flexWrap: 'wrap'}}>
                  <div style={{ ...styles.badge, background: isProdRentable ? '#f0fdf4' : '#fef2f2', color: isProdRentable ? '#16a34a' : '#ef4444' }}>
                    {isProdRentable ? 'PROD OK' : 'PROD PERTE'}
                  </div>
                  {!isNoProd && (
                    <span style={{fontSize:'11px', fontWeight:'700', color: isProdRentable ? '#16a34a' : '#ef4444'}}>
                      {isProdRentable ? '+' : ''}{margeProd} DT/U
                    </span>
                  )}
               </div>
            </div>

            {/* 2. Coût Global / Unité */}
            <div style={{...styles.kpiCard, borderTop: isExploitRentable ? '4px solid #16a34a' : '4px solid #ef4444'}}>
               <span style={{ fontSize: '11px', fontWeight: '700', color: '#a0a098', letterSpacing: '0.05em' }}>COÛT GLOBAL / {typeFiliere === 'LAIT' ? 'L' : 'U'}</span>
               <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a18', margin: '8px 0' }}>
                 {analyse?.coutGlobalParUnite ? analyse.coutGlobalParUnite.toFixed(3) : '0.000'} <span style={{ fontSize: '13px', color: '#a0a098' }}>DT</span>
               </div>
               <span style={{ fontSize: '11px', color: '#7a7a74' }}>Charges fixes incluses</span>
            </div>

            {/* 3. Rentabilité de l'Exploitation */}
            <div style={{...styles.kpiCard, borderTop: isNoProd ? '4px solid #94a3b8' : (isExploitRentable ? '4px solid #16a34a' : '4px solid #ef4444')}}>
               <span style={styles.kpiLabel}>RENTABILITÉ GLOBALE</span>
               <div style={{ fontSize: '24px', fontWeight: '800', color: isNoProd ? '#94a3b8' : (isExploitRentable ? '#16a34a' : '#ef4444'), margin: '8px 0' }}>
                 {isNoProd ? '--' : margeGlobale} <span style={{ fontSize: '13px', color: '#a0a098' }}>DT</span>
               </div>
               <div style={{display:'flex', alignItems:'center', gap:'6px', flexWrap: 'wrap'}}>
                  <div style={{ ...styles.badge, background: isNoProd ? '#f1f0ec' : (isExploitRentable ? '#f0fdf4' : '#fef2f2'), color: isNoProd ? '#7a7a74' : (isExploitRentable ? '#16a34a' : '#ef4444') }}>
                    {isNoProd ? 'PAS DE PRODUCTION' : (analyse?.messageStatus || 'ATTENTE')}
                  </div>
                  {!isNoProd && <span style={{fontSize:'11px', color:'#7a7a74'}}>({margeReelle} DT/U)</span>}
               </div>
            </div>

            {/* 4. Production Totale & Budget */}
            <div style={{...styles.kpiCard, borderTop: '4px solid #3b82f6'}}>
               <span style={styles.kpiLabel}>PRODUCTION TOTALE / BUDGET</span>
               <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a18', margin: '8px 0' }}>
                 {analyse?.totalProduction || 0} <span style={{ fontSize: '12px', color: '#a0a098', fontWeight: '600' }}>
                   {typeFiliere === 'LAIT' ? 'Litres' : 'Œufs'}
                 </span>
               </div>
               <span style={{ fontSize: '11px', color: '#7a7a74' }}>
                  Dépenses : {analyse?.totalToutesDepenses ? analyse.totalToutesDepenses.toFixed(3) : '0.000'} DT
               </span>
            </div>
          </div>

          {/* IMPACT DES CHARGES */}
          <div style={styles.mainCard}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1.5rem' }}>Impact sur le Coût de Production</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(repartition).map(([cat, val]) => {
                const config = CATEGORY_MAP[cat] || CATEGORY_MAP.AUTRES;
                const percentage = totalRep > 0 ? (val / totalRep) * 100 : 0;
                const impactParLitre = (analyse && analyse.totalProduction > 0) ? (val / analyse.totalProduction).toFixed(3) : "0.000";

                return (
                  <div key={cat} style={{ borderLeft: `3px solid ${config.color}`, paddingLeft: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a18' }}>{config.label}</span>
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                             Impact direct : {impactParLitre} DT / {typeFiliere === 'LAIT' ? 'Litre' : 'Unité'}
                          </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{val.toFixed(2)} DT</span>
                        <span style={{ fontSize: '10px', color: '#a0a098', display:'block' }}>{percentage.toFixed(1)}% des charges</span>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#f1f1f1', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: config.color, borderRadius: '10px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- SECTION ÉVOLUTION MENSUELLE --- */}
          <div style={styles.mainCard}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1.25rem' }}>
              Évolution mensuelle du budget Alimentation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(evolutionAliment).length > 0 ? (
                Object.entries(evolutionAliment)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([mois, total]) => (
                    <div key={mois} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #f1f0ec', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Mois : {mois}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#b45309' }}>{(total || 0).toFixed(2)} DT</span>
                    </div>
                  ))
              ) : (
                <span style={{ fontSize: '12.5px', color: '#a0a098' }}>Aucune donnée historique disponible pour le moment.</span>
              )}
            </div>
          </div>

        </div>

        {/* --- COLONNE DROITE (SIMULATION DE CRISE ET ANALYSE PRÉDICTIVE) --- */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '1.5rem' }}>
          
          {/* Formulaire Slider */}
          <div style={{...styles.mainCard, background: '#1a1a18', color: '#fff', border: 'none', padding: '1.5rem'}}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 15px 0' }}>
              Simulation de Crise
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#a0a098' }}>Hausse prix aliments (3alef) :</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>+{inflationAliment}%</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5" 
              value={inflationAliment} 
              onChange={(e) => setInflationAliment(parseInt(e.target.value))} 
              style={{ width:'100%', accentColor:'#f59e0b', cursor:'pointer', height: '5px', borderRadius: '5px', marginBottom: '1.5rem' }} 
            />            

            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px' }}>
              <span style={{ fontSize: '10px', color: '#a0a098', display:'block', marginBottom:'5px' }}>MARGE ESTIMÉE APRÈS HAUSSE</span>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '800', 
                color: isNoProd ? '#94a3b8' : (isRentableSimule ? '#16a34a' : '#ef4444') 
              }}>
                {isNoProd ? '--' : `${parseFloat(margeSimulee) >= 0 ? '+' : ''}${margeSimulee}`} <span style={{fontSize:'11px'}}>DT / U</span>
              </div>
            </div>
          </div>

          {/* CARTE D'ANALYSE PRÉDICTIVE */}
          <div style={styles.adviceCard}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#92400e' }}>Analyse Prédictive d'Inflation</h4>
            <div style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#b45309', lineHeight: '1.5' }}>
              {isNoProd ? (
                "Aucune production enregistrée pour ce mois. La simulation d'inflation sera disponible dès la saisie de vos rendements."
              ) : (
                <>
                  Une hausse de <b style={{color: '#f59e0b'}}>{inflationAliment}%</b> du coût de l'alimentation ferait passer votre coût global par unité à <b>{coutGlobalSimule.toFixed(3)} DT</b>, résultant en une marge simulée de <b style={{color: isRentableSimule ? '#16a34a' : '#ef4444'}}>{margeSimulee} DT / unité</b>.
                </>
              )}
            </div>
          </div>

          {/* Boîte d'information */}
          <div style={styles.infoBox}>
             <IconInfo />
             <p style={{margin:0, fontSize:'11.5px', color:'#7a7a74'}}>
               <b>Note :</b> Augmentez le curseur pour simuler l'impact d'une hausse des prix mondiaux du soja ou du maïs sur votre ferme.
             </p>
          </div>
        </aside>

      </div>

      {/* --- TABLEAU DE CLASSEMENT DE RENTABILITÉ PAR ANIMAL --- */}
      <div style={{ ...styles.mainCard, marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Classement de Rentabilité par Animal</h3>
            <p style={{ fontSize: '12px', color: '#a0a098', marginTop: '4px' }}>
              Identifiez instantanément vos animaux les plus performants et ceux qui produisent à perte.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1a1a18', background: '#f1f0ec', padding: '5px 12px', borderRadius: '10px' }}>Score de performance</span>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Animal</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Numéro ID</th>
              <th style={styles.th}>Production ce mois</th>
              <th style={styles.th}>Marge estimée</th>
              <th style={{...styles.th, textAlign: 'right'}}>Score Rentabilité</th>
            </tr>
          </thead>
          <tbody>
            {classement.length > 0 ? (
              classement.map(animal => {
                const isAnimalLoss = (animal.margeNette || 0) < 0;
                return (
                  <tr key={animal.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>
                      {animal.nom || 'Anonyme'}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.smallCategory}>{animal.type ? animal.type.toUpperCase() : 'N/A'}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.idBadge}>{animal.chepnumber}</span>
                    </td>
                    <td style={styles.td}>
                      {(animal.totalProduction || 0).toFixed(1)} {typeFiliere === 'LAIT' ? 'L' : 'U'}
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700', color: isAnimalLoss ? '#ef4444' : '#16a34a' }}>
                      {isAnimalLoss ? '' : '+'}{(animal.margeNette || 0).toFixed(3)} DT
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontSize: '14px' }}>
                      {renderStars(animal.scoreEtoiles)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#a0a098', padding: '2rem' }}>
                  Aucun animal enregistré pour l'évaluation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const styles = {
  kpiCard: { background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e8e7e2', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' },
  mainCard: { background: '#fff', padding: '2.2rem', borderRadius: '28px', border: '1px solid #e8e7e2' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a18', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize:'13px' },
  pillSelector: { display: 'flex', background: '#f1f0ec', padding: '4px', borderRadius: '12px' },
  pillBtn: { border: 'none', padding: '8px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
  statePriceBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '6px 15px', borderRadius: '12px', border: '1px solid #e8e7e2' },
  stateInput: { width: '65px', border: 'none', background: '#f8f9fa', padding: '4px', borderRadius: '6px', fontWeight: '800', fontSize: '14px', textAlign: 'center', outline: 'none' },
  headerAdvice: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', flex: 1 },
  kpiLabel: { fontSize: '10px', fontWeight: '700', color: '#a0a098', letterSpacing: '0.05em' },
  badge: { padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' },
  infoBox: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '1rem', padding: '10px 15px', background: '#f8f9fa', borderRadius: '12px' },
  adviceCard: { background: '#fffbeb', padding: '1.5rem', borderRadius: '24px', border: '1px solid #fef3c7' },
  
  // Styles de tableau (US 37)
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '1px solid #e8e7e2', textAlign: 'left' },
  th: { padding: '12px 8px', fontSize: '11px', fontWeight: '700', color: '#a0a098', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '0.5px solid #f0efe9' },
  td: { padding: '12px 8px', fontSize: '13px', color: '#1a1a18' },
  
  // Style de badge de catégorie
  smallCategory: { 
    fontSize: '11px', 
    background: '#f8f9fa', 
    border: '1px solid #e5e7eb',
    color: '#4b5563',
    borderRadius: '6px', 
    padding: '2px 8px', 
    fontWeight: '600',
    textTransform: 'uppercase'
  },

  // Style d'ID Badge (Monospace pour correspondre à Cheptel)
  idBadge: {
    background: '#f1f0ec',
    color: '#1a1a18',
    borderRadius: '6px',
    padding: '3px 10px',
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'monospace'
  }
};

export default FinancePage;