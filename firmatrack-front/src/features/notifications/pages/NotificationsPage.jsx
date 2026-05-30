import React, { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '../../../components/common/Toast';
import notificationService from '../services/notificationService';

const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.25rem',
    boxSizing: 'border-box'
  },
  btnAction: {
    background: '#faf9f7',
    color: '#1a1a18',
    border: '0.5px solid #e8e7e2',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    fontFamily: "'DM Sans', sans-serif"
  },
  notificationItem: {
    background: '#fff',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '0.5px solid #e8e7e2',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
    border: '1px dashed #e8e7e2',
    borderRadius: '14px',
    color: '#9a9a96',
    fontSize: '13px',
    background: '#fff'
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
};

const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L15 14H1L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v4M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const { toasts, removeToast, toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data || []);
    } catch (err) {
      toast.error("Erreur de chargement des alertes.");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.marquerCommeLu(id);
      loadNotifications();
    } catch (err) {
      toast.error("Erreur de mise à jour.");
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
            <span>Ferme El Baraka</span>
            <span>/</span>
            <span style={{ color: '#1a1a18' }}>Notifications</span>
          </div>

          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
              Centre de Notifications
            </h1>
            <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
              Retrouvez vos alertes de sécurité sanitaire et vos notifications de suivi.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div 
                  key={n.id || i} 
                  style={{
                    ...s.notificationItem,
                    opacity: n.lu ? 0.65 : 1,
                    borderLeft: n.lu ? '3px solid #e8e7e2' : '3px solid #A32D2D'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      ...s.iconWrapper,
                      background: n.lu ? '#f1f0ec' : '#FCEBEB',
                      color: n.lu ? '#9a9a96' : '#A32D2D'
                    }}>
                      <IconAlert />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '500', color: '#1a1a18' }}>{n.titre}</h4>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#6b6b67', lineHeight: '1.4' }}>{n.message}</p>
                      <span style={{ fontSize: '11px', color: '#9a9a96', display: 'block', marginTop: '5px' }}>
                        Reçu le {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!n.lu && (
                    <button 
                      onClick={() => handleMarkAsRead(n.id)}
                      style={s.btnAction}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f0ec'}
                      onMouseLeave={e => e.currentTarget.style.background = '#faf9f7'}
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={s.emptyContainer}>
                 Aucune notification pour le moment. Tout est sous contrôle.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default NotificationsPage;