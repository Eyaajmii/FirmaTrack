import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // ✅ Récupération des infos utilisateur
  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const userRole = localStorage.getItem('user_role') || 'VISITEUR';

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // --- MENU FERMIER ---
  const fermierItems = [
    {
      section: null,
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: (
          <svg width="15" height="15" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>
        )},
      ]
    },
    {
      section: 'Gestion',
      items: [
        { to: '/cheptel', label: 'Cheptel', icon: (
          <svg width="15" height="15"><circle cx="8" cy="5" r="3"/></svg>
        )},
        { to: '/lots', label: 'Lots', icon: (
          <svg width="15" height="15"><rect x="1" y="4" width="14" height="10"/></svg>
        )},
      ]
    },
    {
      section: 'Production',
      items: [
        { to: '/production-lait', label: 'Production Lait' },
        { to: '/production-oeufs', label: 'Production Oeufs' },
      ]
    },
  ];

  // --- MENU VETERINAIRE ---
  const vetoItems = [
    {
      section: null,
      items: [
        { to: '/veterinaire-dashboard', label: 'Mon Forum' },
      ]
    },
    {
      section: 'Services',
      items: [
        { to: '/consultations', label: 'Mes Visites' },
        { to: '/carte', label: 'Carte Interventions' },
      ]
    },
  ];

  // ✅ Choix du menu selon rôle
  const navItems =
    (userRole === 'FERMIER' || userRole === 'ELEVEUR')
      ? fermierItems
      : vetoItems;

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#fff',
      borderRight: '0.5px solid #e8e7e2',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
    }}>

      {/* Header */}
      <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#1a1a18',
          textTransform: 'uppercase'
        }}>
          FirmaTrack
        </div>

        <div style={{
          fontSize: '12px',
          color: '#16a34a',
          marginTop: '4px'
        }}>
          {userName} • {userRole}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {navItems.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '1.5rem' }}>

            {group.section && (
              <div style={{
                fontSize: '10px',
                color: '#c0bfb9',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                {group.section}
              </div>
            )}

            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: isActive ? '#fff' : '#6b6b67',
                  background: isActive ? '#1a1a18' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #eee' }}>
        <button onClick={handleLogout} style={{
          width: '100%',
          padding: '8px',
          color: '#ef4444',
          border: 'none',
          cursor: 'pointer'
        }}>
          Déconnexion
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;