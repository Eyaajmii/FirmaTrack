import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      section: null,
      items: [
        {
          to: "/dashboard",
          label: "Dashboard",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect
                x="1"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="9"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="1"
                y="9"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="9"
                y="9"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Gestion",
      items: [
        {
          to: "/cheptel",
          label: "Cheptel",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="5"
                r="3"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          to: "/lots",
          label: "Lots",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect
                x="1"
                y="4"
                width="14"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M5 4V3a3 3 0 016 0v1"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Production",
      items: [
        {
          to: "/production-lait",
          label: "Production Lait",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 2h8l1 4H3L4 2z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path
                d="M3 6v7a1 1 0 001 1h8a1 1 0 001-1V6"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M6 10h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          to: "/production-oeufs",
          label: "Production Oeufs",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M4 8h8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Carnet de santé",
      items: [
        {
          to: "/carnetsante",
          label: "Carnet de santé",
          icon: (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect
                x="3"
                y="2"
                width="10"
                height="12"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M6 2.5h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />

              <path
                d="M8 6v4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />

              <path
                d="M6 8h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      section: "Maladies & Traitements",
      items: [],
    },
    {
      section: "Vaccinations",
      items: [],
    },
  ];

  return (
    <aside
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#fff",
        borderRight: "0.5px solid #e8e7e2",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 1.25rem", marginBottom: "2rem" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: "500",
            color: "#1a1a18",
            letterSpacing: "-0.3px",
          }}
        >
          FirmaTrack
        </div>
        <div style={{ fontSize: "11px", color: "#b0afa9", marginTop: "2px" }}>
          Ferme El Baraka
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.75rem" }}>
        {navItems.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "1.5rem" }}>
            {group.section && (
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "#c0bfb9",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  padding: "0 0.5rem",
                  marginBottom: "4px",
                }}
              >
                {group.section}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "400",
                  color: isActive ? "#fff" : "#6b6b67",
                  background: isActive ? "#1a1a18" : "transparent",
                  textDecoration: "none",
                  marginBottom: "2px",
                  transition: "all 0.12s",
                })}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "0.5px solid #f0efe9",
          fontSize: "11px",
          color: "#b0afa9",
        }}
      >
        Connecté
      </div>
    </aside>
  );
};

export default Sidebar;
