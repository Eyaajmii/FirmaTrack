import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

const s = {
  textMsg: {
    margin: "0 0 10px",
    fontSize: "12.5px",
    color: "#9a9a96",
    fontWeight: "500"
  },
  mapContainer: {
    height: "380px",
    borderRadius: "10px",
    border: "0.5px solid #e8e7e2",
    zIndex: 0
  },
  addressBox: {
    marginTop: "12px",
    padding: "10px 14px",
    background: "#EAF3DE",
    border: "0.5px solid #3B6D1122",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#2a7a4b",
    minHeight: "38px",
    boxSizing: "border-box"
  },
  latLngBox: {
    marginTop: "6px",
    fontSize: "11px",
    color: "#9a9a96"
  },
  btnConfirm: {
    marginTop: "14px",
    background: "#1a1a18",
    color: "white",
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "13px",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.15s"
  },
  btnDisabled: {
    marginTop: "14px",
    background: "#f1f0ec",
    color: "#9a9a96",
    padding: "12px 24px",
    borderRadius: "10px",
    border: "0.5px solid #e8e7e2",
    fontWeight: "500",
    cursor: "not-allowed",
    fontSize: "13px",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif"
  }
};

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
        fetchAddress(lat, lng);
        setLoadingGps(false);
      },
      () => {
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

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
      <p style={s.textMsg}>
        {loadingGps
          ? "Recupération de votre position GPS..."
          : "Cliquez sur la carte ou déplacez le marqueur"}
      </p>

      <div style={s.mapContainer}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "10px", zIndex: 0 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {flyTarget && <FlyToPosition position={flyTarget} />}

          <LocationMarker onPick={handlePick} />

          <DraggableMarker position={position} onPick={handlePick} />
        </MapContainer>
      </div>

      <div style={s.addressBox}>
        {loadingAddress ? (
          <span style={{ color: "#6b6b67" }}>Chargement de l'adresse...</span>
        ) : address ? (
          <>
            <strong>Adresse :</strong> {address}
          </>
        ) : (
          <span style={{ color: "#9a9a96" }}>Aucune adresse sélectionnée</span>
        )}
      </div>

      <div style={s.latLngBox}>
        <strong>Lat :</strong> {position.lat.toFixed(6)} &nbsp;|&nbsp;
        <strong>Lng :</strong> {position.lng.toFixed(6)}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={loadingAddress}
        style={loadingAddress ? s.btnDisabled : s.btnConfirm}
      >
        {loadingAddress ? "Chargement de l'adresse..." : "Confirmer cette localisation"}
      </button>
    </div>
  );
}