import { useState } from "react";

const RendezVousList = ({
  rdvs,
  role,
  onDelete,
  onConfirmer,
  onTerminer,
  onAnnuler,
  onEditer,
}) => {
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
      : variant === "neutral"
      ? { borderColor: "#c5c4be", color: "#4a4a47", background: "#f7f6f4" }
      : { borderColor: "#e8e7e2", background: "#fff", color: "#4a4a47" }),
  });

  const getStatutStyle = (statut) => {
    if (statut === "Confirme")
      return { background: "#EAF3DE", color: "#27500A" };
    if (statut === "Termine")
      return { background: "#f1f0ec", color: "#4a4a47" };
    if (statut === "Annule") return { background: "#fdeaea", color: "#A32D2D" };
    return { background: "#FAEEDA", color: "#854F0B" };
  };

  const isAdmin = role === "ADMIN";
  const isVet = role === "VETERINAIRE";
  const isFermier = role === "FERMIER";

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
            const statut = r.statut;
            const nonTermine = statut !== "Termine" && statut !== "Annule";

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
                <td style={td}>{new Date(r.dateRdv).toLocaleString()}</td>
                <td style={{ ...td, fontWeight: "500" }}>
                  {r.animal?.nom || "—"}
                </td>
                <td style={{ ...td, fontWeight: "500" }}>
                  {r.veterinaire?.nomVet || "—"}
                </td>
                <td style={td}>{r.motif}</td>
                <td style={{ ...td, color: "#6b6b67" }}>
                  {r.symptomes || "—"}
                </td>
                <td style={td}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      ...getStatutStyle(statut),
                    }}
                  >
                    {statut}
                  </span>
                </td>
                <td style={td}>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {/* ── ADMIN ── */}
                    {isAdmin && (
                      <>
                        {/* Confirmer : si statut demandé */}
                        {statut === "Demande" && (
                          <button
                            onClick={() => onConfirmer(r.id)}
                            style={actionBtn("success")}
                          >
                            Confirmer
                          </button>
                        )}

                        {/* Terminer : si statut confirmé */}
                        {statut === "Confirme" && (
                          <button
                            onClick={() => onTerminer(r.id)}
                            style={actionBtn("warning")}
                          >
                            Terminer
                          </button>
                        )}

                        {/* Annuler : si pas encore terminé/annulé */}
                        {nonTermine && (
                          <button
                            onClick={() => onAnnuler(r.id)}
                            style={actionBtn("neutral")}
                          >
                            Annuler
                          </button>
                        )}

                        {isConfirm ? (
                          <>
                            <button
                              onClick={() => {
                                onDelete(r.id);
                                setConfirmDeleteId(null);
                              }}
                              style={actionBtn("danger")}
                            >
                              Oui
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              style={actionBtn()}
                            >
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
                      </>
                    )}
                    {isFermier && (
                      <>
                        {/* Éditer : si pas encore terminé/annulé */}
                        {nonTermine && (
                          <button
                            onClick={() => onEditer(r.id)}
                            style={actionBtn()}
                          >
                            Éditer
                          </button>
                        )}

                        {/* Annuler : si pas encore terminé/annulé */}
                        {nonTermine && (
                          <button
                            onClick={() => onAnnuler(r.id)}
                            style={actionBtn("neutral")}
                          >
                            Annuler
                          </button>
                        )}
                      </>
                    )}
                    {/* ── VÉTÉRINAIRE ── */}
                    {isVet && (
                      <>
                        {statut === "Demande" && (
                          <button
                            onClick={() => onConfirmer(r.id)}
                            style={actionBtn("success")}
                          >
                            Confirmer
                          </button>
                        )}
                        {statut === "Confirme" && (
                          <button
                            onClick={() => onTerminer(r.id)}
                            style={actionBtn("warning")}
                          >
                            Terminer
                          </button>
                        )}
                        {nonTermine && (
                          <button
                            onClick={() => onAnnuler(r.id)}
                            style={actionBtn("neutral")}
                          >
                            Annuler
                          </button>
                        )}
                      </>
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
