import StockForm from '../components/StockForm';
import { useNavigate } from 'react-router-dom';

const StockAddPage = () => {
  const farmName = localStorage.getItem("farm_name") || "Ma Ferme";
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '1.5rem' }}>
          <span>{farmName}</span>
          <span>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/stock')}>Stocks</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Ajouter un intrant</span>
        </div>
        <StockForm onSuccess={() => navigate('/stock')} />
      </div>
    </div>
  );
};

export default StockAddPage;