import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statutBadge = (statut) => {
  const map = {
    ALIVE: { bg: "#EAF3DE", color: "#27500A", border: "#C0DD97" },
    SOLD: { bg: "#FAEEDA", color: "#633806", border: "#FAC775" },
    DEAD: { bg: "#FCEBEB", color: "#791F1F", border: "#F7C1C1" },
  };
  const s = map[statut] || map["ALIVE"];
  return {
    display: "inline-flex",
    padding: "3px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "500",
    letterSpacing: "0.02em",
    background: s.bg,
    color: s.color,
    border: `0.5px solid ${s.border}`,
  };
};

const statutLabel = { ALIVE: "Vivant", SOLD: "Vendu", DEAD: "Décédé" };

const CheptelList = ({ animals, onDelete, onSelect }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  if (!animals || animals.length === 0) {
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
        Aucun animal trouvé.
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

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              "Animal",
              "Numéro",
              "Type / Race",
              "Genre",
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
          {animals.map((animal) => {
            const isConfirm = confirmDeleteId === animal.id;
            return (
              <tr
                key={animal.id}
                onClick={() => onSelect(animal)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#faf9f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                style={{ transition: "background 0.1s" }}
              >
                <td style={{ ...td, fontWeight: "500" }}>
                  {animal.nom || "—"}
                </td>
                <td style={td}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "#f1f0ec",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      color: "#4a4a47",
                    }}
                  >
                    {animal.chepnumber}
                  </span>
                </td>
                <td style={{ ...td, color: "#6b6b67" }}>
                  {animal.type}
                  {animal.race ? ` — ${animal.race}` : ""}
                </td>
                <td style={{ ...td, color: "#6b6b67" }}>
                  {animal.gender === "F"
                    ? "Femelle"
                    : animal.gender === "M"
                    ? "Mâle"
                    : "—"}
                </td>
                <td style={td}>
                  <span style={statutBadge(animal.statut)}>
                    {statutLabel[animal.statut] || animal.statut}
                  </span>
                </td>

                <td style={td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cheptels/edit/${animal.id}`, {
                          state: animal,
                        });
                      }}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "7px",
                        fontSize: "11px",
                        border: "0.5px solid #e8e7e2",
                        background: "#fff",
                        cursor: "pointer",
                        color: "green",
                      }}
                    >
                      Update
                    </button>
                    {isConfirm ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // ← ajouté
                            onDelete(animal.id);
                            setConfirmDeleteId(null); // ← ajouté
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
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(animal.id);
                        }}
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

export default CheptelList;
