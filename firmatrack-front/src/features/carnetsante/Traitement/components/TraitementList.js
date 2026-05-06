
const TraitementList = ({ traitements,onSelect }) => {

  if (!traitements || traitements.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
        Aucun traitement trouvé.
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
            {["Description", "Début", "Fin", "Statut"].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {traitements.map((t) => {
            return (
              <tr key={t.id} style={tr} onClick={() => onSelect?.(t)}>
                <td style={td}>{t.description}</td>
                <td style={td}>{t.dateDebut}</td>
                <td style={td}>{t.dateFin || "—"}</td>
                <td style={td}>{t.statut}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TraitementList;
