import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Sun, 
  Moon,
  Building,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { addToast, theme, toggleTheme } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [idNo, setIdNo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        addToast('error', error.message || 'Invalid credentials. Please verify your email and password.', 'Sign In Error');
      } else {
        addToast('success', 'Authenticated with Supabase backend successfully.', 'Welcome to Campus 360');
      }
    } else {
      if (!email.toLowerCase().endsWith('@green.edu.bd') && !email.toLowerCase().includes('green')) {
        addToast('info', 'University domain email @green.edu.bd is recommended.', 'Domain Notice');
      }

      const { error } = await signUp(email, password, name, role, department, idNo);
      if (error) {
        addToast('error', error.message || 'Registration failed with Supabase Auth.', 'Sign Up Error');
      } else {
        addToast('success', 'User registered in Supabase database! You are now signed in.', 'Registration Complete');
      }
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      position: 'relative'
    }}>
      {/* Top right theme toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} color="#6366f1" />}
        </button>
      </div>

      <div style={{
        maxWidth: '1020px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch'
      }}>
        {/* Left University Branding Card */}
        <div className="glass-card" style={{
          padding: '2.75rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.06) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}>
                <GraduationCap size={30} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus<span style={{ color: 'var(--gub-green)' }}>360</span></h1>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Green University of Bangladesh</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
              Unified Cloud Management Portal
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Directly connected to PostgreSQL on Supabase Cloud. Access official circulars, GPS transport fleet, digital cafeteria tray, and grievance redressal in real time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'PostgreSQL Real-Time Sync', desc: 'Instant live updates for notices, bus telemetry, and cafeteria orders' },
                { title: 'Supabase Auth & Security', desc: 'Encrypted sessions and role-based row level security' },
                { title: 'Student, Faculty & Admin Portals', desc: 'Tailored views and controls for every member of the university' }
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ marginTop: '3px' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{feat.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <Building size={16} color="var(--gub-green)" />
            <span>Purbachal American City Permanent Campus, Dhaka</span>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
                background: mode === 'login' ? 'var(--gub-green)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
                background: mode === 'register' ? 'var(--gub-green)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {mode === 'register' && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><UserCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Account Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Faculty Member</option>
                    <option value="admin">Administrator / Staff</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> Department</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option value="Computer Science & Engineering">CSE — Computer Science & Engineering</option>
                    <option value="Electrical & Electronic Engineering">EEE — Electrical & Electronic Engineering</option>
                    <option value="Textile Engineering">TE — Textile Engineering</option>
                    <option value="Green Business School">BBA — Green Business School</option>
                    <option value="Department of English">English Department</option>
                    <option value="Department of Law">Law Department</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><Fingerprint size={14} style={{ display: 'inline', marginRight: '4px' }} /> University ID Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 221002001"
                    value={idNo}
                    onChange={e => setIdNo(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> University Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. student@green.edu.bd"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={loading}
              >
                {loading ? 'Connecting to Supabase...' : mode === 'login' ? (
                  <>Sign In with Supabase <ArrowRight size={18} /></>
                ) : (
                  <>Register to Supabase Database <CheckCircle2 size={18} /></>
                )}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Directly connected to PostgreSQL on Supabase Cloud.
          </div>
        </div>
      </div>
    </div>
  );
};
