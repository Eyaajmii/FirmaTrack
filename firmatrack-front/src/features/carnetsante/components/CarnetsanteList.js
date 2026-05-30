import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CarnetSanteList = ({ carnets, onDelete, onSelect }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const navigate = useNavigate();

  if (!carnets || carnets.length === 0) {
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
        Aucun carnet de santé trouvé.
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
              "Groupe sanguin",
              "Allergies",
              "Observations",
              "Maladies",
              "Vaccinations",
              "Actions",
            ].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {carnets.map((carnet) => {
            const isConfirm = confirmDeleteId === carnet.id;

            return (
              <tr
                key={carnet.id}
                onClick={() => navigate(`/carnetsante/${carnet.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#faf9f7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Animal */}
                <td style={{ ...td, fontWeight: "500" }}>
                  {carnet.animal?.nom || "—"}
                </td>

                {/* Groupe sanguin */}
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
                    {carnet.groupeSanguin || "—"}
                  </span>
                </td>

                {/* Allergies */}
                <td style={{ ...td, color: "#6b6b67" }}>
                  {carnet.allergies || "Aucune"}
                </td>

                {/* Observations */}
                <td style={{ ...td, color: "#6b6b67" }}>
                  {carnet.observationsGenerales || "—"}
                </td>

                {/* Maladies */}
                <td style={td}>
                  {carnet.maladies?.length > 0
                    ? `${carnet.maladies.length} maladie(s)`
                    : "Aucune"}
                </td>

                {/* Vaccinations */}
                <td style={td}>
                  {carnet.vaccinations?.length > 0
                    ? `${carnet.vaccinations.length} vaccin(s)`
                    : "Aucun"}
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/carnetsante/edit/${carnet.id}`, {
                          state: carnet,
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
                            e.stopPropagation(); 
                            onDelete(carnet.id);
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
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(carnet.id);
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

export default CarnetSanteList;
