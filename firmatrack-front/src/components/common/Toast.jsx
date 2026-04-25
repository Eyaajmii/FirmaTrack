import { useEffect, useState } from 'react';

// ── Toast individuel ──────────────────────────────────────────────────────────
const icons = {
  success: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#27500A" strokeWidth="1.3"/>
      <path d="M5 8l2 2 4-4" stroke="#27500A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#791F1F" strokeWidth="1.3"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#791F1F" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="#633806" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8 6v3" stroke="#633806" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="0.6" fill="#633806"/>
    </svg>
  ),
};

const styles = {
  success: { bg: '#EAF3DE', border: '#C0DD97', color: '#27500A' },
  error:   { bg: '#FCEBEB', border: '#f7c1c1', color: '#791F1F' },
  warning: { bg: '#FAEEDA', border: '#FAC775', color: '#633806' },
};

const Toast = ({ id, type = 'success', message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrée
    requestAnimationFrame(() => setVisible(true));
    // Auto-close après 3.5s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const s = styles[type];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: s.bg, border: `0.5px solid ${s.border}`,
      color: s.color, borderRadius: '10px',
      padding: '10px 14px', fontSize: '12px', fontWeight: '500',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transform: visible ? 'translateX(0)' : 'translateX(110%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
      minWidth: '240px', maxWidth: '340px',
      cursor: 'default',
    }}>
      {icons[type]}
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose(id), 300); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.color, opacity: 0.6, padding: '0 0 0 4px', fontSize: '14px', lineHeight: 1 }}>
        ×
      </button>
    </div>
  );
};

// ── Container des toasts ──────────────────────────────────────────────────────
export const ToastContainer = ({ toasts, onClose }) => (
  <div style={{
    position: 'fixed', bottom: '24px', right: '24px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    zIndex: 9999, pointerEvents: 'none',
  }}>
    {toasts.map(t => (
      <div key={t.id} style={{ pointerEvents: 'all' }}>
        <Toast {...t} onClose={onClose} />
      </div>
    ))}
  </div>
);

// ── Hook useToast ─────────────────────────────────────────────────────────────
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return { toasts, removeToast, toast };
};

export default Toast;