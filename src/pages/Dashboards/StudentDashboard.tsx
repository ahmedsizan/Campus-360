import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Bus, 
  Utensils, 
  Bell, 
  AlertCircle, 
  Search, 
  ArrowRight,
  MapPin,
  Download
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { notices, buses, setActiveTab, triggerInstallApp } = useApp();

  const activeBuses = buses.filter(b => b.status === 'active');
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Student Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={profile?.name}
            className="avatar-circle"
            style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-green)', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gub-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Portal
              </span>
              <span className="badge badge-emerald">Summer 2026</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {profile?.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {profile?.department} • ID: {profile?.id_no}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('cafeteria')}>
            <Utensils size={17} /> Order Food
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('transport')}>
            <Bus size={17} /> Track Bus
          </button>
          <button className="btn btn-outline" onClick={triggerInstallApp} style={{ borderColor: 'var(--gub-green)', color: 'var(--gub-green)' }}>
            <Download size={17} /> Install App
          </button>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.85rem' }}>Campus Quick Services</h3>
        <div className="grid-quick-services">
          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('cafeteria')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Utensils size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Cafeteria</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Order meals & snacks</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('transport')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Bus size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Live Transport</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Track shuttle buses</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('notices')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Bell size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Notice Board</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Official announcements</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('lostfound')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Search size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Lost & Found</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Report & claim items</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('complaints')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <AlertCircle size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Grievance Box</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Anonymous complaints</p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Bus Tracker Preview & Recent Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Active Bus Ticker */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="live-pulse-dot" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Live Transport Tracker</h3>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('transport')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeBuses.slice(0, 2).map(bus => (
              <div key={bus.id} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{bus.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bus.route}</p>
                  </div>
                  <span className="badge badge-emerald">ETA: {bus.eta}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--gub-green-light)', marginTop: '0.4rem' }}>
                  <MapPin size={14} /> {bus.current_location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Notices */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Latest Official Notices</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('notices')}>
              Board <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentNotices.map(notice => (
              <div 
                key={notice.id} 
                onClick={() => setActiveTab('notices')}
                style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.72rem' }}>{notice.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {notice.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
