import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Fingerprint, 
  Calendar, 
  Heart, 
  Shield, 
  FileText, 
  Edit3, 
  GraduationCap, 
  Clock,
  Sparkles,
  Lock,
  Camera,
  Palette,
  Moon,
  Sun,
  Globe,
  Check
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile } = useAuth();
  const { theme, setTheme, language, setLanguage, setIsProfileModalOpen } = useApp();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Hero Header Card */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.75rem' }}>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
            title="Click to edit profile picture"
          >
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={profile?.name}
              className="avatar-circle"
              style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--gub-green)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', flexShrink: 0 }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--gub-green)',
              color: '#fff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }} title="Change Photo">
              <Camera size={14} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className={`badge ${profile?.role === 'admin' ? 'badge-purple' : profile?.role === 'teacher' ? 'badge-cyan' : 'badge-emerald'}`}>
                {profile?.role?.toUpperCase()}
              </span>
              <span className="badge badge-slate">{profile?.id_no || 'GUB-22100234'}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{profile?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {profile?.department}
            </p>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setIsProfileModalOpen(true)}>
          <Edit3 size={17} /> Edit Profile & Photo
        </button>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Academic & University Details */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--gub-green)" /> Academic Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.department || 'Computer Science & Engineering'}</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID Number</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.id_no || 'GUB-22100234'}</div>
            </div>

            {profile?.role === 'student' && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Standing</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.semester || '8th Semester (Summer 2026)'}</div>
              </div>
            )}

            {profile?.role === 'teacher' && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Office Consultation Hours</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.office_hours || 'Sun & Tue: 10:00 AM - 1:00 PM'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Personal Details */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--gub-cyan)" /> Personal & Contact Info
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official University Email</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.email}</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mobile Phone</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.phone || '+880 1711 223344'}</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Group</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--gub-rose)' }}>{profile?.blood_group || 'B+'}</div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Father / Guardian Name</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile?.father_name || 'Rafiqul Islam'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Statement Card */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} color="var(--gub-purple)" /> Biography & Profile Statement
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {profile?.bio || 'Undergraduate student in the Department of Computer Science & Engineering at Green University of Bangladesh.'}
        </p>
      </div>

      {/* Theme Appearance & Language Preferences Card */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} color="var(--gub-green)" /> {language === 'bn' ? 'থিম ও ইন্টারফেস পছন্দ' : 'Theme & Interface Preferences'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          {language === 'bn' ? 'আপনার অ্যাকাউন্টের জন্য প্রিয় কালার থিম ও ভাষা নির্বাচন করুন।' : 'Choose your preferred visual theme and system language for your session.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Night Mode */}
          <div
            onClick={() => setTheme('dark')}
            className="glass-card glass-card-interactive"
            style={{
              padding: '1rem',
              cursor: 'pointer',
              border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
              background: theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Moon size={20} color="#38bdf8" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{language === 'bn' ? 'নাইট মোড' : 'Night Mode'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dark Slate Aesthetic</div>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} color="#38bdf8" />}
          </div>

          {/* Light Mode */}
          <div
            onClick={() => setTheme('light')}
            className="glass-card glass-card-interactive"
            style={{
              padding: '1rem',
              cursor: 'pointer',
              border: theme === 'light' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
              background: theme === 'light' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sun size={20} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{language === 'bn' ? 'লাইট মোড' : 'Light Mode'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clean Daylight</div>
              </div>
            </div>
            {theme === 'light' && <Check size={18} color="#f59e0b" />}
          </div>

          {/* Pink Mode */}
          <div
            onClick={() => setTheme('pink')}
            className="glass-card glass-card-interactive"
            style={{
              padding: '1rem',
              cursor: 'pointer',
              border: theme === 'pink' ? '2px solid #ec4899' : '1px solid var(--border-subtle)',
              background: theme === 'pink' ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={20} color="#ec4899" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{language === 'bn' ? 'গোলাপী মোড' : 'Pink Mode'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sakura Rose Glow</div>
              </div>
            </div>
            {theme === 'pink' && <Check size={18} color="#ec4899" />}
          </div>
        </div>

        {/* Language Selection Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--gub-green)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{language === 'bn' ? 'পোর্টাল ভাষা নির্বাচন:' : 'Portal Language:'}</span>
          </div>
          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`btn btn-sm ${language === 'bn' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            >
              বাংলা (Bengali)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
