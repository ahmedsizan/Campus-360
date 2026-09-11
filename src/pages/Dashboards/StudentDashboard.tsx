import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  Bus, 
  Utensils, 
  Bell, 
  AlertCircle, 
  Search, 
  ArrowRight,
  MapPin,
  Download,
  Moon,
  Sun,
  Sparkles,
  Globe
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { 
    notices, 
    buses, 
    setActiveTab, 
    triggerInstallApp, 
    setIsProfileModalOpen, 
    theme, 
    setTheme,
    language,
    setLanguage
  } = useApp();

  const t = translations[language];
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
            onClick={() => setIsProfileModalOpen(true)}
            title="Tap to change profile picture"
            style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-green)', flexShrink: 0, cursor: 'pointer' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gub-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.dashStudentPortal}
              </span>
              <span className="badge badge-emerald">{t.dashSemester}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {t.dashWelcomeBack.replace('{name}', profile?.name || '')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {profile?.department} • {t.dashId}: {profile?.id_no}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
          {/* Dedicated Non-Overlapping Single-Row Controls for Language & Theme */}
          <div className="banner-controls-group">
            {/* Language Switcher (বাংলা | English) */}
            <div className="lang-segmented-control dashboard-lang-control" role="group" aria-label="Language Selector">
              <button 
                type="button"
                className={`lang-segmented-btn ${language === 'bn' ? 'active' : ''}`}
                onClick={() => setLanguage('bn')}
                aria-label="বাংলা ভাষা"
                title="বাংলা ভাষা নির্বাচন করুন"
              >
                <Globe size={13} />
                <span>বাংলা</span>
              </button>
              <button 
                type="button"
                className={`lang-segmented-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="English Language"
                title="Switch to English"
              >
                <span>English</span>
              </button>
            </div>

            {/* Theme Selector (Night / Light / Pink) */}
            <div className="theme-segmented-control dashboard-theme-control" role="group" aria-label="Appearance Theme Selector">
              <button 
                type="button"
                className={`theme-segmented-btn ${theme === 'dark' ? 'active-dark' : ''}`}
                onClick={() => setTheme('dark')}
                title={language === 'bn' ? 'নাইট মোড' : 'Night Mode (Dark Slate)'}
                aria-label="Night Mode"
              >
                <Moon size={14} color={theme === 'dark' ? '#38bdf8' : 'currentColor'} />
                <span className="theme-btn-text">{t.dashThemeNight}</span>
              </button>
              <button 
                type="button"
                className={`theme-segmented-btn ${theme === 'light' ? 'active-light' : ''}`}
                onClick={() => setTheme('light')}
                title={language === 'bn' ? 'লাইট মোড' : 'Light Mode (Clean Daylight)'}
                aria-label="Light Mode"
              >
                <Sun size={14} color={theme === 'light' ? '#d97706' : 'currentColor'} />
                <span className="theme-btn-text">{t.dashThemeLight}</span>
              </button>
              <button 
                type="button"
                className={`theme-segmented-btn ${theme === 'pink' ? 'active-pink' : ''}`}
                onClick={() => setTheme('pink')}
                title={language === 'bn' ? 'গোলাপী মোড' : 'Pink Mode (Sakura Rose Glow)'}
                aria-label="Pink Mode"
              >
                <Sparkles size={14} color={theme === 'pink' ? '#ffffff' : '#ec4899'} />
                <span className="theme-btn-text">{t.dashThemePink}</span>
              </button>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setActiveTab('cafeteria')}>
            <Utensils size={17} /> {t.dashOrderFood}
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('transport')}>
            <Bus size={17} /> {t.dashTrackBus}
          </button>
          <button className="btn btn-outline" onClick={triggerInstallApp} style={{ borderColor: 'var(--gub-green)', color: 'var(--gub-green)' }}>
            <Download size={17} /> {t.navInstallApp}
          </button>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.85rem' }}>{t.dashQuickServices}</h3>
        <div className="grid-quick-services">
          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('cafeteria')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Utensils size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.navCafeteria}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.dashOrderMealsSnacks}</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('transport')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Bus size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.navTransport}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.dashSchedulesBooking}</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('notices')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Bell size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.navNotices}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.dashOfficialAnnouncements}</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('lostfound')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Search size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.navLostFound}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.dashReportClaimItems}</p>
          </div>

          <div 
            className="glass-card glass-card-interactive" 
            onClick={() => setActiveTab('complaints')}
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <AlertCircle size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.dashGrievanceBox}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.dashAnonymousComplaints}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Bus Schedule Preview & Recent Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Active Bus Schedule */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bus size={18} color="var(--gub-green)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.dashBusFleet}</h3>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('transport')}>
              {t.dashViewAll} <ArrowRight size={14} />
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
                  <span className="badge badge-emerald">{bus.eta}</span>
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.dashLatestNotices}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('notices')}>
              {t.dashNoticeBoard} <ArrowRight size={14} />
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

