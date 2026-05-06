import { useState } from "react";

const RendezVousList = ({ rdvs, onDelete, onConfirmer, onTerminer }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!rdvs || rdvs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2.5rem",
          border: "1.5px dashed #e8e7e2",
          borderRadius: "10px",
          fontSize: "12px",
          color: "#b0afa9",
        }}
      >
        Aucun rendez-vous trouvé.
      </div>
    );
  }

  const th = {
    fontSize: "10px",
    fontWeight: "500",
    color: "#b0afa9",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "8px 12px",
    borderBottom: "0.5px solid #f0efe9",
    textAlign: "left",
  };

  const td = {
    fontSize: "12px",
    padding: "11px 12px",
    borderBottom: "0.5px solid #f7f6f4",
    color: "#1a1a18",
  };

  const actionBtn = (variant = "default") => ({
    padding: "4px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    cursor: "pointer",
    border: "0.5px solid",
    ...(variant === "danger"
      ? { borderColor: "#f7c1c1", color: "#A32D2D", background: "#fff" }
      : variant === "success"
      ? { borderColor: "#C0DD97", color: "#27500A", background: "#EAF3DE" }
      : variant === "warning"
      ? { borderColor: "#FAC775", color: "#854F0B", background: "#FAEEDA" }
      : { borderColor: "#e8e7e2", background: "#fff", color: "#4a4a47" }),
  });

  const getStatutStyle = (statut) => {
    if (statut === "confirmé")
      return { background: "#EAF3DE", color: "#27500A" };
    if (statut === "terminé")
      return { background: "#f1f0ec", color: "#4a4a47" };
    return { background: "#FAEEDA", color: "#854F0B" }; 
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              "Date",
              "Animal",
              "Véterinaire",
              "Motif",
              "Symptômes",
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
          {rdvs.map((r) => {
            const isConfirm = confirmDeleteId === r.id;

            return (
              <tr
                key={r.id}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#faf9f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Date */}
                <td style={td}>{new Date(r.dateRdv).toLocaleString()}</td>

                {/* Animal */}
                <td style={{ ...td, fontWeight: "500" }}>
                  {r.animal?.nom ||"-" }
                </td>
                <td style={{ ...td, fontWeight: "500" }}>
                  {r.veterinaire?.nomVet || "—"}
                </td>
                {/* Motif */}
                <td style={td}>{r.motif}</td>

                {/* Symptômes */}
                <td style={{ ...td, color: "#6b6b67" }}>
                  {r.symptomes || "—"}
                </td>

                {/* Statut */}
                <td style={td}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      ...getStatutStyle(r.statut),
                    }}
                  >
                    {r.statut}
                  </span>
                </td>

                {/* ACTIONS */}
                <td style={td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {/* CONFIRMER */}
                    {r.statut === "demandé" && (
                      <button
                        onClick={() => onConfirmer(r.id)}
                        style={actionBtn("success")}
                      >
                        Confirmer
                      </button>
                    )}

                    {/* TERMINER */}
                    {r.statut === "confirmé" && (
                      <button
                        onClick={() => onTerminer(r.id)}
                        style={actionBtn("warning")}
                      >
                        Terminer
                      </button>
                    )}

                    {/* DELETE */}
                    {isConfirm ? (
                      <>
                        <button onClick={() => onDelete(r.id)}>Oui</button>
                        <button onClick={() => setConfirmDeleteId(null)}>
                          Non
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(r.id)}
                        style={actionBtn("danger")}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RendezVousList;