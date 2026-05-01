// AppLayout.jsx — Wrapper principal à utiliser dans App.jsx ou Router
// Usage:
// <AppLayout>
//   <Routes>...</Routes>
// </AppLayout>

import Sidebar from './components/layout/Sidebar';

const AppLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        minWidth: 0, // ← CRITIQUE: empêche le contenu de déborder
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#f7f6f4',
      }}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;