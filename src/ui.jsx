import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { avatarUrl, STATUS_META } from './data.js';
import { IconX, IconCheck, IconInbox } from './icons.jsx';

export const Avatar = ({ nome, size = 40, ring = false }) => (
  <div
    style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--line-soft)', flexShrink: 0,
      boxShadow: ring ? '0 0 0 3px var(--surface), 0 0 0 4px var(--line)' : 'none',
      overflow: 'hidden'
    }}
  >
    <img
      src={avatarUrl(nome)}
      alt={nome}
      width={size} height={size}
      style={{ display: 'block', borderRadius: '50%' }}
      loading="lazy"
    />
  </div>
);

export const StatusBadge = ({ status, size = 'md' }) => {
  const m = STATUS_META[status];
  const isSm = size === 'sm';
  return (
    <span className={`vale-status-badge ${m.cls} ${isSm ? 'sm' : ''}`}>
      <span className="vale-status-dot" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
};

// Toast system
export const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{
        position: 'fixed', left: '50%', transform: 'translateX(-50%)',
        bottom: 'calc(env(safe-area-inset-bottom, 0) + 88px)',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none', width: 'min(90vw, 380px)'
      }}>
        {toasts.map((t) => (
          <div key={t.id}
            className="vale-toast"
            style={{
              background: 'var(--ink)',
              color: '#fff', padding: '12px 16px', borderRadius: 10,
              fontSize: 14, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 24px rgba(15,23,42,0.20)',
              pointerEvents: 'auto'
            }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              background: t.type === 'error' ? '#EF4444' : '#10B981',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {t.type === 'error' ? <IconX size={12}/> : <IconCheck size={12}/>}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Bottom sheet (mobile) / centered modal (desktop)
export const Sheet = ({ open, onClose, children, title, fullHeight = false }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="vale-sheet-backdrop" onClick={onClose}>
      <div
        className={`vale-sheet ${fullHeight ? 'vale-sheet-full' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vale-sheet-handle"/>
        {title && (
          <div style={{
            padding: '4px 20px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>
            <button onClick={onClose} className="vale-icon-btn" aria-label="Fechar">
              <IconX size={18}/>
            </button>
          </div>
        )}
        <div style={{ overflow: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Empty state
export const EmptyState = ({ icon: Icon = IconInbox, title, body, action }) => (
  <div style={{
    padding: '48px 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: 'var(--line-soft)',
      border: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--subtle)', marginBottom: 4
    }}>
      <Icon size={32}/>
    </div>
    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
    {body && <div style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.5 }}>{body}</div>}
    {action}
  </div>
);

// Skeleton
export const Skeleton = ({ w = '100%', h = 14, r = 6, style = {} }) => (
  <div className="vale-skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

// Frequency dot for timeline
export const FreqDot = ({ status }) => (
  <div style={{
    width: 10, height: 10, borderRadius: '50%',
    background: STATUS_META[status].dot,
    boxShadow: `0 0 0 3px ${STATUS_META[status].bg}`
  }}/>
);
