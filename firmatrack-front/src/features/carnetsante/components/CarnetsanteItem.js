function CarnetSanteItem({ carnet, onDelete, onSelect }) {
  return (
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #f0efe9",
        fontSize: "12px",
      }}
    >
      <p style={{ margin: 0 }}>
        <b>ID:</b> {carnet.id} | <b>Animal:</b> {carnet.animal?.nom || "—"} |{" "}
        <b>Groupe sanguin:</b> {carnet.groupeSanguin || "—"} | <b>Allergies:</b>{" "}
        {carnet.allergies || "Aucune"} | <b>Maladies:</b>{" "}
        {carnet.maladies?.length || 0} | <b>Vaccinations:</b>{" "}
        {carnet.vaccinations?.length || 0}
      </p>

      <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => onSelect && onSelect(carnet)}
          style={{
            padding: "4px 10px",
            fontSize: "11px",
            border: "1px solid #e8e7e2",
            background: "#fff",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Voir
        </button>

        <button
          onClick={() => onDelete(carnet.id)}
          style={{
            padding: "4px 10px",
            fontSize: "11px",
            border: "1px solid #f7c1c1",
            background: "#fff",
            color: "#A32D2D",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default CarnetSanteItem;
