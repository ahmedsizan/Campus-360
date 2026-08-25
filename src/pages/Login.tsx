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
  Sun, 
  Moon,
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
        addToast('error', error.message || 'Invalid credentials. Please check your email and password.', 'Sign In Failed');
      } else {
        addToast('success', 'Signed in successfully.', 'Welcome');
      }
    } else {
      const { error } = await signUp(email, password, name, role, department, idNo);
      if (error) {
        addToast('error', error.message || 'Registration failed with Supabase.', 'Sign Up Failed');
      } else {
        addToast('success', 'Account created successfully! Welcome to Campus 360.', 'Account Created');
      }
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? '#151e32' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#0f172a',
    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.15)',
    fontWeight: 500
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Theme Toggle Top-Right */}
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

      {/* Centered Auth Card */}
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Campus<span style={{ color: 'var(--gub-green)' }}>360</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Green University of Bangladesh
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: theme === 'dark' ? '#0f172a' : '#e2e8f0',
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {mode === 'register' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ahmed Sizan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <UserCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Role
                </label>
                <select
                  className="form-select"
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  style={inputStyle}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> Department
                </label>
                <select
                  className="form-select"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={inputStyle}
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
                <label className="form-label">
                  <Fingerprint size={14} style={{ display: 'inline', marginRight: '4px' }} /> University ID Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 221002001"
                  value={idNo}
                  onChange={e => setIdNo(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="user@green.edu.bd"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '42px' }}
                required
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

          <div style={{ marginTop: '0.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? (
                <>Sign In <ArrowRight size={18} /></>
              ) : (
                <>Create Account <CheckCircle2 size={18} /></>
              )}
            </button>
          </div>

          {mode === 'login' && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
                Quick 1-Tap Tablet Demo Login
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEmail('student@green.edu.bd');
                    setPassword('student123');
                    signIn('student@green.edu.bd', 'student123');
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEmail('teacher@green.edu.bd');
                    setPassword('teacher123');
                    signIn('teacher@green.edu.bd', 'teacher123');
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Faculty Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEmail('admin@green.edu.bd');
                    setPassword('admin123');
                    signIn('admin@green.edu.bd', 'admin123');
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Admin Demo
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
