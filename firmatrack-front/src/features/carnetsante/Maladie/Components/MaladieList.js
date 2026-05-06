
const MaladieList = ({ maladies, onSelect }) => {

  if (!maladies || maladies.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
        Aucune maladie trouvée.
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
            {["Nom", "Symptômes", "Gravité", "Statut", "Date"].map(
              (h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {maladies.map((m) => {
            return (
              <tr key={m.id} style={tr} onClick={() => onSelect?.(m)}>
                <td style={td}>{m.nomMaladie}</td>
                <td style={td}>{m.symptomes}</td>
                <td style={td}>{m.gravite}</td>
                <td style={td}>{m.statut}</td>
                <td style={td}>{m.dateDetection}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MaladieList;
