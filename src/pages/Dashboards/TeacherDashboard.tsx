import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  Calendar, 
  MapPin, 
  Bell, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Moon, 
  Sun,
  Globe
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { notices, setActiveTab, theme, setTheme, language, setLanguage } = useApp();
  const t = translations[language];

  const teacherSchedule = [
    { code: 'CSE 411', title: 'Distributed Systems & Cloud Computing', section: 'Sec A (60 Students)', time: '08:30 AM - 10:00 AM', room: 'Building A, Room 402', status: language === 'bn' ? 'সম্পন্ন' : 'Completed' },
    { code: 'CSE 323', title: 'Operating Systems & Concurrency', section: 'Sec B (45 Students)', time: '11:30 AM - 01:00 PM', room: 'Software Lab 3, 5th Floor', status: language === 'bn' ? 'চলমান' : 'Ongoing' },
    { code: 'CSE 499', title: 'Senior Capstone Project Supervision', section: 'Team Alpha & Beta', time: '03:00 PM - 04:30 PM', room: 'Faculty Lounge Room 302', status: language === 'bn' ? 'আসন্ন' : 'Upcoming' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Faculty Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={profile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
            alt={profile?.name}
            className="avatar-circle"
            style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-cyan)', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gub-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.dashFacultyPortal}
              </span>
              <span className="badge badge-cyan">{t.dashFacultyId}: {profile?.id_no || 'FAC-8891'}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{language === 'bn' ? `স্বাগতম, ${profile?.name}` : `Welcome, ${profile?.name}`}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {profile?.department} • {t.dashOfficeHours}: {profile?.office_hours || (language === 'bn' ? 'রবি ও মঙ্গল: সকাল ১০:০০ - দুপুর ১:০০' : 'Sun & Tue: 10:00 AM - 1:00 PM')}
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

          <button className="btn btn-primary" onClick={() => setActiveTab('notices')}>
            <Bell size={18} /> {language === 'bn' ? 'সার্কুলার ও নোটিশ' : 'View Circulars'}
          </button>
        </div>
      </div>

      {/* Faculty Metrics */}
      <div className="grid-stats">
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Courses</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>3 Sections</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Students</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>128 Enrolled</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Consultation Hours</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>6.0 hrs/wk</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Grades Submitted</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>Midterm Ready</div>
          </div>
        </div>
      </div>

      {/* Today's Lecture Schedule */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Today's Teaching Schedule</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classrooms, labs, and student consultation slots</p>
          </div>
          <span className="badge badge-emerald">Spring/Summer 2026</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {teacherSchedule.map((item, idx) => (
            <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-cyan">{item.code}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.section}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {item.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {item.room}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${item.status === 'Completed' ? 'badge-slate' : item.status === 'Ongoing' ? 'badge-emerald' : 'badge-amber'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
