import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lotService } from "../Lot/Services/LotService";
import * as service from "../services/CheptelService";
import { useToast, ToastContainer } from "../../../components/common/Toast";

const RACES_BY_TYPE = {
  VACHE: [
    "Holstein",
    "Montbéliarde",
    "Normande",
    "Brune des Alpes",
    "Prim'Holstein",
    "Charolaise",
    "Limousine",
    "Blonde d'Aquitaine",
    "Tarentaise",
    "Locale Tunisienne",
  ],
  POULE: [
    "Leghorn",
    "Rhode Island Red",
    "Sussex",
    "Plymouth Rock",
    "Wyandotte",
    "Marans",
    "Brahma",
    "Locale Tunisienne",
  ],
  CHEVRE: [
    "Alpine",
    "Saanen",
    "Nubian",
    "Toggenburg",
    "Angora",
    "Boer",
    "Locale Tunisienne",
  ],
  BREBIS: [
    "Lacaune",
    "Mérinos",
    "Suffolk",
    "Barbarine",
    "Queue Fine de l'Ouest",
    "D'Man",
    "Sicilo-Sarde",
    "Locale Tunisienne",
  ],
};

function SvgBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 3L5 8l5 5"
        stroke="#1a1a18"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgEdit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke="#3B6D11"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="#3B6D11"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="#3B6D11"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgVache({ active }) {
  const c = active ? "#3B6D11" : "#6b6b67";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="20" rx="9" ry="6" stroke={c} strokeWidth="1.6" />
      <ellipse cx="16" cy="13" rx="5" ry="4" stroke={c} strokeWidth="1.6" />
      <line
        x1="11"
        y1="11"
        x2="8"
        y2="7"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="11"
        x2="24"
        y2="7"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="13" r="1" fill={c} />
      <circle cx="17.5" cy="13" r="1" fill={c} />
      <line
        x1="12"
        y1="26"
        x2="12"
        y2="30"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="26"
        x2="16"
        y2="30"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="26"
        x2="20"
        y2="30"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgPoule({ active }) {
  const c = active ? "#3B6D11" : "#6b6b67";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="21" rx="8" ry="6" stroke={c} strokeWidth="1.6" />
      <circle cx="16" cy="12" r="4" stroke={c} strokeWidth="1.6" />
      <path
        d="M14 10 Q12 6 15 5 Q14 8 16 8"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14.5" cy="12" r="0.9" fill={c} />
      <line
        x1="13"
        y1="27"
        x2="12"
        y2="30"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="27"
        x2="20"
        y2="30"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgChevre({ active }) {
  const c = active ? "#3B6D11" : "#6b6b67";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="20" rx="8" ry="5.5" stroke={c} strokeWidth="1.6" />
      <ellipse cx="16" cy="13" rx="4.5" ry="4" stroke={c} strokeWidth="1.6" />
      <path
        d="M12 11 Q10 7 12 6 Q11 9 14 9"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 11 Q22 7 20 6 Q21 9 18 9"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14.5" cy="13.5" r="0.9" fill={c} />
      <circle cx="17.5" cy="13.5" r="0.9" fill={c} />
      <line
        x1="11"
        y1="25"
        x2="11"
        y2="29"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="25"
        x2="21"
        y2="29"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgBrebis({ active }) {
  const c = active ? "#3B6D11" : "#6b6b67";
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path
        d="M8 19 Q7 14 10 13 Q10 10 13 10 Q14 7 16 7 Q18 7 19 10 Q22 10 22 13 Q25 14 24 19 Q22 25 16 25 Q10 25 8 19Z"
        stroke={c}
        strokeWidth="1.6"
        fill="none"
      />
      <ellipse cx="16" cy="11" rx="3" ry="2.5" stroke={c} strokeWidth="1.4" />
      <circle cx="15" cy="11" r="0.8" fill={c} />
      <circle cx="17" cy="11" r="0.8" fill={c} />
      <line
        x1="12"
        y1="25"
        x2="12"
        y2="29"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="25"
        x2="20"
        y2="29"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TYPES = [
  {
    value: "VACHE",
    label: "Vache",
    sublabel: "Filière Lait",
    SvgIcon: SvgVache,
  },
  {
    value: "POULE",
    label: "Poule",
    sublabel: "Filière Oeufs",
    SvgIcon: SvgPoule,
  },
  {
    value: "CHEVRE",
    label: "Chèvre",
    sublabel: "Lait de chèvre",
    SvgIcon: SvgChevre,
  },
  {
    value: "BREBIS",
    label: "Brebis",
    sublabel: "Viande / Laine",
    SvgIcon: SvgBrebis,
  },
];

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        color: "#a0a098",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        borderBottom: "1px solid #f0efe9",
        paddingBottom: "6px",
        marginTop: "4px",
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label
        style={{
          fontSize: "10px",
          fontWeight: "600",
          color: "#6b6b67",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const iStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e8e7e2",
  borderRadius: "9px",
  fontSize: "13px",
  background: "#faf9f7",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  color: "#1a1a18",
};

function CheptelEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, removeToast, toast } = useToast();

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    chepnumber: "",
    nom: "",
    type: "",
    race: "",
    gender: "",
    statut: "ALIVE",
    lotId: "",
  });
  useEffect(() => {
    const load = async () => {
      try {
        const resLots = await lotService.getAll();
        setLots(Array.isArray(resLots.data) ? resLots.data : []);

        const animal = location.state || null;
        if (animal) {
          setForm({
            chepnumber: animal.chepnumber || "",
            nom: animal.nom || "",
            type: animal.type || "",
            race: animal.race || "",
            gender: animal.gender || "",
            statut: animal.statut || "ALIVE",
            lotId: animal.lot?.id || "",
          });
        } else {
          const res = await service.getById(id);
          const a = res.data;
          setForm({
            chepnumber: a.chepnumber || "",
            nom: a.nom || "",
            type: a.type || "",
            race: a.race || "",
            gender: a.gender || "",
            statut: a.statut || "ALIVE",
            lotId: a.lot?.id || "",
          });
        }
      } catch (err) {
        toast.error("Erreur lors du chargement de l'animal.");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTypeClick = (value) => {
    setForm((prev) => ({ ...prev, type: value, race: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim()) {
      toast.warning("Le nom est obligatoire.");
      return;
    }
    if (!form.type) {
      toast.warning("Sélectionnez un type d'animal.");
      return;
    }
    if (!form.race) {
      toast.warning("Sélectionnez une race.");
      return;
    }

    setLoading(true);
    const payload = {
      chepnumber: form.chepnumber,
      nom: form.nom,
      type: form.type,
      race: form.race,
      gender: form.gender || null,
      statut: form.statut,
      lot: form.lotId ? { id: Number(form.lotId) } : null,
    };

    try {
      await service.updateAnimal(id, payload);
      toast.success(`"${form.nom}" mis à jour avec succès.`);
      setTimeout(() => navigate("/cheptel"), 1200);
    } catch (err) {
      toast.error("Échec de la mise à jour. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const availableRaces = form.type ? RACES_BY_TYPE[form.type] || [] : [];

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div
        style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                fontSize: "11px",
                color: "#b0afa9",
                marginBottom: "6px",
              }}
            >
              <span>Ferme El Baraka</span>
              <span>/</span>
              <span
                onClick={() => navigate("/cheptel")}
                style={{ color: "#b0afa9", cursor: "pointer" }}
              >
                Cheptel
              </span>
              <span>/</span>
              <span style={{ color: "#1a1a18" }}>Modifier</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: "500",
                  color: "#1a1a18",
                  letterSpacing: "-0.4px",
                }}
              >
                Cheptel
              </h1>
              <button
                onClick={() => navigate("/cheptel")}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#EAF3DE",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SvgBack />
              </button>
            </div>
          </div>
          {/* Card */}
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div
              style={{
                background: "#fff",
                padding: "1.75rem",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "#EAF3DE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <SvgEdit />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#1a1a18",
                    }}
                  >
                    Modifier l'animal
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#9a9a96",
                      marginTop: "2px",
                    }}
                  >
                    {form.nom
                      ? `Modification de "${form.nom}"`
                      : "Chargement..."}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <SectionLabel>Identification</SectionLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <Field label="Numéro ID">
                    <input
                      name="chepnumber"
                      value={form.chepnumber}
                      onChange={handleChange}
                      style={iStyle}
                    />
                  </Field>
                  <Field label="Nom *">
                    <input
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Ex: Bella"
                      style={iStyle}
                    />
                  </Field>
                </div>

                <SectionLabel>Espèce & Race</SectionLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  {TYPES.map(({ value, label, sublabel, SvgIcon }) => {
                    const active = form.type === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleTypeClick(value)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "12px 6px 10px",
                          borderRadius: "10px",
                          gap: "3px",
                          border: active
                            ? "1.5px solid #3B6D11"
                            : "1.5px solid #e8e7e2",
                          background: active ? "#EAF3DE" : "#faf9f7",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          position: "relative",
                          boxShadow: active
                            ? "0 2px 10px rgba(59,109,17,0.12)"
                            : "none",
                        }}
                      >
                        {active && (
                          <span
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              background: "#c1f0a0",
                              borderRadius: "50%",
                              width: "17px",
                              height: "17px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SvgCheck />
                          </span>
                        )}
                        <SvgIcon active={active} />
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            marginTop: "3px",
                            color: active ? "#3B6D11" : "#1a1a18",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#9a9a96",
                            textAlign: "center",
                          }}
                        >
                          {sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Field label="Race *">
                  <select
                    name="race"
                    value={form.race}
                    onChange={handleChange}
                    disabled={!form.type}
                    style={{
                      ...iStyle,
                      ...(!form.type
                        ? {
                            background: "#f5f5f3",
                            color: "#b0afa9",
                            cursor: "not-allowed",
                          }
                        : {}),
                    }}
                  >
                    <option value="">
                      {form.type
                        ? "-- Sélectionner une race --"
                        : "Choisissez d'abord un type"}
                    </option>
                    {availableRaces.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <SectionLabel>Caractéristiques</SectionLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <Field label="Genre">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      style={iStyle}
                    >
                      <option value="">-- Choisir --</option>
                      <option value="F">Femelle</option>
                      <option value="M">Mâle</option>
                    </select>
                  </Field>
                  <Field label="Statut">
                    <select
                      name="statut"
                      value={form.statut}
                      onChange={handleChange}
                      style={iStyle}
                    >
                      <option value="ALIVE">Vivant</option>
                      <option value="SOLD">Vendu</option>
                      <option value="DEAD">Décédé</option>
                    </select>
                  </Field>
                </div>

                <SectionLabel>Affectation</SectionLabel>
                <Field label="Lot">
                  <select
                    name="lotId"
                    value={form.lotId}
                    onChange={handleChange}
                    style={iStyle}
                  >
                    <option value="">-- Aucun lot --</option>
                    {lots.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nom}
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "11px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginTop: "0.5rem",
                    letterSpacing: "0.2px",
                    background: loading ? "#f1f0ec" : "#1a1a18",
                    color: loading ? "#9a9a96" : "#fff",
                    transition: "background 0.2s",
                  }}
                >
                  {loading ? "Enregistrement..." : "Mettre à jour"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheptelEditPage;
