import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lotService } from "../Services/LotService";
import LotForm from "../Components/LotForm";

function LotAddPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (data) => {
    try {
      setLoading(true);
      await lotService.createLot(data);
      navigate("/lots"); 
    } catch (err) {
      console.error("Erreur création lot", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      <button onClick={() => navigate("/lots")} style={{ marginTop: "1rem" }}>
        ← Retour
      </button>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>Ajouter un lot</h2>
        <LotForm onAdd={handleAdd} loading={loading} />
      </div>
    </div>
  );
}

export default LotAddPage;
