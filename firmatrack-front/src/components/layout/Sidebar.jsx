import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const ChevronIcon = ({ open }) => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)', flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const COW_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Crect width='140' height='140' fill='%23faf9f6'/%3E%3Cellipse cx='25' cy='20' rx='16' ry='11' fill='%231a1a18' opacity='0.14' transform='rotate(-25 25 20)'/%3E%3Cellipse cx='95' cy='32' rx='20' ry='13' fill='%231a1a18' opacity='0.13' transform='rotate(18 95 32)'/%3E%3Cellipse cx='55' cy='68' rx='24' ry='15' fill='%231a1a18' opacity='0.12' transform='rotate(-12 55 68)'/%3E%3Cellipse cx='12' cy='88' rx='11' ry='18' fill='%231a1a18' opacity='0.11' transform='rotate(28 12 88)'/%3E%3Cellipse cx='118' cy='90' rx='15' ry='10' fill='%231a1a18' opacity='0.06' transform='rotate(-35 118 90)'/%3E%3Cellipse cx='72' cy='118' rx='18' ry='11' fill='%231a1a18' opacity='0.065' transform='rotate(12 72 118)'/%3E%3Cellipse cx='32' cy='122' rx='9' ry='13' fill='%231a1a18' opacity='0.055' transform='rotate(-18 32 122)'/%3E%3Cellipse cx='125' cy='55' rx='10' ry='7' fill='%231a1a18' opacity='0.06' transform='rotate(42 125 55)'/%3E%3C/svg%3E")`;

const allNavItems = [
  {
    section: null,
    roles: ['FERMIER', 'ADMIN'],
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
    ]
  },
  {
    section: 'Gestion',
    roles: ['FERMIER', 'ADMIN'],
    items: [
      { to: '/cheptel', label: 'Cheptel', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
      {
        to: '/lots', label: 'Lots',
        icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
        children: [
          { to: '/lots', label: 'Tous les lots' },
          { to: '/lots/nouveau', label: 'Nouveau lot' },
          { to: '/lots/rapport', label: 'Rapport' },
          { to: '/lots/issues', label: 'Issues' },
        ]
      },
      {
        to: '/stock', label: 'Stocks',
        icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4l6-2 6 2v8l-6 2-6-2V4z" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4l6 2 6-2M8 6v8" stroke="currentColor" strokeWidth="1.3"/></svg>,
        children: [
          { to: '/stock', label: 'Inventaire' },
          { to: '/stock/nouveau', label: 'Ajouter un intrant' },
        ]
      },
    ]
  },
  {
    section: 'Production',
    roles: ['FERMIER', 'ADMIN'],
    items: [
      { to: '/production-lait', label: 'Production Lait', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 2h8l1 4H3L4 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M3 6v7a1 1 0 001 1h8a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
      { to: '/production-oeufs', label: 'Production Oeufs', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8.5" rx="4.5" ry="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 7c.5-2 5-2 5 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
    ]
  },
  {
    section: 'Santé',
    roles: ['FERMIER', 'ADMIN', 'VETERINAIRE'],
    items: [
      { to: '/carnetsante', label: 'Carnet de Santé', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
      { to: '/rendezvous', label: 'Rendez-vous vétérinaire', 
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9H21" stroke="currentColor" strokeWidth="1.5"/><path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      },
    ]
  },
  {
    section: 'Économie',
    roles: ['FERMIER', 'ADMIN'],
    items: [
      { 
        to: '/finance', 
        label: 'Dashboard de rentabilité', 
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
            <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
          </svg>
        ) 
      },
      { 
        to: '/finance/enregistrer', 
        label: 'Saisie de charges', 
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" />
          </svg>
        ) 
      }
    ]
  },
  {
    section:'Vétérianire',
    roles: ['FERMIER', 'ADMIN'],
    items:[
      {
        to: '/veterinairesproches', label: 'Trouver un vétérinaire'
      }
    ]
  },
  {
    section: 'Communauté',
    roles: ['FERMIER', 'ADMIN', 'VETERINAIRE'], // <--- VISIBLE PAR TOUT LE MONDE !
    items: [
      { 
        to: '/forum', 
        label: 'Forum', 
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="1" y="3" width="14" height="10" rx="2" strokeLinecap="round" />
            <path d="M1 5l7 5 7-5" strokeLinecap="round" />
          </svg>
        ) 
      },
    ]
  },
  {
    section: 'Paramètres',
    roles: ['FERMIER', 'ADMIN', 'VETERINAIRE'],
    items: [
      { 
        to: '/profile', 
        label: 'Mon Profil', 
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) 
      },
      { to: '/notifications', label: 'Notifications', badge: '02', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2a5 5 0 00-5 5v3l-1 1.5h12L13 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/></svg> },
      { to: '/messages', label: 'Messages', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    ]
  }
];

const SubMenu = ({ items, visible, collapsed }) => (
  <div style={{
    overflow: 'hidden',
    maxHeight: visible && !collapsed ? `${items.length * 33}px` : '0px',
    opacity: visible && !collapsed ? 1 : 0,
    transition: 'max-height 0.28s cubic-bezier(.4,0,.2,1), opacity 0.2s',
  }}>
    {items.map(child => (
      <NavLink key={child.to} to={child.to}
        className="sb-sub"
        end // Évite l'activation croisée des sous-onglets
        style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '6px 8px 6px 33px', fontSize: '12px',
          color: isActive ? '#1a1a18' : '#7a7a74',
          fontWeight: isActive ? '500' : '400',
          textDecoration: 'none', borderRadius: '7px', marginBottom: '1px',
          background: isActive ? 'rgba(255,255,255,0.8)' : 'transparent',
          transition: 'all 0.12s',
        })}>
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor', flexShrink: 0, opacity: 0.5 }}/>
        {child.label}
      </NavLink>
    ))}
  </div>
);

const W_OPEN   = 200;
const W_CLOSED = 56;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const userRole = (localStorage.getItem('user_role') || 'VISITEUR').toUpperCase();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ '/lots': true }); 
  const toggleMenu = (key) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));

  const navItems = allNavItems.filter(group => group.roles.includes(userRole));
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .sb-link:hover  { background: rgba(255,255,255,0.72) !important; color: #1a1a18 !important; }
        .sb-prnt:hover  { background: rgba(255,255,255,0.72) !important; color: #1a1a18 !important; }
        .sb-sub:hover   { background: rgba(255,255,255,0.72) !important; color: #1a1a18 !important; }
        .sb-foot:hover  { background: rgba(255,255,255,0.72) !important; }
        .sb-logout:hover { background: rgba(239, 68, 68, 0.08) !important; }
        .sb-ibtn:hover  { opacity: 0.75 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(26,26,24,0.1); border-radius: 4px; }
      `}</style>

      <aside style={{
        width: `${collapsed ? W_CLOSED : W_OPEN}px`,
        minWidth: `${collapsed ? W_CLOSED : W_OPEN}px`,
        maxWidth: `${collapsed ? W_CLOSED : W_OPEN}px`,
        minHeight: '100vh',
        backgroundImage: COW_PATTERN,
        backgroundSize: '140px 140px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#faf9f6',
        borderRight: '1px solid rgba(26,26,24,0.09)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        flexGrow: 0,
        transition: 'width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1), max-width 0.28s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'rgba(250,249,246,0.35)',
        }}/>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

          {/* ── Header ── */}
          <div style={{
            padding: '13px 11px 11px',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(26,26,24,0.07)',
            minHeight: '54px', flexShrink: 0,
          }}>
            {collapsed ? (
              <button className="sb-ibtn" onClick={() => setCollapsed(false)} title="Ouvrir"
                style={{ width: '28px', height: '28px', background: '#1a1a18', borderRadius: '7px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0, transition: 'opacity 0.15s' }}>
                F
              </button>
            ) : (
              <>
                <div style={{ overflow: 'hidden', minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1a1a18', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>FirmaTrack</div>
                  <div style={{ fontSize: '10px', color: '#9a9a90', marginTop: '1px', whiteSpace: 'nowrap' }}>Ferme El Baraka</div>
                </div>
                <button className="sb-ibtn" onClick={() => setCollapsed(true)} title="Réduire"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0afa8', padding: '5px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* ── Search ── */}
          {!collapsed && (
            <div style={{ padding: '9px 9px 3px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(26,26,24,0.09)', borderRadius: '7px', padding: '6px 10px', cursor: 'text' }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="#b8b7b0" strokeWidth="1.5"/>
                  <path d="M11 11l3 3" stroke="#b8b7b0" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '11px', color: '#c0bfb8' }}>Rechercher...</span>
              </div>
            </div>
          )}

          {/* ── Nav ── */}
          <nav style={{ flex: 1, padding: '4px 7px', overflowY: 'auto', overflowX: 'hidden' }}>
            {navItems.map((group, gi) => (
              <div key={gi} style={{ marginBottom: '2px' }}>
                {group.section && !collapsed && (
                  <div style={{ fontSize: '9px', fontWeight: '600', color: '#b0afa8', textTransform: 'uppercase', letterSpacing: '0.09em', padding: '9px 7px 3px' }}>
                    {group.section}
                  </div>
                )}
                {group.section && collapsed && <div style={{ height: '1px', background: 'rgba(26,26,24,0.07)', margin: '7px 3px' }}/>}

                {group.items.map(item => {
                  const hasChildren = item.children?.length > 0;
                  const isOpen = openMenus[item.to];
                  const isActive = location.pathname === item.to
                    || (hasChildren && item.children.some(c => location.pathname === c.to));

                  if (hasChildren) {
                    return (
                      <div key={item.to}>
                        <div className="sb-prnt"
                          onClick={() => !collapsed && toggleMenu(item.to)}
                          title={collapsed ? item.label : undefined}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: collapsed ? '8px 0' : '7px 7px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            borderRadius: '7px', fontSize: '12.5px',
                            fontWeight: isActive ? '500' : '400',
                            color: isActive ? '#1a1a18' : '#6a6a64',
                            cursor: 'pointer', marginBottom: '1px',
                            transition: 'all 0.12s', userSelect: 'none',
                            background: isActive ? 'rgba(255,255,255,0.72)' : 'transparent',
                          }}>
                          <span style={{ flexShrink: 0 }}>{item.icon}</span>
                          {!collapsed && (
                            <>
                              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                              <ChevronIcon open={isOpen} />
                            </>
                          )}
                        </div>
                        <SubMenu items={item.children} visible={isOpen} collapsed={collapsed} />
                      </div>
                    );
                  }

                  return (
                    <NavLink key={item.to} to={item.to} className="sb-link"
                      end // <--- FORCE L'EXACT MATCH POUR LES LIENS À PLAT (Économie)
                      title={collapsed ? item.label : undefined}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: collapsed ? '8px 0' : '7px 7px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderRadius: '7px', fontSize: '12.5px',
                        fontWeight: isActive ? '500' : '400',
                        color: isActive ? '#fff' : '#6a6a64',
                        background: isActive ? '#1a1a18' : 'transparent',
                        textDecoration: 'none', marginBottom: '1px',
                        transition: 'all 0.12s', whiteSpace: 'nowrap', position: 'relative',
                      })}>
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                          {item.badge && (
                            <span style={{ background: '#e8453c', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '1px 5px', borderRadius: '20px', lineHeight: '14px', flexShrink: 0 }}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && (
                        <span style={{ position: 'absolute', top: '5px', right: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#e8453c', border: '1.5px solid #faf9f6' }}/>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* ── Footer ── */}
          <div style={{ padding: '9px 7px', borderTop: '1px solid rgba(26,26,24,0.07)', flexShrink: 0 }}>
            
            {/* 1. Bloc Profil */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: collapsed ? '7px 0' : '7px 7px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              marginBottom: '4px'
            }}>
              <div style={{ 
                width: '26px', height: '26px', borderRadius: '7px', 
                background: '#1a1a18', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0 
              }}>
                {userInitial}
              </div>
              {!collapsed && (
                  <div style={{ overflow: 'hidden', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '500', color: '#1a1a18', whiteSpace: 'nowrap' }}>
                      {userName}
                    </div>
                    {/* Badge de validation automatique (Coche verte) */}
                    {localStorage.getItem('user_status') === 'APPROVED' && (
                      <span title="Profil vérifié par FirmaTrack" style={{ color: '#16a34a', fontSize: '12px' }}>Valide</span>
                    )}
                  </div>
                  <div style={{ fontSize: '10px', color: '#a0a098', whiteSpace: 'nowrap' }}>
                    {userRole === 'VETERINAIRE' ? ' Vétérinaire Expert' : ' Éleveur Producteur'}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Bouton Déconnexion */}
            <div className="sb-logout" 
                 onClick={handleLogout}
                 title="Se déconnecter"
                 style={{
                   display: 'flex', alignItems: 'center', gap: '8px',
                   padding: collapsed ? '8px 0' : '7px 7px',
                   justifyContent: collapsed ? 'center' : 'flex-start',
                   borderRadius: '7px', cursor: 'pointer', transition: 'all 0.12s',
                   color: '#ef4444',
                 }}>
              <div style={{ width: '26px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              {!collapsed && (
                <span style={{ fontSize: '11.5px', fontWeight: '600' }}>Déconnexion</span>
              )}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;