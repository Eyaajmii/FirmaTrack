import { useState } from "react";
const table = { width: "100%", borderCollapse: "collapse" };

const th = {
  fontSize: "10px",
  color: "#b0afa9",
  padding: "8px",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};

const td = {
  fontSize: "12px",
  padding: "10px",
  borderBottom: "1px solid #f5f5f5",
};

const tr = {
  cursor: "pointer",
};

const deleteBtn = {
  color: "red",
  border: "1px solid #eee",
  padding: "4px 8px",
  borderRadius: "6px",
  background: "#fff",
};

const actionBtn = {
  color: "green",
  border: "1px solid #eee",
  padding: "4px 8px",
  borderRadius: "6px",
  background: "#fff",
};

const emptyStyle = {
  textAlign: "center",
  padding: "2rem",
  color: "#aaa",
};
const VaccinationList = ({ vaccinations, onDelete, onRealise }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!vaccinations || vaccinations.length === 0) {
    return <div style={emptyStyle}>Aucune vaccination trouvée.</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <thead>
          <tr>
            {[
              "Vaccin",
              "Date prévue",
              "Date réalisée",
              "Statut",
              "Actions",
            ].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {vaccinations.map((v) => {
            const isConfirm = confirmDeleteId === v.id;

            return (
              <tr key={v.id} style={tr}>
                <td style={td}>{v.vaccin}</td>
                <td style={td}>{v.datePlanifiee}</td>
                <td style={td}>{v.dateRealisee || "—"}</td>
                <td style={td}>{v.statut}</td>

                <td style={td}>
                  <button onClick={() => onRealise(v.id)} style={actionBtn}>
                    Marquer réalisée
                  </button>

                  {isConfirm ? (
                    <>
                      <button onClick={() => onDelete(v.id)}>Oui</button>
                      <button onClick={() => setConfirmDeleteId(null)}>
                        Non
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(v.id)}
                      style={deleteBtn}
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VaccinationList;
