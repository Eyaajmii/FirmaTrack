import { useState } from "react";

const LotList = ({ lots, onDelete, onSelect }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!lots || lots.length === 0) {
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
        Aucun lot trouvé.
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
    verticalAlign: "middle",
  };

  const actionBtn = (variant = "default") => ({
    padding: "4px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "500",
    cursor: "pointer",
    border: "0.5px solid",
    ...(variant === "danger"
      ? { borderColor: "#f7c1c1", background: "#fff", color: "#A32D2D" }
      : variant === "confirm"
      ? { borderColor: "#A32D2D", background: "#A32D2D", color: "#fff" }
      : { borderColor: "#e8e7e2", background: "#fff", color: "#4a4a47" }),
  });

  const badge = {
    background: "#f1f0ec",
    padding: "3px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    color: "#4a4a47",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Nom du lot", "Description", "Nb Animaux", "Actions"].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {lots.map((lot) => {
            const isConfirm = confirmDeleteId === lot.id;

            return (
              <tr
                key={lot.id}
                onClick={() => onSelect(lot)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#faf9f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                style={{ transition: "background 0.1s" }}
              >
                {/* NOM */}
                <td style={{ ...td, fontWeight: "500" }}>{lot.nom || "—"}</td>

                {/* DESCRIPTION */}
                <td style={{ ...td, color: "#6b6b67" }}>
                  {lot.description
                    ? lot.description.length > 40
                      ? lot.description.substring(0, 40) + "..."
                      : lot.description
                    : "—"}
                </td>

                {/* NB ANIMAUX */}
                <td style={td}>
                  <span style={badge}>
                    {lot.cheptels ? lot.cheptels.length : 0} animaux
                  </span>
                </td>

                {/* ACTIONS */}
                <td style={td}>
                  {isConfirm ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#9a9a96" }}>
                        Confirmer ?
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(lot.id);
                          setConfirmDeleteId(null);
                        }}
                        style={actionBtn("confirm")}
                      >
                        Oui
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        style={actionBtn()}
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(lot.id);
                      }}
                      style={actionBtn("danger")}
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

export default LotList;
