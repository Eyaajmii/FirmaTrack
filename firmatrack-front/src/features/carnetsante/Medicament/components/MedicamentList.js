const MedicamentList = ({ medicaments }) => {
  if (!medicaments || medicaments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
        Aucun médicament trouvé.
      </div>
    );
  }
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

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <thead>
          <tr>
            {["Nom", "Quantité", "Dosage", "Fréquence", "Voie"].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {medicaments.map((m) => {
            return (
              <tr key={m.id} style={tr}>
                <td style={td}>{m.stockItem?.nom || "—"}</td>
                <td style={td}>{m.quantiteUtilisee}</td>
                <td style={td}>{m.dosage}</td>
                <td style={td}>{m.frequence}</td>
                <td style={td}>{m.voieAdministration}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MedicamentList;
