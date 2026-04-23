import React, { useState } from 'react';
import { useProductionOeuf } from '../hooks/useProductionOeuf';
import { useToast, ToastContainer } from '../../../components/common/Toast';

const ITEMS_PER_PAGE = 5;

const qualiteBadge = (q) => {
  const map = {
    A: { bg: '#EAF3DE', color: '#27500A', border: '#C0DD97' },
    B: { bg: '#e8f0fe', color: '#185FA5', border: '#b5d4f4' },
    C: { bg: '#FAEEDA', color: '#633806', border: '#FAC775' },
  };
  const s = map[q] || map['A'];
  return {
    display: 'inline-flex', padding: '3px 9px', borderRadius: '20px',
    fontSize: '10px', fontWeight: '500',
    background: s.bg, color: s.color, border: `0.5px solid ${s.border}`,
  };
};

const typeBadge = (isAnimal) => ({
  display: 'inline-flex', padding: '3px 9px', borderRadius: '20px',
  fontSize: '10px', fontWeight: '500',
  ...(isAnimal
    ? { background: '#f1f0ec', color: '#4a4a47', border: '0.5px solid #dddcd7' }
    : { background: '#e8f0fe', color: '#185FA5', border: '0.5px solid #b5d4f4' }),
});

const OeufTable = ({ productions, loading }) => {
  const { deleteProduction, updateProduction } = useProductionOeuf();
  const { toasts, removeToast, toast } = useToast();

  const [currentPage, setCurrentPage]       = useState(1);
  const [editingId, setEditingId]           = useState(null);
  const [editData, setEditData]             = useState({});
  const [editErrors, setEditErrors]         = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2.5rem', fontSize: '12px', color: '#b0afa9' }}>
      Chargement...
    </div>
  );

  if (!productions || productions.length === 0) return (
    <div style={{
      textAlign: 'center', padding: '2.5rem',
      border: '1.5px dashed #e8e7e2', borderRadius: '10px',
      fontSize: '12px', color: '#b0afa9',
    }}>
      Aucune collecte enregistrée.
    </div>
  );

  const totalPages = Math.ceil(productions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = productions.slice(start, start + ITEMS_PER_PAGE);

  // ── Validation édition ────────────────────────────────────────────
  const validateEdit = (data) => {
    const errors = {};
    const qty = parseInt(data.quantiteOeufs);
    if (!data.quantiteOeufs) {
      errors.quantiteOeufs = "La quantité est obligatoire";
    } else if (isNaN(qty) || qty < 0) {
      errors.quantiteOeufs = "La quantité ne peut pas être négative";
    } else if (qty === 0) {
      errors.quantiteOeufs = "La quantité doit être supérieure à 0";
    }
    return errors;
  };

  const handleEditStart = (prod) => {
    setEditingId(prod.id);
    setEditData({ dateProduction: prod.dateProduction, quantiteOeufs: prod.quantiteOeufs });
    setEditErrors({});
  };

  const handleEditSave = async (prod) => {
    const errors = validateEdit(editData);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      toast.warning(Object.values(errors)[0]);
      return;
    }
    try {
      await updateProduction(prod.id, {
        ...prod,
        dateProduction: editData.dateProduction,
        quantiteOeufs: parseInt(editData.quantiteOeufs),
      });
      toast.success(`Collecte modifiée — ${editData.quantiteOeufs} œufs`);
      setEditingId(null);
      setEditErrors({});
    } catch (err) {
      toast.error("Échec de la modification. Veuillez réessayer.");
    }
  };

  const handleDelete = async (prod) => {
    try {
      await deleteProduction(prod.id);
      const name = prod.cheptelNom || prod.lotNom || 'collecte';
      toast.success(`Collecte supprimée (${name})`);
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error("Échec de la suppression. Veuillez réessayer.");
    }
  };

  const th = {
    fontSize: '10px', fontWeight: '500', color: '#b0afa9', textTransform: 'uppercase',
    letterSpacing: '0.06em', padding: '8px 12px', borderBottom: '0.5px solid #f0efe9', textAlign: 'left',
  };
  const td = {
    fontSize: '12px', padding: '11px 12px', borderBottom: '0.5px solid #f7f6f4',
    color: '#1a1a18', verticalAlign: 'middle',
  };
  const inputStyle = (hasError) => ({
    border: `0.5px solid ${hasError ? '#f7c1c1' : '#e8e7e2'}`,
    borderRadius: '7px', padding: '4px 8px', fontSize: '12px', outline: 'none',
    background: hasError ? '#fffafa' : '#fff', color: '#1a1a18',
  });
  const actionBtn = (v = 'default') => ({
    padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '500',
    cursor: 'pointer', border: '0.5px solid',
    ...(v === 'danger'   ? { borderColor: '#f7c1c1', background: '#fff', color: '#A32D2D' }
      : v === 'primary'  ? { borderColor: '#1a1a18', background: '#1a1a18', color: '#fff' }
      : v === 'confirm'  ? { borderColor: '#A32D2D', background: '#A32D2D', color: '#fff' }
      :                    { borderColor: '#e8e7e2', background: '#fff', color: '#4a4a47' }),
  });

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Date', 'Animal / Lot', 'Quantité', 'Qualité', 'Type', 'Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((prod) => {
              const isAnimal = !!prod.cheptelId;
              const name = isAnimal
                ? `${prod.cheptelNom || ''} (${prod.cheptelNumber || ''})`
                : prod.lotNom || 'Lot inconnu';
              const isEditing = editingId === prod.id;
              const isConfirmDelete = confirmDeleteId === prod.id;

              return (
                <tr key={prod.id}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background 0.1s' }}
                >
                  {/* Date */}
                  <td style={{ ...td, color: '#9a9a96' }}>
                    {isEditing ? (
                      <input type="date" value={editData.dateProduction}
                        onChange={e => setEditData(p => ({ ...p, dateProduction: e.target.value }))}
                        style={{ ...inputStyle(false), width: '130px' }} />
                    ) : new Date(prod.dateProduction).toLocaleDateString('fr-FR')}
                  </td>

                  {/* Nom */}
                  <td style={{ ...td, fontWeight: '500' }}>{name}</td>

                  {/* Quantité */}
                  <td style={td}>
                    {isEditing ? (
                      <div>
                        <input type="number" min="1" value={editData.quantiteOeufs}
                          onChange={e => {
                            setEditData(p => ({ ...p, quantiteOeufs: e.target.value }));
                            setEditErrors(p => ({ ...p, quantiteOeufs: null }));
                          }}
                          style={{ ...inputStyle(editErrors.quantiteOeufs), width: '75px' }} />
                        {editErrors.quantiteOeufs && (
                          <div style={{ fontSize: '10px', color: '#A32D2D', marginTop: '3px', whiteSpace: 'nowrap' }}>
                            {editErrors.quantiteOeufs}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontWeight: '500' }}>{prod.quantiteOeufs} œufs</span>
                    )}
                  </td>

                  {/* Qualité */}
                  <td style={td}>
                    <span style={qualiteBadge(prod.qualite)}>Qté {prod.qualite}</span>
                  </td>

                  {/* Type */}
                  <td style={td}>
                    <span style={typeBadge(isAnimal)}>{isAnimal ? 'Animal' : 'Lot'}</span>
                  </td>

                  {/* Actions */}
                  <td style={td}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditSave(prod)} style={actionBtn('primary')}>Sauvegarder</button>
                        <button onClick={() => { setEditingId(null); setEditErrors({}); }} style={actionBtn()}>Annuler</button>
                      </div>
                    ) : isConfirmDelete ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#9a9a96' }}>Confirmer ?</span>
                        <button onClick={() => handleDelete(prod)} style={actionBtn('confirm')}>Oui</button>
                        <button onClick={() => setConfirmDeleteId(null)} style={actionBtn()}>Non</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditStart(prod)} style={actionBtn()}>Modifier</button>
                        <button onClick={() => setConfirmDeleteId(prod.id)} style={actionBtn('danger')}>Supprimer</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid #f1f0ec' }}>
          <span style={{ fontSize: '11px', color: '#b0afa9' }}>
            {start + 1}–{Math.min(start + ITEMS_PER_PAGE, productions.length)} sur {productions.length}
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ ...actionBtn(), opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
              ← Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)}
                style={{ width: '28px', height: '28px', borderRadius: '7px', fontSize: '11px', fontWeight: '500', cursor: 'pointer', border: '0.5px solid', borderColor: page === currentPage ? '#1a1a18' : '#e8e7e2', background: page === currentPage ? '#1a1a18' : '#fff', color: page === currentPage ? '#fff' : '#4a4a47' }}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ ...actionBtn(), opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
              Suivant →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OeufTable;