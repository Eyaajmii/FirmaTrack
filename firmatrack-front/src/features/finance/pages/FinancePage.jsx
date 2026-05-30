import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastContainer } from '../../../components/common/Toast';
import financeService from '../services/financeService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const IconProduction = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 5.5h10v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7zM5.5 5.5V3a2.5 2.5 0 015 0v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconGlobal = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke={color} strokeWidth="1.5" />
    <path d="M1.5 8h13M8 1.5c1.5 2 2.5 4.5 2.5 6.5s-1 4.5-2.5 6.5M8 1.5c-1.5 2-2.5 4.5-2.5 6.5s1 4.5 2.5 6.5" stroke={color} strokeWidth="1.1" />
  </svg>
);

const IconTrendUp = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 4.5l-5 5-3-3-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 4.5h3.5V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTotal = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" stroke={color} strokeWidth="1.5" />
    <circle cx="8" cy="8" r="2.5" fill={color} />
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconExport = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconInfo = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 10V8M8 6h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconTrend = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAlert = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L15 14H1L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v4M8 11.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconStar = ({ filled }) => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "#d1cfc8"} strokeWidth="1.3">
    <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 2 .7-4.1-3-2.9 4.2-.7z"/>
  </svg>
);

const CATEGORY_MAP = {
  ALIMENTATION:      { label: 'Alimentation / Fourrage', color: '#d97706', bg: '#FAEEDA' },
  SANTE_VETERINAIRE: { label: 'Santé & Vétérinaire',     color: '#2563eb', bg: '#eff6ff' },
  EAU_ELECTRICITE:   { label: 'Eau & Électricité',        color: '#6366f1', bg: '#eef2ff' },
  TRANSPORT:         { label: 'Logistique & Transport',   color: '#7c3aed', bg: '#f5f3ff' },
  SALAIRE_OUVRIER:   { label: "Main d'œuvre / Salaires", color: '#2a7a4b', bg: '#EAF3DE' },
  AUTRES:            { label: 'Autres charges fixes',     color: '#6b6b67', bg: '#f1f0ec' }
};

const renderStars = (score) => {
  const filled = typeof score === 'number' ? Math.min(Math.max(score, 1), 5) : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => <IconStar key={i} filled={i <= filled} />)}
    </div>
  );
};

const FinanceStatCard = ({ colorKey, label, value, unit, sub, borderColor, icon: IconComponent }) => {
  const colorMap = {
    green:  { bg: '#EAF3DE', stroke: '#3B6D11', sub: '#2a7a4b' },
    red:    { bg: '#FCEBEB', stroke: '#A32D2D', sub: '#A32D2D' },
    amber:  { bg: '#FAEEDA', stroke: '#854F0B', sub: '#854F0B' },
    blue:   { bg: '#eff6ff', stroke: '#1d4ed8', sub: '#1d4ed8' },
    neutral:{ bg: '#f1f0ec', stroke: '#6b6b67', sub: '#6b6b67' },
  };
  const c = colorMap[colorKey] || colorMap.neutral;
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #e8e7e2',
      borderRadius: '14px',
      padding: '1.25rem',
      borderTop: `3px solid ${borderColor || c.stroke}`,
      transition: 'box-shadow 0.18s',
    }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px',
        background: c.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '12px'
      }}>
        {IconComponent && <IconComponent color={c.stroke} />}
      </div>
      <div style={{ fontSize: '11px', color: '#9a9a96', fontWeight: '500', marginBottom: '4px', letterSpacing: '0.03em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' }}>
        <span style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: '11px', color: '#9a9a96', fontWeight: '500' }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: '11px', color: c.sub, marginTop: '2px' }}>{sub}</div>}
    </div>
  );
};

const FinancePage = () => {
  const [typeFiliere, setTypeFiliere] = useState('LAIT');
  const [analyse, setAnalyse] = useState(null);
  const [repartition, setRepartition] = useState({});
  const [evolutionAliment, setEvolutionAliment] = useState({});
  const [prixEtat, setPrixEtat] = useState(1.340);
  const [classement, setClassement] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [inflationAliment, setInflationAliment] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { toasts, removeToast, toast } = useToast();

  const handleFiliereChange = (filiere) => {
    setTypeFiliere(filiere);
    setPrixEtat(filiere === 'LAIT' ? 1.340 : 0.340);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setAnalyse(null);
      let resAnalyse = typeFiliere === 'LAIT'
        ? await financeService.getAnalyseLait(prixEtat, selectedMonth)
        : await financeService.getAnalyseOeufs(prixEtat, selectedMonth);
      setAnalyse(resAnalyse);

      if (resAnalyse?.messageStatus === 'EN PERTE') {
        toast.error(`Alerte : Filière ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'} produit à perte !`);
      } else if (resAnalyse?.messageStatus === 'RENTABLE') {
        toast.success(`Filière ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'} rentable ce mois.`);
      }

      setRepartition(await financeService.getRepartition(selectedMonth));
      setEvolutionAliment(await financeService.getEvolutionAlimentation() || {});
      setClassement(await financeService.getClassementAnimaux(selectedMonth) || []);
    } catch {
      toast.error("Erreur de chargement des données.");
    } finally {
      setLoading(false);
    }
  }, [typeFiliere, prixEtat, selectedMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalRep = Object.values(repartition).reduce((a, b) => a + b, 0);
  const margeProd = analyse?.margeProductionUnitaire?.toFixed(3) ?? "0.000";
  const margeGlobale = analyse?.margeGlobale?.toFixed(3) ?? "0.000";
  const isProdRentable = parseFloat(margeProd) >= 0;
  const isExploitRentable = analyse?.messageStatus === 'RENTABLE';
  const isNoProd = analyse?.messageStatus === 'PAS DE PRODUCTION';
  const isLoss = analyse?.messageStatus === 'EN PERTE';
  const margeReelle = analyse?.coutGlobalParUnite ? (prixEtat - analyse.coutGlobalParUnite).toFixed(3) : "0.000";

  const alimentationOriginale = repartition['ALIMENTATION'] || 0;
  const alimentationSimulee = alimentationOriginale * (1 + inflationAliment / 100);
  const autresDepenses = (analyse?.totalToutesDepenses || 0) - alimentationOriginale;
  const totalDepensesSimulees = autresDepenses + alimentationSimulee;
  const coutGlobalSimule = (analyse?.totalProduction > 0) ? totalDepensesSimulees / analyse.totalProduction : 0;
  const margeSimulee = (analyse?.totalProduction > 0) ? (prixEtat - coutGlobalSimule).toFixed(3) : "0.000";
  const isRentableSimule = parseFloat(margeSimulee) >= 0;

  const monthsList = [
    { val: 1, label: 'Janvier' }, { val: 2, label: 'Février' }, { val: 3, label: 'Mars' },
    { val: 4, label: 'Avril' }, { val: 5, label: 'Mai' }, { val: 6, label: 'Juin' },
    { val: 7, label: 'Juillet' }, { val: 8, label: 'Août' }, { val: 9, label: 'Septembre' },
    { val: 10, label: 'Octobre' }, { val: 11, label: 'Novembre' }, { val: 12, label: 'Décembre' }
  ];

  const exportToPDF = () => {
    if (!analyse) { toast.error("Aucune donnée disponible à exporter !"); return; }
    const doc = new jsPDF();
    const dateGen = new Date().toLocaleDateString();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(59, 109, 17);
    doc.text("FIRMATRACK v2.0", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Gestion d'Exploitation Agricole Intelligente", 14, 25);
    doc.text(`Généré le : ${dateGen}`, 150, 20);
    doc.setDrawColor(232, 231, 226);
    doc.line(14, 30, 196, 30);
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 24);
    doc.text("RAPPORT D'ANALYSE FINANCIÈRE", 14, 40);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Éleveur : ${localStorage.getItem('user_name') || 'Non renseigné'}`, 14, 50);
    doc.text(`Filière : ${typeFiliere === 'LAIT' ? 'Lait' : 'Œufs'}`, 14, 56);
    doc.text(`Mois : ${monthsList.find(m => m.val === selectedMonth)?.label} 2026`, 14, 62);
    autoTable(doc, {
      startY: 70,
      head: [['Indicateur', 'Valeur (DT)']],
      body: [
        ['Coût de Production / Unité', `${analyse.coutProductionParUnite?.toFixed(3)} DT`],
        ['Coût Global / Unité', `${analyse.coutGlobalParUnite?.toFixed(3)} DT`],
        ['Prix État', `${prixEtat.toFixed(3)} DT`],
        ['Marge Nette / Unité', `${margeReelle} DT`],
        ['Production Totale', `${analyse.totalProduction} ${typeFiliere === 'LAIT' ? 'L' : 'U'}`],
        ['Rentabilité Globale', `${margeGlobale} DT`],
        ['Statut', analyse.messageStatus]
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 24] },
      columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } }
    });
    const y1 = doc.lastAutoTable?.finalY + 15 || 160;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("RÉPARTITION DES CHARGES", 14, y1 - 4);
    autoTable(doc, {
      startY: y1,
      head: [['Catégorie', 'Montant']],
      body: Object.entries(repartition).map(([cat, val]) => [cat.replace('_', ' '), `${val.toFixed(2)} DT`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 109, 17] },
      columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } }
    });
    const y2 = doc.lastAutoTable?.finalY + 20 || 240;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Document généré par FirmaTrack — Exploitation agricole certifiée.", 14, y2);
    doc.save(`FirmaTrack_Bilan_${typeFiliere}_${selectedMonth}_2026.pdf`);
    toast.success("Rapport exporté en PDF !");
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
            <span>Ferme El Baraka</span>
            <span>/</span>
            <span style={{ color: '#1a1a18' }}>Analyse Financière</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
                Analyse Financière
              </h1>
              <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
                Pilotez la rentabilité de votre exploitation agricole.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              
              <div style={s.pillSelector}>
                {['LAIT', 'OEUFS'].map(f => (
                  <button key={f} onClick={() => handleFiliereChange(f)} style={{
                    ...s.pillBtn,
                    background: typeFiliere === f ? '#1a1a18' : 'transparent',
                    color: typeFiliere === f ? '#fff' : '#9a9a96'
                  }}>{f === 'LAIT' ? 'Lait' : 'Œufs'}</button>
                ))}
              </div>

              <div style={s.statePriceBox}>
                <span style={{ color: '#9a9a96', fontSize: '11px', fontWeight: '500' }}>Mois</span>
                <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}
                  style={{ border: 'none', background: 'none', fontWeight: '500', fontSize: '12px', outline: 'none', cursor: 'pointer', color: '#1a1a18', fontFamily: "'DM Sans', sans-serif" }}>
                  {monthsList.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                </select>
              </div>

              <div style={s.statePriceBox}>
                <span style={{ color: '#9a9a96', fontSize: '11px', fontWeight: '500' }}>Prix État</span>
                <input type="number" step="0.010" value={prixEtat} onChange={e => setPrixEtat(parseFloat(e.target.value) || 0)}
                  style={s.stateInput} />
                <span style={{ color: '#9a9a96', fontSize: '11px' }}>DT</span>
              </div>

              <button onClick={exportToPDF} style={s.btnSecondary}>
                <IconExport /> Exporter
              </button>

              <button onClick={() => navigate('/finance/enregistrer')} style={s.btnPrimary}>
                <IconPlus /> Saisir charges
              </button>
            </div>
          </div>

          {!loading && analyse && (
            <div style={{
              ...s.headerAdvice,
              background: isNoProd ? '#f1f0ec' : (isLoss ? '#FCEBEB' : '#EAF3DE'),
              border: `0.5px solid ${isNoProd ? '#e8e7e2' : (isLoss ? '#A32D2D33' : '#3B6D1133')}`,
              color: isNoProd ? '#6b6b67' : (isLoss ? '#A32D2D' : '#2a7a4b'),
            }}>
              {isNoProd ? <IconInfo /> : (isLoss ? <IconAlert /> : (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ))}
              {isNoProd
                ? "Aucune production enregistrée pour ce mois-ci."
                : isLoss
                ? "Attention : votre coût global dépasse le prix de vente fixé par l'État."
                : "Bonne gestion : votre marge réelle est positive ce mois."}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
            <FinanceStatCard
              colorKey={isProdRentable ? 'green' : 'red'}
              borderColor={isProdRentable ? '#3B6D11' : '#A32D2D'}
              label={`COÛT PRODUCTION / ${typeFiliere === 'LAIT' ? 'L' : 'U'}`}
              value={analyse?.coutProductionParUnite?.toFixed(3) ?? '—'}
              unit="DT"
              sub={!isNoProd ? `Marge : ${margeProd} DT` : 'Pas de production'}
              icon={IconProduction}
            />
            <FinanceStatCard
              colorKey={isExploitRentable ? 'green' : isNoProd ? 'neutral' : 'red'}
              borderColor={isExploitRentable ? '#3B6D11' : isNoProd ? '#9a9a96' : '#A32D2D'}
              label={`COÛT GLOBAL / ${typeFiliere === 'LAIT' ? 'L' : 'U'}`}
              value={analyse?.coutGlobalParUnite?.toFixed(3) ?? '—'}
              unit="DT"
              sub="Charges fixes incluses"
              icon={IconGlobal}
            />
            <FinanceStatCard
              colorKey={isNoProd ? 'neutral' : isExploitRentable ? 'green' : 'red'}
              borderColor={isNoProd ? '#9a9a96' : isExploitRentable ? '#3B6D11' : '#A32D2D'}
              label="RENTABILITÉ GLOBALE"
              value={isNoProd ? '—' : margeGlobale}
              unit={isNoProd ? '' : 'DT'}
              sub={!isNoProd ? `${analyse?.messageStatus}  ·  ${margeReelle} DT/U` : analyse?.messageStatus}
              icon={IconTrendUp}
            />
            <FinanceStatCard
              colorKey="blue"
              borderColor="#1d4ed8"
              label={`PRODUCTION TOTALE`}
              value={analyse?.totalProduction ?? 0}
              unit={typeFiliere === 'LAIT' ? 'Litres' : 'Œufs'}
              sub={`Dépenses : ${analyse?.totalToutesDepenses?.toFixed(2) ?? '0.00'} DT`}
              icon={IconTotal}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={s.cardTitle}>Impact sur le Coût de Production</span>
                  <span style={s.badge}>Mois en cours</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.keys(repartition).length === 0 ? (
                    <span style={{ fontSize: '12.5px', color: '#9a9a96' }}>Aucune charge enregistrée ce mois.</span>
                  ) : Object.entries(repartition).map(([cat, val]) => {
                    const cfg = CATEGORY_MAP[cat] || CATEGORY_MAP.AUTRES;
                    const pct = totalRep > 0 ? (val / totalRep) * 100 : 0;
                    const impact = (analyse?.totalProduction > 0) ? (val / analyse.totalProduction).toFixed(3) : '0.000';
                    return (
                      <div key={cat} style={{ borderLeft: `2.5px solid ${cfg.color}`, paddingLeft: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a18' }}>{cfg.label}</div>
                            <div style={{ fontSize: '11px', color: cfg.color, fontWeight: '500', marginTop: '1px' }}>
                              Impact : {impact} DT / {typeFiliere === 'LAIT' ? 'L' : 'U'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a18' }}>{val.toFixed(2)} DT</div>
                            <div style={{ fontSize: '10.5px', color: '#9a9a96' }}>{pct.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#f1f0ec', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: '10px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={s.cardTitle}>Évolution mensuelle — Budget Alimentation</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#d97706' }}>
                    <IconTrend /> Historique
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {Object.keys(evolutionAliment).length > 0 ? (
                    Object.entries(evolutionAliment)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([mois, total], i, arr) => (
                        <div key={mois} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 0',
                          borderBottom: i < arr.length - 1 ? '0.5px solid #f1f0ec' : 'none'
                        }}>
                          <span style={{ fontSize: '12.5px', fontWeight: '500', color: '#6b6b67' }}>Mois {mois}</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#d97706' }}>
                            {(total || 0).toFixed(2)} DT
                          </span>
                        </div>
                      ))
                  ) : (
                    <span style={{ fontSize: '12.5px', color: '#9a9a96' }}>Aucun historique disponible.</span>
                  )}
                </div>
              </div>
            </div>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '1.5rem' }}>

              <div style={{
                background: '#1a1a18', borderRadius: '14px', padding: '1.25rem',
                border: '0.5px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Simulation de Crise
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#8a8a80' }}>Hausse prix aliments</span>
                  <span style={{ fontSize: '20px', fontWeight: '500', color: '#f59e0b' }}>+{inflationAliment}%</span>
                </div>

                <input type="range" min="0" max="100" step="5" value={inflationAliment}
                  onChange={e => setInflationAliment(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer', marginBottom: '1rem', height: '4px' }} />

                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#6b6b64', marginBottom: '4px', fontWeight: '500', letterSpacing: '0.04em' }}>
                    MARGE ESTIMÉE APRÈS HAUSSE
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '500', color: isNoProd ? '#6b6b64' : (isRentableSimule ? '#4ade80' : '#f87171') }}>
                    {isNoProd ? '—' : `${parseFloat(margeSimulee) >= 0 ? '+' : ''}${margeSimulee}`}
                    <span style={{ fontSize: '11px', color: '#6b6b64', marginLeft: '4px' }}>DT / U</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#FAEEDA', borderRadius: '14px', padding: '1.25rem', border: '0.5px solid #d97706' + '33' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#854F0B', marginBottom: '8px' }}>
                  Analyse Prédictive Inflation
                </div>
                <p style={{ fontSize: '12.5px', color: '#b45309', lineHeight: 1.6, margin: 0 }}>
                  {isNoProd
                    ? "Aucune production enregistrée. La simulation sera disponible dès la saisie des rendements."
                    : <>
                      Une hausse de <strong>{inflationAliment}%</strong> porterait le coût global à <strong>{coutGlobalSimule.toFixed(3)} DT / U</strong>, 
                      résultant en une marge de <strong style={{ color: isRentableSimule ? '#2a7a4b' : '#A32D2D' }}>{margeSimulee} DT / U</strong>.
                    </>
                  }
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 14px', background: '#fff', borderRadius: '12px', border: '0.5px solid #e8e7e2' }}>
                <div style={{ color: '#9a9a96', flexShrink: 0, marginTop: '1px' }}><IconInfo /></div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#6b6b67', lineHeight: 1.5 }}>
                  Ajustez le curseur pour simuler l'impact d'une hausse mondiale du soja ou du maïs sur votre ferme.
                </p>
              </div>
            </aside>
          </div>

          <div style={{ ...s.card, marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={s.cardTitle}>Classement de Rentabilité par Animal</div>
                <div style={{ fontSize: '11.5px', color: '#9a9a96', marginTop: '3px' }}>
                  Identifiez vos animaux les plus performants et ceux en perte.
                </div>
              </div>
              <span style={s.badge}>Score de performance</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                  {['Animal', 'Type', 'Numéro ID', `Production (${typeFiliere === 'LAIT' ? 'L' : 'U'})`, 'Marge estimée', 'Score'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', fontSize: '11px', fontWeight: '500', color: '#9a9a96', textAlign: h === 'Score' ? 'right' : 'left', letterSpacing: '0.03em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classement.length > 0 ? classement.map((animal, i) => {
                  const isAnimalLoss = (animal.margeNette || 0) < 0;
                  return (
                    <tr key={animal.id || i} style={{ borderBottom: '0.5px solid #f1f0ec', transition: 'background 0.14s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={s.td}><span style={{ fontWeight: '500', color: '#1a1a18' }}>{animal.nom || 'Anonyme'}</span></td>
                      <td style={s.td}>
                        <span style={{ fontSize: '11px', background: '#f1f0ec', color: '#6b6b67', borderRadius: '20px', padding: '2px 9px', fontWeight: '500', textTransform: 'uppercase', border: '0.5px solid #e8e7e2' }}>
                          {animal.type?.toUpperCase() ?? 'N/A'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ background: '#f1f0ec', color: '#1a1a18', borderRadius: '6px', padding: '3px 8px', fontWeight: '600', fontSize: '12px', fontFamily: 'monospace' }}>
                          {animal.chepnumber}
                        </span>
                      </td>
                      <td style={s.td}>{(animal.totalProduction || 0).toFixed(1)}</td>
                      <td style={{ ...s.td, fontWeight: '500', color: isAnimalLoss ? '#A32D2D' : '#2a7a4b' }}>
                        {isAnimalLoss ? '' : '+'}{(animal.margeNette || 0).toFixed(3)} DT
                      </td>
                      <td style={{ ...s.td, textAlign: 'right' }}>{renderStars(animal.scoreEtoiles)}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#9a9a96', padding: '2rem' }}>
                      Aucun animal enregistré pour l'évaluation ce mois.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

// ── STYLES SYSTÈME ──
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
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#1a1a18', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#EAF3DE', color: '#3B6D11', border: '0.5px solid #3B6D1133',
    padding: '8px 16px', borderRadius: '10px',
    fontWeight: '500', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.15s',
  },
  pillSelector: {
    display: 'flex',
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    padding: '3px',
    borderRadius: '10px',
    gap: '3px',
  },
  pillBtn: {
    border: 'none',
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontFamily: "'DM Sans', sans-serif",
  },
  statePriceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    padding: '6px 14px',
    borderRadius: '10px',
    border: '0.5px solid #e8e7e2',
    fontSize: '12px',
  },
  stateInput: {
    width: '60px',
    border: 'none',
    background: '#f1f0ec',
    padding: '3px 6px',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '12px',
    textAlign: 'center',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
  },
  headerAdvice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '12.5px',
    fontWeight: '500',
    marginBottom: '1.25rem', 
  },
  td: {
    padding: '11px 8px',
    fontSize: '13px',
    color: '#1a1a18',
  }
};

export default FinancePage;