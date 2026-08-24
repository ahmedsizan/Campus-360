import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let icon = <CheckCircle2 size={20} color="#10b981" />;
        if (toast.type === 'error') icon = <AlertCircle size={20} color="#f43f5e" />;
        if (toast.type === 'info') icon = <Info size={20} color="#06b6d4" />;
        if (toast.type === 'warning') icon = <AlertTriangle size={20} color="#f59e0b" />;

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-muted)', padding: '2px' }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
