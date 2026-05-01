import React, { useState } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';
import { useToast, ToastContainer } from '../../../components/common/Toast';

const ITEMS_PER_PAGE = 5;

const badge = (isAnimal) => ({
  display: 'inline-flex', padding: '3px 9px', borderRadius: '20px',
  fontSize: '10px', fontWeight: '500',
  ...(isAnimal
    ? { background: '#f1f0ec', color: '#4a4a47', border: '0.5px solid #dddcd7' }
    : { background: '#e8f0fe', color: '#185FA5', border: '0.5px solid #b5d4f4' }),
});

const actionBtn = (variant = 'default') => ({
  padding: '4px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '500',
  cursor: 'pointer', border: '0.5px solid',
  ...(variant === 'danger'
    ? { borderColor: '#f7c1c1', background: '#fff', color: '#A32D2D' }
    : variant === 'primary'
    ? { borderColor: '#1a1a18', background: '#1a1a18', color: '#fff' }
    : variant === 'confirm'
    ? { borderColor: '#A32D2D', background: '#A32D2D', color: '#fff' }
    : { borderColor: '#e8e7e2', background: '#fff', color: '#4a4a47' }),
});

const inputStyle = {
  border: '0.5px solid #e8e7e2', borderRadius: '7px',
  padding: '4px 8px', fontSize: '12px', outline: 'none',
  background: '#fff', color: '#1a1a18',
};

const ProductionTable = ({ productions, loading, onRefresh }) => {
  const { deleteProduction, updateProduction } = useProductionLait();
  const { toasts, removeToast, toast } = useToast();

  const [currentPage, setCurrentPage]         = useState(1);
  const [editingId, setEditingId]             = useState(null);
  const [editData, setEditData]               = useState({});
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
      Aucune production enregistrée.
    </div>
  );

  const totalPages = Math.ceil(productions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = productions.slice(start, start + ITEMS_PER_PAGE);

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setEditData({ quantiteLitre: prod.quantiteLitre, dateProduction: prod.dateProduction });
  };

  const handleEditSave = async (prod) => {
    const qty = parseFloat(editData.quantiteLitre);
    if (!editData.quantiteLitre) {
      toast.warning("La quantité est obligatoire");
      return;
    } else if (isNaN(qty) || qty < 0) {
      toast.warning("La quantité ne peut pas être négative");
      return;
    } else if (qty === 0) {
      toast.warning("La quantité doit être supérieure à 0");
      return;
    }
    try {
      await updateProduction(prod.id, {
        ...prod,
        quantiteLitre: parseFloat(editData.quantiteLitre),
        dateProduction: editData.dateProduction,
      });
      toast.success(`Production modifiée — ${editData.quantiteLitre} L`);
      setEditingId(null);
      onRefresh?.();
    } catch (err) {
      toast.error("Échec de la modification. Veuillez réessayer.");
    }
  };

  const handleDelete = async (prod) => {
    try {
      await deleteProduction(prod.id);
      const name = prod.cheptel?.nom || prod.lot?.nom || 'production';
      toast.success(`Production supprimée (${name})`);
      setConfirmDeleteId(null);
      onRefresh?.();
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

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Date', 'Animal / Lot', 'Quantité', 'Type', 'Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((prod) => {
              const isAnimal = !!prod.cheptel;
              const name = isAnimal
                ? `${prod.cheptel.nom} (${prod.cheptel.chepnumber || ''})`
                : prod.lot?.nom || 'Lot inconnu';
              const isEditing = editingId === prod.id;
              const isConfirmDelete = confirmDeleteId === prod.id;

              return (
                <tr key={prod.id} style={{ transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Date */}
                  <td style={{ ...td, color: '#9a9a96' }}>
                    {isEditing ? (
                      <input type="date" value={editData.dateProduction}
                        onChange={e => setEditData(p => ({ ...p, dateProduction: e.target.value }))}
                        style={{ ...inputStyle, width: '130px' }} />
                    ) : new Date(prod.dateProduction).toLocaleDateString('fr-FR')}
                  </td>

                  {/* Nom */}
                  <td style={{ ...td, fontWeight: '500' }}>{name}</td>

                  {/* Quantité */}
                  <td style={td}>
                    {isEditing ? (
                      <input type="number" step="0.1" min="0" value={editData.quantiteLitre}
                        onChange={e => setEditData(p => ({ ...p, quantiteLitre: e.target.value }))}
                        style={{ ...inputStyle, width: '80px' }} />
                    ) : (
                      <span style={{ fontWeight: '500' }}>{prod.quantiteLitre} L</span>
                    )}
                  </td>

                  {/* Type */}
                  <td style={td}>
                    <span style={badge(isAnimal)}>{isAnimal ? 'Animal' : 'Lot'}</span>
                  </td>

                  {/* Actions */}
                  <td style={td}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditSave(prod)} style={actionBtn('primary')}>Sauvegarder</button>
                        <button onClick={() => setEditingId(null)} style={actionBtn()}>Annuler</button>
                      </div>
                    ) : isConfirmDelete ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#9a9a96' }}>Confirmer ?</span>
                        <button onClick={() => handleDelete(prod)} style={actionBtn('confirm')}>Oui</button>
                        <button onClick={() => setConfirmDeleteId(null)} style={actionBtn()}>Non</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditClick(prod)} style={actionBtn()}>Modifier</button>
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

export default ProductionTable;