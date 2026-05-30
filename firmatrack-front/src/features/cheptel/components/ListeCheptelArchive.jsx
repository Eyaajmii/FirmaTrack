function ListeCheptelArchive({ animals, onRestore,onSelect }) {
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
        Aucun animal archivé.
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
          {animals.map((animal) => (
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
              <td style={{ ...td, fontWeight: "500" }}>{animal.nom || "—"}</td>

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
                <span
                  style={{
                    display: "inline-flex",
                    padding: "3px 9px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "500",
                    background: "#FEFAE0",
                    color: "#9A7F00",
                    border: "0.5px solid #E8D84A",
                  }}
                >
                  Archivé
                </span>
              </td>

              <td style={td}>
                <button
                  onClick={(e) => {e.stopPropagation();onRestore(animal.id)}}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "7px",
                    fontSize: "11px",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "0.5px solid #e8e7e2",
                    background: "#fff",
                    color: "#3B6D11",
                  }}
                >
                  Restaurer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListeCheptelArchive;
