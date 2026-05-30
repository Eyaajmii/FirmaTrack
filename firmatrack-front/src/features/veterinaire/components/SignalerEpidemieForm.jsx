import React, { useState } from 'react';
import { useToast } from '../../../components/common/Toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { signalerEpidemie } from '../services/VeterinaireService';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #A32D2D33', 
    borderRadius: '14px',
    padding: '1.25rem',
    boxSizing: 'border-box'
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'start',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: '#FCEBEB', 
    border: '0.5px solid #A32D2D22',
    color: '#A32D2D',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  verticalGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '10.5px',
    fontWeight: '600',
    color: '#A32D2D99',
    textTransform: 'uppercase',
    marginBottom: '6px',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  mapContainerWrapper: {
    height: '200px', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    border: '0.5px solid #A32D2D33'
  },
  btnDanger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: '#A32D2D',
    color: '#fff',
    border: 'none',
    padding: '11px 18px',
    borderRadius: '10px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s',
    width: '100%',
  }
};

const IconAlert = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: '2px' }}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const SignalerEpidemieForm = ({ onAlerteCree }) => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([36.8065, 10.1815]);
  const [hasClicked, setHasClicked] = useState(false);
  const [formData, setFormData] = useState({ maladie: 'Rage', gouvernorat: 'Tunis', description: '' });

  const { toast } = useToast();

  const maladies = ['Rage', 'Fièvre Aphteuse', 'Grippe Aviaire', 'Brucellose', 'Autre épidémie'];

  const detecterGouvernorat = (lat, lng) => {
    if (lat >= 36.7 && lat <= 36.9 && lng >= 10.0 && lng <= 10.3) {
      return 'TUNIS';
    } else if (lat >= 36.8 && lat <= 37.0 && lng >= 10.0 && lng <= 10.3) {
      return 'ARIANA';
    } else if (lat >= 36.4 && lat <= 37.0 && lng >= 8.8 && lng <= 9.5) {
      return 'BEJA';
    } else if (lat >= 37.0 && lat <= 37.4 && lng >= 9.5 && lng <= 10.0) {
      return 'BIZERTE';
    } else if (lat >= 36.2 && lat <= 36.9 && lng >= 8.3 && lng <= 8.8) {
      return 'JENDOUBA';
    }
    return 'TUNIS';
  };

  const handleMapClick = async (lat, lng) => {
    setPosition([lat, lng]);
    setHasClicked(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=fr&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.address) {
        const govName = data.address.state || data.address.county || data.address.province || 'TUNIS';
        
        const govNettoye = govName
          .replace("Gouvernorat de", "")
          .replace("Gouvernorat", "")
          .trim();

        setFormData(prev => ({
          ...prev,
          gouvernorat: govNettoye.toUpperCase()
        }));

        toast.success(`Région détectée : ${govNettoye}`);
      }
    } catch (err) {
      console.error(err);
      setFormData(prev => ({ ...prev, gouvernorat: 'TUNIS' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasClicked) {
      toast.error("Cliquez sur la carte pour localiser l'épidémie.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        latitude: position[0],
        longitude: position[1]
      };

      await signalerEpidemie(payload);
      toast.success("Alerte sanitaire publiée sur la carte.");
      
      setFormData({ maladie: 'Rage', gouvernorat: 'Tunis', description: '' });
      setHasClicked(false);
      if (onAlerteCree) onAlerteCree();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.alertBanner}>
        <IconAlert /> 
        <div>
          <span style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>
            Signaler une Épidémie
          </span>
          <span style={{ fontSize: '11px', opacity: 0.9, lineHeight: '1.4', display: 'block' }}>
            Cliquez sur la carte pour positionner l'alerte.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.mapContainerWrapper}>
          <MapContainer center={[36.8065, 10.1815]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onMapClick={handleMapClick} />
            {hasClicked && <Marker position={position} />}
          </MapContainer>
        </div>

        <div style={s.verticalGroup}>
          <div>
            <label style={s.label}>Maladie</label>
            <select style={s.select} value={formData.maladie} onChange={(e) => setFormData({...formData, maladie: e.target.value})}>
              {maladies.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Gouvernorat</label>
            <input type="text" placeholder="Ex: Tunis, Béja..." style={s.input} value={formData.gouvernorat} onChange={(e) => setFormData({...formData, gouvernorat: e.target.value})} required />
          </div>
        </div>

        <div>
          <label style={s.label}>Instructions de sécurité</label>
          <textarea required placeholder="Consignes aux éleveurs..." style={{ ...s.input, height: '70px', resize: 'none' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} style={s.btnDanger}>
          {loading ? "Publication de l'alerte..." : "Publier l'Alerte"}
        </button>
      </form>
    </div>
  );
};

export default SignalerEpidemieForm;