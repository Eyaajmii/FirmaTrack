import { useEffect, useState } from "react";
import { lotService } from "../Lot/Services/LotService";
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

function SvgVache({ active }) {
  const c = active ? "#3B6D11" : "#6b6b67";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
      <path
        d="M13 15 L11 18"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
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
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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

function SvgError() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.4" />
      <path
        d="M8 4.5v4M8 10.5v1"
        stroke="#dc2626"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgAnimal() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="17"
        rx="7"
        ry="4.5"
        stroke="#3B6D11"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="4" stroke="#3B6D11" strokeWidth="1.5" />
      <line
        x1="9"
        y1="8"
        x2="7"
        y2="5"
        stroke="#3B6D11"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="8"
        x2="17"
        y2="5"
        stroke="#3B6D11"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="10.5" cy="10" r="0.8" fill="#3B6D11" />
      <circle cx="13.5" cy="10" r="0.8" fill="#3B6D11" />
    </svg>
  );
}

function SvgPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="#fff"
        strokeWidth="2"
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
const TODAY = new Date().toISOString().split("T")[0];

function validateForm(form) {
  const errors = {};
  if (!form.chepnumber.trim()) {
    errors.chepnumber = "Le numéro ID est obligatoire.";
  } else if (!/^[A-Za-z0-9\-_]{2,20}$/.test(form.chepnumber.trim())) {
    errors.chepnumber = "2 à 20 caractères, tirets et underscores autorisés.";
  }
  if (!form.nom.trim()) {
    errors.nom = "Le nom est obligatoire.";
  } else if (form.nom.trim().length < 2) {
    errors.nom = "Minimum 2 caractères requis.";
  } else if (form.nom.trim().length > 50) {
    errors.nom = "Maximum 50 caractères autorisés.";
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-'.]+$/.test(form.nom.trim())) {
    errors.nom = "Caractères spéciaux non autorisés.";
  }
  if (!form.type) {
    errors.type = "Sélectionnez un type d'animal.";
  }
  if (!form.race) {
    errors.race = "Sélectionnez une race.";
  }
  if (form.poids !== "") {
    const p = parseFloat(form.poids);
    if (isNaN(p) || p <= 0) {
      errors.poids = "Le poids doit être un nombre positif.";
    } else if (p > 2000) {
      errors.poids = "Poids trop élevé (maximum 2000 kg).";
    } else if (!/^\d+(\.\d{0,2})?$/.test(form.poids)) {
      errors.poids = "Maximum 2 décimales autorisées.";
    }
  }
  if (form.dateNaissance) {
    if (form.dateNaissance > TODAY) {
      errors.dateNaissance = "La date ne peut pas être dans le futur.";
    } else if (new Date(form.dateNaissance).getFullYear() < 1990) {
      errors.dateNaissance = "Année invalide (minimum 1990).";
    }
  }
  if (form.dateEntre) {
    if (form.dateEntre > TODAY) {
      errors.dateEntre = "La date ne peut pas être dans le futur.";
    } else if (form.dateNaissance && form.dateEntre < form.dateNaissance) {
      errors.dateEntre = "Doit être après la date de naissance.";
    }
  }

  return errors;
}
function CheptelForm({ onAdd }) {
  const [lots, setLots] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { toasts, removeToast, toast } = useToast();

  const [form, setForm] = useState({
    chepnumber: "",
    nom: "",
    type: "",
    race: "",
    gender: "",
    statut: "ALIVE",
    lotId: "",
    dateNaissance: "",
    poids: "",
    dateEntre: "",
  });
  useEffect(() => {
    const loadLots = async () => {
      try {
        const res = await lotService.getAll();
        setLots(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Erreur chargement lots", err);
      }
    };
    loadLots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Object.keys(touched).length > 0 || submitted) {
      setErrors(validateForm(form));
    }
  }, [form, touched, submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setForm((prev) => ({ ...prev, type: value, race: "" }));
      setTouched((prev) => ({ ...prev, type: true, race: true }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleTypeClick = (value) => {
    setForm((prev) => ({ ...prev, type: value, race: "" }));
    setTouched((prev) => ({ ...prev, type: true, race: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.warning(
        `${
          Object.keys(errs).length
        } champ(s) invalide(s) — corrigez avant de continuer.`
      );
      return;
    }

    const payload = {
      chepnumber: form.chepnumber.trim(),
      nom: form.nom.trim(),
      type: form.type,
      race: form.race,
      gender: form.gender || null,
      statut: form.statut,
      dateNaissance: form.dateNaissance || null,
      poids: form.poids ? parseFloat(form.poids) : null,
      dateEntre: form.dateEntre || null,
      lot: form.lotId ? { id: Number(form.lotId) } : null,
    };

    onAdd(payload);
    setForm({
      chepnumber: "",
      nom: "",
      type: "",
      race: "",
      gender: "",
      statut: "ALIVE",
      lotId: "",
      dateNaissance: "",
      poids: "",
      dateEntre: "",
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  const availableRaces = form.type ? RACES_BY_TYPE[form.type] || [] : [];
  const showErr = (f) => (touched[f] || submitted) && errors[f];
  const showOk = (f) => (touched[f] || submitted) && !errors[f] && form[f];

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <SvgAnimal />
          </div>
          <div>
            <h2 style={styles.title}>Ajouter un animal</h2>
            <p style={styles.subtitle}>
              Remplissez les informations du nouvel animal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <SectionLabel>Identification</SectionLabel>
          <div style={styles.grid2}>
            <Field
              label="Numéro ID *"
              error={showErr("chepnumber")}
              errorMsg={errors.chepnumber}
              valid={showOk("chepnumber")}
            >
              <input
                name="chepnumber"
                value={form.chepnumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex: VH-2024-001"
                maxLength={20}
                style={iStyle(showErr("chepnumber"), showOk("chepnumber"))}
              />
            </Field>
            <Field
              label="Nom *"
              error={showErr("nom")}
              errorMsg={errors.nom}
              valid={showOk("nom")}
            >
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex: Bella"
                maxLength={50}
                style={iStyle(showErr("nom"), showOk("nom"))}
              />
            </Field>
          </div>
          <SectionLabel>Espèce & Race</SectionLabel>
          {showErr("type") && <ErrorMsg msg={errors.type} />}

          <div style={styles.typeGrid}>
            {TYPES.map(({ value, label, sublabel, SvgIcon }) => {
              const active = form.type === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTypeClick(value)}
                  style={{
                    ...styles.typeBtn,
                    ...(active ? styles.typeBtnActive : {}),
                    ...(showErr("type") && !active
                      ? { borderColor: "#fca5a5" }
                      : {}),
                  }}
                >
                  {active && (
                    <span style={styles.checkBadge}>
                      <SvgCheck />
                    </span>
                  )}
                  <SvgIcon active={active} />
                  <span
                    style={{
                      ...styles.typeBtnLabel,
                      color: active ? "#3B6D11" : "#1a1a18",
                    }}
                  >
                    {label}
                  </span>
                  <span style={styles.typeBtnSub}>{sublabel}</span>
                </button>
              );
            })}
          </div>

          <Field
            label="Race *"
            error={showErr("race")}
            errorMsg={errors.race}
            valid={showOk("race")}
          >
            <select
              name="race"
              value={form.race}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!form.type}
              style={{
                ...iStyle(showErr("race"), showOk("race")),
                ...(!form.type ? styles.disabled : {}),
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
            {!form.type && (
              <p style={styles.hint}>
                Sélectionnez un type pour voir les races disponibles
              </p>
            )}
          </Field>
          <SectionLabel>Caractéristiques</SectionLabel>
          <div style={styles.grid2}>
            <Field label="Genre">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={iStyle(false, false)}
              >
                <option value="">-- Choisir --</option>
                <option value="F">Femelle</option>
                <option value="M">Mâle</option>
              </select>
            </Field>
            <Field
              label="Poids (kg)"
              error={showErr("poids")}
              errorMsg={errors.poids}
              valid={showOk("poids")}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  name="poids"
                  value={form.poids}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ex: 450.5"
                  min="0.1"
                  max="2000"
                  step="0.1"
                  style={{
                    ...iStyle(showErr("poids"), showOk("poids")),
                    paddingRight: "44px",
                  }}
                />
                <span style={styles.unit}>kg</span>
              </div>
            </Field>
          </div>

          <SectionLabel>Dates</SectionLabel>
          <div style={styles.grid2}>
            <Field
              label="Date de naissance"
              error={showErr("dateNaissance")}
              errorMsg={errors.dateNaissance}
              valid={showOk("dateNaissance")}
            >
              <input
                type="date"
                name="dateNaissance"
                value={form.dateNaissance}
                onChange={handleChange}
                onBlur={handleBlur}
                max={TODAY}
                min="1990-01-01"
                style={iStyle(
                  showErr("dateNaissance"),
                  showOk("dateNaissance")
                )}
              />
            </Field>
            <Field
              label="Date d'entrée"
              error={showErr("dateEntre")}
              errorMsg={errors.dateEntre}
              valid={showOk("dateEntre")}
            >
              <input
                type="date"
                name="dateEntre"
                value={form.dateEntre}
                onChange={handleChange}
                onBlur={handleBlur}
                max={TODAY}
                min={form.dateNaissance || "1990-01-01"}
                style={iStyle(showErr("dateEntre"), showOk("dateEntre"))}
              />
            </Field>
          </div>
          <SectionLabel>Affectation</SectionLabel>
          <div style={styles.grid2}>
            <Field label="Statut">
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                style={iStyle(false, false)}
              >
                <option value="ALIVE">Vivant</option>
                <option value="SOLD">Vendu</option>
                <option value="DEAD">Décédé</option>
              </select>
            </Field>
            <Field label="Lot">
              <select
                name="lotId"
                value={form.lotId}
                onChange={handleChange}
                style={iStyle(false, false)}
              >
                <option value="">-- Aucun lot --</option>
                {lots.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nom}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {submitted && Object.keys(errors).length > 0 && (
            <div style={styles.errBanner}>
              <SvgError />
              <span
                style={{
                  marginLeft: "7px",
                  fontSize: "12px",
                  color: "#dc2626",
                  fontWeight: "600",
                }}
              >
                {Object.keys(errors).length} champ(s) invalide(s) — corrigez
                avant de continuer.
              </span>
            </div>
          )}

          <button type="submit" style={styles.submitBtn}>
            <SvgPlus />
            <span style={{ marginLeft: "8px" }}>Ajouter au cheptel</span>
          </button>
        </form>
      </div>
    </>
  );
}

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

function Field({ label, error, errorMsg, valid, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label
        style={{
          fontSize: "10px",
          fontWeight: "600",
          color: error ? "#dc2626" : "#6b6b67",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {label}
        {valid && <SvgCheck />}
      </label>
      {children}
      {error && errorMsg && <ErrorMsg msg={errorMsg} />}
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "2px",
      }}
    >
      <SvgError />
      <span style={{ fontSize: "11px", color: "#dc2626" }}>{msg}</span>
    </div>
  );
}
function iStyle(hasError, isOk) {
  return {
    width: "100%",
    padding: "9px 12px",
    border: `1.5px solid ${
      hasError ? "#fca5a5" : isOk ? "#86efac" : "#e8e7e2"
    }`,
    borderRadius: "9px",
    fontSize: "13px",
    background: hasError ? "#fff5f5" : isOk ? "#f0fdf4" : "#faf9f7",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
    color: "#1a1a18",
  };
}
const styles = {
  card: {
    background: "#fff",
    padding: "1.75rem",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.5rem",
  },
  headerIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#EAF3DE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a18" },
  subtitle: { margin: 0, fontSize: "11px", color: "#9a9a96", marginTop: "2px" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  typeBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 6px 10px",
    borderRadius: "10px",
    border: "1.5px solid #e8e7e2",
    background: "#faf9f7",
    cursor: "pointer",
    transition: "all 0.15s ease",
    gap: "3px",
    position: "relative",
  },
  typeBtnActive: {
    border: "1.5px solid #3B6D11",
    background: "#EAF3DE",
    boxShadow: "0 2px 10px rgba(59,109,17,0.12)",
  },
  typeBtnLabel: { fontSize: "11px", fontWeight: "700", marginTop: "3px" },
  typeBtnSub: { fontSize: "9px", color: "#9a9a96", textAlign: "center" },
  checkBadge: {
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
  },
  disabled: { background: "#f5f5f3", color: "#b0afa9", cursor: "not-allowed" },
  unit: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "11px",
    color: "#9a9a96",
    pointerEvents: "none",
    fontWeight: "600",
  },
  hint: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#b0afa9",
    fontStyle: "italic",
  },
  errBanner: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    background: "#fff5f5",
    border: "1px solid #fca5a5",
    borderRadius: "9px",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px",
    background: "#1a1a18",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "0.5rem",
    letterSpacing: "0.2px",
  },
};

export default CheptelForm;
