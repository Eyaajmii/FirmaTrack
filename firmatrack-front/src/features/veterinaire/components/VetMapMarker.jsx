import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const VetMapMarker = ({ vet, isActive, onClick }) => {
  const color = vet.disponibleUrgence ? '#e8453c'
    : vet.deplacementFerme ? '#2a7a4b'
    : '#3b6fd4';

  // Marker SVG custom
  const icon = L.divIcon({
    className: '',
    html: `
      <div style="
        width:${isActive ? 34 : 26}px;
        height:${isActive ? 34 : 26}px;
        background:${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.2);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);font-size:12px;">
          ${vet.disponibleUrgence ? '🚨' : vet.deplacementFerme ? '🚗' : '🏥'}
        </span>
      </div>`,
    iconSize: [isActive ? 34 : 26, isActive ? 34 : 26],
    iconAnchor: [isActive ? 17 : 13, isActive ? 34 : 26],
  });

  return (
    <Marker
      position={[vet.latitude, vet.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>{vet.nomVet}</Popup>
    </Marker>
  );
};

export default VetMapMarker;