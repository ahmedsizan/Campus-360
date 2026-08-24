import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallAppBanner: React.FC = () => {
  const { triggerInstallApp, setIsInstallModalOpen, isAppInstalled } = useApp();
  const [dismissed, setDismissed] = useState<boolean>(true);

  useEffect(() => {
    // Only show if not installed and not previously dismissed in this session
    const isDismissed = sessionStorage.getItem('gub_install_banner_dismissed');
    if (!isDismissed && !isAppInstalled) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => {
        setDismissed(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAppInstalled]);

  if (dismissed || isAppInstalled) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('gub_install_banner_dismissed', 'true');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
      left: '1rem',
      right: '1rem',
      maxWidth: '440px',
      margin: '0 auto',
      zIndex: 890,
      animation: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="glass-card" style={{
        padding: '0.85rem 1.15rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1.5px solid var(--gub-green)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gub-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Smartphone size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Install Campus 360 App
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Use like a regular phone app
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              triggerInstallApp();
              setDismissed(true);
            }}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', minHeight: '32px' }}
          >
            <Download size={14} /> Install
          </button>
          <button 
            onClick={handleDismiss}
            style={{ color: 'var(--text-muted)', padding: '4px' }}
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
