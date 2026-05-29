import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as VeterinaireService from "../services/VeterinaireService";
import VetFilterBar from "../components/VetFilterBar";
import VetCard from "../components/VetCard";
import VetMapMarker from "../components/VetMapMarker";
import { useToast, ToastContainer } from "../../../components/common/Toast";

/* ---------------- MAP CONTROLLER ---------------- */
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 15);
  }, [center, zoom, map]);
  return null;
};
const FitBounds = ({ vets }) => {
  const map = useMap();

  useEffect(() => {
    if (!vets.length) return;

    const bounds = vets
      .filter((v) => v.latitude && v.longitude)
      .map((v) => [v.latitude, v.longitude]);

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vets, map]);

  return null;
};

/* ---------------- LOADER ---------------- */
const Loader = () => (
  <div style={{ textAlign: "center", padding: "2rem", color: "#8a8a80" }}>
    Chargement...
  </div>
);

const VetListMapPage = () => {
  const { toasts, removeToast, toast } = useToast();

  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("tous");
  const [activeVetId, setActiveVetId] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [viewMode, setViewMode] = useState("split");
  const [userPos, setUserPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rayonKm, setRayonKm] = useState(30);

  /* ---------------- GPS ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserPos({ lat: 36.8, lng: 10.18 });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.log("GPS error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.warning("GPS refusé");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Position indisponible");
        } else if (error.code === error.TIMEOUT) {
          toast.warning("GPS trop lent");
        }
  
        setUserPos({ lat: 36.8065, lng: 10.1815 });
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 30000,
      },
      { enableHighAccuracy: false, timeout: 30000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!userPos) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await VeterinaireService.getVeterinairesProches(
          userPos.lat,
          userPos.lng,
          rayonKm
        );

        const data = res.data || [];

        const withDist = data
          .filter((v) => v.latitude && v.longitude)
          .map((v) => ({
            ...v,
            _distance: VeterinaireService.calculDistance(
              userPos.lat,
              userPos.lng,
              v.latitude,
              v.longitude
            ),
          }))
          .sort((a, b) => a._distance - b._distance);

        setFiltered(withDist);
      } catch {
        toast.error("Erreur chargement vétérinaires");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userPos, rayonKm]);

  /* ---------------- FILTER ---------------- */
  const handleFilterChange = useCallback(
    async (key) => {
      if (!userPos) return;

      setActiveFilter(key);
      setLoading(true);

      try {
        let res;

        if (key === "tous") {
          res = await VeterinaireService.getVeterinairesProches(
            userPos.lat,
            userPos.lng,
            rayonKm
          );
        } else if (key === "urgence") {
          res = await VeterinaireService.getUrgence();
        } else if (key === "deplacementFerme") {
          res = await VeterinaireService.getDeplacementFerme();
        } else {
          res = await VeterinaireService.getBySpecialite(key);
        }

        const data = res.data || [];

        const withDist = data
          .filter((v) => v.latitude && v.longitude)
          .map((v) => ({
            ...v,
            _distance: VeterinaireService.calculDistance(
              userPos.lat,
              userPos.lng,
              v.latitude,
              v.longitude
            ),
          }));

        setFiltered(withDist);
      } catch {
        toast.error("Erreur filtre");
      } finally {
        setLoading(false);
      }
    },
    [userPos, rayonKm]
  );

  /* ---------------- CLICK ---------------- */
  const handleVetClick = (vet) => {
    setActiveVetId(vet.id);
    if (vet.latitude && vet.longitude) {
      setFlyTarget({ center: [vet.latitude, vet.longitude], zoom: 15 });
    }
  };

  const showMap = viewMode !== "list";
  const showList = viewMode !== "map";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f6f4",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "960px" }}>
        {/* ---------------- HEADER ---------------- */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "11px", color: "#b0afa9" }}>
            Ferme / Vétérinaires
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: "500",
              margin: 0,
              color: "#1a1a18",
            }}
          >
            Vétérinaires à proximité
          </h1>

          <p style={{ fontSize: "12px", color: "#9a9a90" }}>
            {filtered.length} résultats
          </p>
        </div>

        {/* ---------------- FILTER BOX ---------------- */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e8e7e2",
            borderRadius: "14px",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <VetFilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "10px",
              padding: "10px 12px",
              background: "#faf9f6",
              border: "1px solid #e8e7e2",
              borderRadius: "12px",
            }}
          >
            {/* icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b6b67"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>

            {/* label */}
            <span
              style={{
                fontSize: "11.5px",
                color: "#6b6b67",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              Rayon
            </span>

            {/* slider wrapper */}
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={rayonKm}
                onChange={(e) => setRayonKm(Number(e.target.value))}
                style={{
                  width: "100%",
                  appearance: "none",
                  height: "4px",
                  borderRadius: "10px",
                  background: `linear-gradient(
                    to right,
                    #1a1a18 0%,
                    #1a1a18 ${(rayonKm - 5) / (100 - 5) * 100}%,
                    #e8e7e2 ${(rayonKm - 5) / (100 - 5) * 100}%,
                    #e8e7e2 100%
                  )`,
                  outline: "none",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* value badge */}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#1a1a18",
                background: "#fff",
                border: "1px solid #e8e7e2",
                borderRadius: "8px",
                padding: "3px 10px",
                minWidth: "55px",
                textAlign: "center",
              }}
            >
              {rayonKm} km
            </span>
          </div>
        </div>

        {/* ---------------- MAP + LIST ---------------- */}
        <div style={{ display: "flex", gap: "1rem", height: "70vh" }}>
          {/* MAP */}
          {showMap && (
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "14px",
                border: "0.5px solid #e8e7e2",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {userPos && (
                <MapContainer
                  center={[userPos.lat, userPos.lng]}
                  zoom={13}
                  style={{ width: "100%", height: "100%" }}
                >
                  <FitBounds
                    vets={filtered.filter((v) => v.latitude && v.longitude)}
                  />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {flyTarget && (
                    <MapController
                      center={flyTarget.center}
                      zoom={flyTarget.zoom}
                    />
                  )}

                  {filtered.map(
                    (vet) =>
                      vet.latitude &&
                      vet.longitude && (
                        <VetMapMarker
                          key={vet.id}
                          vet={vet}
                          isActive={activeVetId === vet.id}
                          onClick={() => handleVetClick(vet)}
                        />
                      )
                  )}
                </MapContainer>
              )}
            </div>
          )}

          {/* LIST */}
          {showList && (
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "14px",
                border: "0.5px solid #e8e7e2",
                overflowY: "auto",
                padding: "1rem",
              }}
            >
              {loading ? (
                <Loader />
              ) : (
                filtered.map((vet) => (
                  <VetCard
                    key={vet.id}
                    vet={vet}
                    distance={vet._distance}
                    isActive={activeVetId === vet.id}
                    onClick={() => handleVetClick(vet)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  );
};

export default VetListMapPage;
