import { useEffect, useState } from "react";
import * as animalService from "../../cheptel/services/CheptelService";

function SvgCarnet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="2"
        width="13"
        height="18"
        rx="2"
        stroke="#2563eb"
        strokeWidth="1.5"
      />
      <line
        x1="7"
        y1="7"
        x2="14"
        y2="7"
        stroke="#2563eb"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="10.5"
        x2="14"
        y2="10.5"
        stroke="#2563eb"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="14"
        x2="11"
        y2="14"
        stroke="#2563eb"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M17 15 L20 18"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="14" r="3" stroke="#2563eb" strokeWidth="1.4" />
    </svg>
  );
}

function SvgAnimal() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="17"
        rx="7"
        ry="4.5"
        stroke="#6b6b67"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="4" stroke="#6b6b67" strokeWidth="1.5" />
      <line
        x1="9"
        y1="8"
        x2="7"
        y2="5"
        stroke="#6b6b67"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="8"
        x2="17"
        y2="5"
        stroke="#6b6b67"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="10.5" cy="10" r="0.8" fill="#6b6b67" />
      <circle cx="13.5" cy="10" r="0.8" fill="#6b6b67" />
    </svg>
  );
}

function SvgBlood() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 C12 3 6 10 6 14.5 A6 6 0 0 0 18 14.5 C18 10 12 3 12 3Z"
        stroke="#6b6b67"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgAllergy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#6b6b67" strokeWidth="1.5" />
      <path
        d="M9 9 C9 7 15 7 15 9 C15 12 12 12 12 14"
        stroke="#6b6b67"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="#6b6b67" />
    </svg>
  );
}

function SvgNote() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke="#6b6b67"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="8"
        x2="16"
        y2="8"
        stroke="#6b6b67"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke="#6b6b67"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="16"
        x2="12"
        y2="16"
        stroke="#6b6b67"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="#16a34a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgError() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
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

function SvgPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const GROUPES_SANGUINS = [
  "A",
  "B",
  "AB",
  "O",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  // Bovins
  "B (Bovin)",
  "C (Bovin)",
  "F (Bovin)",
  "J (Bovin)",
  "L (Bovin)",
  "Aa",
  "Qa",
  "Non déterminé",
];

function validateForm(form) {
  const errors = {};

  if (!form.animalId) {
    errors.animalId = "Veuillez sélectionner un animal.";
  }

  if (form.groupeSanguin.trim() && form.groupeSanguin.trim().length > 20) {
    errors.groupeSanguin =
      "Le groupe sanguin ne doit pas dépasser 20 caractères.";
  }

  if (form.allergies.trim().length > 200) {
    errors.allergies = "Maximum 200 caractères autorisés.";
  }

  if (form.observationsGenerales.trim().length > 500) {
    errors.observationsGenerales = "Maximum 500 caractères autorisés.";
  }

  return errors;
}

function CarnetsanteForm({ onAdd }) {
  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    groupeSanguin: "",
    allergies: "",
    observationsGenerales: "",
    animalId: "",
  });

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const res = await animalService.getAllAnimals();
        setAnimals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement animaux", err);
      } finally {
        setLoadingAnimals(false);
      }
    };
    loadAnimals();
  }, []);

  useEffect(() => {
    if (Object.keys(touched).length > 0 || submitted) {
      setErrors(validateForm(form));
    }
  }, [form, touched, submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      groupeSanguin: form.groupeSanguin.trim() || null,
      allergies: form.allergies.trim() || null,
      observationsGenerales: form.observationsGenerales.trim() || null,
      animal: { id: Number(form.animalId) },
    };

    setLoading(true);
    const result = await onAdd(payload);
    setLoading(false);

    if (result?.success === false) {
      setServerError(result.message || "Une erreur est survenue.");
      return;
    }

    setForm({
      groupeSanguin: "",
      allergies: "",
      observationsGenerales: "",
      animalId: "",
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setServerError("");
  };

  const showErr = (f) => (touched[f] || submitted) && errors[f];
  const showOk = (f) => (touched[f] || submitted) && !errors[f] && form[f];

  const selectedAnimal = animals.find(
    (a) => String(a.id) === String(form.animalId)
  );

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <SvgCarnet />
        </div>
        <div>
          <h2 style={styles.title}>Nouveau carnet de santé</h2>
          <p style={styles.subtitle}>Créez le dossier médical d'un animal</p>
        </div>
      </div>

      {serverError && (
        <div style={styles.serverError}>
          <SvgError />
          <span
            style={{
              marginLeft: "7px",
              fontSize: "12px",
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            {serverError}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={styles.form}>
        <SectionLabel>Animal *</SectionLabel>
        <Field
          icon={<SvgAnimal />}
          label="Sélectionner un animal"
          error={showErr("animalId")}
          errorMsg={errors.animalId}
          valid={showOk("animalId")}
        >
          <select
            name="animalId"
            value={form.animalId}
            onChange={handleChange}
            onBlur={handleBlur}
            style={iStyle(showErr("animalId"), showOk("animalId"))}
            disabled={loadingAnimals}
          >
            <option value="">
              {loadingAnimals
                ? "Chargement des animaux..."
                : "-- Choisir un animal --"}
            </option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.chepnumber} • {a.nom || "Sans nom"} — {a.type}
              </option>
            ))}
          </select>
        </Field>

        {selectedAnimal && (
          <div style={styles.animalPreview}>
            <div style={styles.animalPreviewDot} />
            <div>
              <span style={styles.animalPreviewNum}>
                {selectedAnimal.chepnumber}
              </span>
              <span style={styles.animalPreviewName}>
                {selectedAnimal.nom || "Sans nom"}
              </span>
              <span style={styles.animalPreviewType}>
                {selectedAnimal.type}
              </span>
              {selectedAnimal.race && (
                <span style={styles.animalPreviewRace}>
                  • {selectedAnimal.race}
                </span>
              )}
            </div>
          </div>
        )}

        <SectionLabel>Informations médicales</SectionLabel>
        <Field
          icon={<SvgBlood />}
          label="Groupe sanguin"
          error={showErr("groupeSanguin")}
          errorMsg={errors.groupeSanguin}
          valid={showOk("groupeSanguin")}
        >
          <select
            name="groupeSanguin"
            value={form.groupeSanguin}
            onChange={handleChange}
            onBlur={handleBlur}
            style={iStyle(showErr("groupeSanguin"), showOk("groupeSanguin"))}
          >
            <option value="">-- Non déterminé --</option>
            {GROUPES_SANGUINS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field
          icon={<SvgAllergy />}
          label={`Allergies connues ${
            form.allergies.length > 0 ? `(${form.allergies.length}/200)` : ""
          }`}
          error={showErr("allergies")}
          errorMsg={errors.allergies}
          valid={showOk("allergies")}
        >
          <input
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Pénicilline, Pollen, Ivermectine..."
            maxLength={200}
            style={iStyle(showErr("allergies"), showOk("allergies"))}
          />
        </Field>
        <Field
          icon={<SvgNote />}
          label={`Observations générales ${
            form.observationsGenerales.length > 0
              ? `(${form.observationsGenerales.length}/500)`
              : ""
          }`}
          error={showErr("observationsGenerales")}
          errorMsg={errors.observationsGenerales}
          valid={showOk("observationsGenerales")}
        >
          <textarea
            name="observationsGenerales"
            value={form.observationsGenerales}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Notes vétérinaires, historique médical, observations..."
            maxLength={500}
            style={{
              ...iStyle(
                showErr("observationsGenerales"),
                showOk("observationsGenerales")
              ),
              minHeight: "90px",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: "1.5",
            }}
          />
        </Field>
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
              {Object.keys(errors).length} champ(s) invalide(s) — corrigez avant
              de continuer.
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            background: loading ? "#d1d5db" : "#1a1a18",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={{ fontSize: "13px" }}>Enregistrement...</span>
          ) : (
            <>
              <SvgPlus />
              <span style={{ marginLeft: "7px" }}>
                Créer le carnet de santé
              </span>
            </>
          )}
        </button>
      </form>
    </div>
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

function Field({ icon, label, error, errorMsg, valid, children }) {
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
        {icon}
        {label}
        {valid && <SvgCheck />}
      </label>
      {children}
      {error && errorMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "2px",
          }}
        >
          <SvgError />
          <span style={{ fontSize: "11px", color: "#dc2626" }}>{errorMsg}</span>
        </div>
      )}
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
    border: "0.5px solid #e8e7e2",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
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
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: { margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a18" },
  subtitle: { margin: 0, fontSize: "11px", color: "#9a9a96", marginTop: "2px" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  serverError: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    background: "#fff5f5",
    border: "1px solid #fca5a5",
    borderRadius: "9px",
    marginBottom: "0.75rem",
  },
  animalPreview: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "9px",
    marginTop: "-4px",
  },
  animalPreviewDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#16a34a",
    flexShrink: 0,
  },
  animalPreviewNum: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#166534",
    marginRight: "6px",
  },
  animalPreviewName: {
    fontSize: "12px",
    color: "#15803d",
    marginRight: "6px",
  },
  animalPreviewType: {
    fontSize: "11px",
    color: "#4ade80",
    background: "#dcfce7",
    padding: "1px 7px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  animalPreviewRace: {
    fontSize: "11px",
    color: "#6b7280",
    marginLeft: "5px",
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
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "0.25rem",
    letterSpacing: "0.2px",
  },
};

export default CarnetsanteForm;
