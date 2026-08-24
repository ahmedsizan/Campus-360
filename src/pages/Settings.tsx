import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  Volume2, 
  Globe, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  Sparkles,
  CheckCircle2,
  Download
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme, addToast, triggerInstallApp } = useApp();
  const { profile } = useAuth();

  const [notifications, setNotifications] = useState({
    busAlerts: true,
    noticeAlerts: true,
    cafeteriaOrder: true,
    complaintFeedback: true
  });

  const [soundEffects, setSoundEffects] = useState(true);

  const handleSaveSettings = () => {
    addToast('success', 'Preferences and notification triggers updated.', 'Settings Saved');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Application Preferences</h1>
        <p className="page-subtitle">Configure theme appearances, telemetry alerts, and portal configurations</p>
      </div>

      {/* Theme Customizer Card */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {theme === 'dark' ? <Moon size={20} color="#fbbf24" /> : <Sun size={20} color="#f59e0b" />}
          Appearance & Visual Theme
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Select your preferred interface color style. High contrast and glassmorphism enabled.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div
            onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            className="glass-card glass-card-interactive"
            style={{
              padding: '1.25rem',
              background: '#090d16',
              border: theme === 'dark' ? '2px solid var(--gub-green)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: theme === 'dark' ? '0 0 20px rgba(16,185,129,0.3)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>🌙 Cyber Dark</span>
              {theme === 'dark' && <CheckCircle2 size={18} color="#10b981" />}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Sleek deep navy theme with emerald neon highlights.
            </p>
          </div>

          <div
            onClick={() => { if (theme !== 'light') toggleTheme(); }}
            className="glass-card glass-card-interactive"
            style={{
              padding: '1.25rem',
              background: '#f8fafc',
              border: theme === 'light' ? '2px solid var(--gub-green)' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: theme === 'light' ? '0 0 20px rgba(16,185,129,0.3)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>☀️ Crisp Light</span>
              {theme === 'light' && <CheckCircle2 size={18} color="#10b981" />}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Clean bright daylight theme with clear readability.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Preferences Card */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} color="var(--gub-green)" /> Push & In-App Notifications
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Manage real-time notifications received during campus hours.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'busAlerts', title: 'Live Bus Arrival Alerts', desc: 'Notify when bus enters your 2km radius' },
            { key: 'noticeAlerts', title: 'Emergency & Academic Circulars', desc: 'Instant alerts for exam schedules and semester advisings' },
            { key: 'cafeteriaOrder', title: 'Cafeteria Order Ready Notifications', desc: 'Token alerts when food is ready for counter pickup' },
            { key: 'complaintFeedback', title: 'Grievance Resolution Updates', desc: 'Official administrative feedback on submitted complaints' },
          ].map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gub-green)', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile App Installation Card */}
      <div className="glass-card" style={{ padding: '2rem', border: '1.5px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} color="var(--gub-green)" /> Install Mobile & Desktop App
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Install Campus 360 directly on your iPhone, Android, or PC for standalone full-screen usage.
            </p>
          </div>

          <button className="btn btn-primary" onClick={triggerInstallApp}>
            <Download size={16} /> Install App
          </button>
        </div>
      </div>

      {/* Backend & Deployment Status */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={20} color="var(--gub-cyan)" /> Connected Cloud Infrastructure
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Live Supabase PostgreSQL Backend connection & Auth state
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATABASE STATUS</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gub-green)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <span className="live-pulse-dot" /> Supabase Connected
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HOSTING ENVIRONMENT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Vercel Edge Production
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE USER ROLE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gub-cyan)', marginTop: '0.2rem', textTransform: 'uppercase' }}>
              {profile?.role}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            <CheckCircle2 size={16} /> Save Preference Changes
          </button>
        </div>
      </div>
    </div>
  );
};
