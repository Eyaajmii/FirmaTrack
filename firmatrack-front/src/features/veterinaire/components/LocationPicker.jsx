import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { animate: true, duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

function LocationMarker({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick(lat, lng);
    },
  });
  return null;
}

function DraggableMarker({ position, onPick }) {
  const eventHandlers = {
    dragend(e) {
      const { lat, lng } = e.target.getLatLng();
      onPick(lat, lng);
    },
  };

  return (
    <Marker
      draggable={true}
      position={[position.lat, position.lng]}
      eventHandlers={eventHandlers}
    />
  );
}


export default function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState({ lat: 36.8, lng: 10.1 });
  const [address, setAddress] = useState("");
  const [loadingGps, setLoadingGps] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPos = { lat, lng };

        setPosition(newPos);
        setFlyTarget(newPos); 
        fetchAddress(lat, lng); // récupère l'adresse initiale
        setLoadingGps(false);
      },
      () => {
        // GPS refusé → on reste sur Tunis par défaut
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  //  Fetch adresse depuis lat/lng (Nominatim)
  const fetchAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handlePick = (lat, lng) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    setFlyTarget(newPos);
    fetchAddress(lat, lng);
  };

  const handleConfirm = () => {
    if (!address && !loadingAddress) {
      // Si address encore vide (ex: Nominatim lent), on envoie les coords brutes
      onSelect({
        position,
        address: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
      });
    } else {
      onSelect({ position, address });
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>
        {loadingGps
          ? "📡 Récupération de votre position GPS..."
          : "📍 Cliquez sur la carte ou déplacez le marqueur"}
      </p>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: "380px", borderRadius: "10px", zIndex: 0 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {flyTarget && <FlyToPosition position={flyTarget} />}

        <LocationMarker onPick={handlePick} />

        <DraggableMarker position={position} onPick={handlePick} />
      </MapContainer>

      <div
        style={{
          marginTop: "12px",
          padding: "10px 14px",
          background: "#f0fdf4",
          border: "1.5px solid #dcfce7",
          borderRadius: "10px",
          fontSize: "12px",
          color: "#166534",
          minHeight: "38px",
        }}
      >
        {loadingAddress ? (
          <span style={{ color: "#6b7280" }}>⏳ Chargement de l'adresse...</span>
        ) : address ? (
          <>
            <b>📍 Adresse :</b> {address}
          </>
        ) : (
          <span style={{ color: "#9ca3af" }}>Aucune adresse sélectionnée</span>
        )}
      </div>

      <div style={{ marginTop: "6px", fontSize: "11px", color: "#9ca3af" }}>
        <b>Lat :</b> {position.lat.toFixed(6)} &nbsp;|&nbsp;
        <b>Lng :</b> {position.lng.toFixed(6)}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={loadingAddress}
        style={{
          marginTop: "14px",
          background: loadingAddress
            ? "#9ca3af"
            : "linear-gradient(135deg, #059669, #047857)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
          fontWeight: "700",
          cursor: loadingAddress ? "not-allowed" : "pointer",
          fontSize: "13px",
          width: "100%",
        }}
      >
        {loadingAddress ? "⏳ Chargement adresse..." : "💾 Confirmer cette localisation"}
      </button>
    </div>
  );
}