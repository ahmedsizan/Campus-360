import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  GraduationCap,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallAppModal: React.FC = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, triggerInstallApp, isAppInstalled } = useApp();
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  if (!isInstallModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsInstallModalOpen(false)}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '2rem 1.75rem', textAlign: 'center' }}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsInstallModalOpen(false)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* App Icon Banner */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          margin: '0 auto 1.25rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.45)'
        }}>
          <GraduationCap size={40} />
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Install <span style={{ color: 'var(--gub-green)' }}>Campus 360</span> App
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
          Use Campus 360 like a regular native app on your phone with full screen, instant loading, and fast access!
        </p>

        {/* Device-Specific Instructions */}
        {deviceType === 'ios' ? (
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700
              }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Tap the Share Icon in Safari
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Tap the <Share size={14} style={{ display: 'inline', margin: '0 2px' }} /> share button at the bottom center of your iPhone screen.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700
              }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Select "Add to Home Screen"
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Scroll down the share sheet and tap <PlusSquare size={14} style={{ display: 'inline', margin: '0 2px' }} /> <strong>Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700
              }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Tap "Add" in Top Right
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Campus 360 will appear on your iPhone home screen!
                </div>
              </div>
            </div>
          </div>
        ) : deviceType === 'android' ? (
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>No app store download needed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Zero storage usage, instant updates</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Full screen standalone app experience</span>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Laptop size={18} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Install as Desktop App (Chrome / Edge / Windows)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '1.75rem' }}>
              Click the button below or tap the install icon <Download size={14} style={{ display: 'inline' }} /> in your browser address bar.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {deviceType !== 'ios' && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                triggerInstallApp();
                setIsInstallModalOpen(false);
              }}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Download size={18} /> Install App Now
            </button>
          )}

          <button 
            className="btn btn-secondary"
            onClick={() => setIsInstallModalOpen(false)}
            style={{ width: '100%' }}
          >
            {deviceType === 'ios' ? 'Got It!' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </div>
  );
};
