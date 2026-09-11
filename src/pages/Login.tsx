import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
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
  Sparkles,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { addToast, theme, setTheme } = useApp();

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

  // Live duplicate checking state
  const [checkingId, setCheckingId] = useState(false);
  const [remoteIdTaken, setRemoteIdTaken] = useState(false);
  const [remoteOwnerName, setRemoteOwnerName] = useState('');

  const isIdTaken = (id: string) => {
    if (!id) return false;
    const clean = id.trim().toLowerCase();
    const demoIds = ['221002001', 'fac-cse-104', 'adm-gub-001', 'gub-staff-042'];
    if (demoIds.includes(clean)) return true;
    try {
      const localRegistered = JSON.parse(localStorage.getItem('gub_registered_accounts') || '[]') as { id_no?: string }[];
      if (localRegistered.some(u => u.id_no && u.id_no.toLowerCase() === clean)) return true;
    } catch {}
    try {
      const cur = JSON.parse(localStorage.getItem('gub_user') || '{}') as { id_no?: string };
      if (cur?.id_no && cur.id_no.toLowerCase() === clean) return true;
    } catch {}
    return false;
  };

  // Live check against local storage and Supabase cloud database as user types ID
  useEffect(() => {
    const clean = idNo.trim();
    if (!clean || (role === 'student' && clean.length !== 9)) {
      setRemoteIdTaken(false);
      setRemoteOwnerName('');
      return;
    }

    // Check local immediately
    if (isIdTaken(clean)) {
      setRemoteIdTaken(true);
      setRemoteOwnerName('Registered Locally / Demo Account');
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setCheckingId(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, id_no, name, email')
          .ilike('id_no', clean)
          .limit(1);

        if (active) {
          if (data && data.length > 0) {
            setRemoteIdTaken(true);
            setRemoteOwnerName(data[0].name || data[0].email || 'in Database');
          } else {
            setRemoteIdTaken(false);
            setRemoteOwnerName('');
          }
        }
      } catch (err) {
        // silent
      } finally {
        if (active) setCheckingId(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [idNo, role]);

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
      const cleanId = idNo.trim();

      // Validate Student Registration Rules (Strictly 9-digit ID and exact [ID]@student.green.ac.bd match)
      if (role === 'student') {
        if (cleanId.length !== 9 || !/^\d{9}$/.test(cleanId)) {
          setLoading(false);
          addToast(
            'error', 
            `Student ID must be exactly 9 numeric digits (e.g. 232002038). Currently entered: ${cleanId.length} digit${cleanId.length === 1 ? '' : 's'}.`, 
            'Invalid Student ID'
          );
          return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const expectedEmail = `${cleanId}@student.green.ac.bd`;
        if (cleanEmail !== expectedEmail) {
          setLoading(false);
          addToast(
            'error', 
            `Student email must match your 9-digit University ID exactly: "${expectedEmail}". You cannot open an account with "${cleanEmail}".`, 
            'Email Must Match Student ID'
          );
          return;
        }
      }

      // Check if ID is already registered locally or remotely
      if (isIdTaken(cleanId) || remoteIdTaken) {
        setLoading(false);
        addToast(
          'error',
          `University ID "${cleanId}" is already registered (${remoteOwnerName || 'Existing User'}). Each ID can only have one unique account. Please Sign In instead.`,
          'ID Already Registered'
        );
        return;
      }

      // Final live pre-check against Supabase profiles table right before registration
      try {
        const { data: dbMatches } = await supabase
          .from('profiles')
          .select('id, id_no, name, email')
          .ilike('id_no', cleanId)
          .limit(1);

        if (dbMatches && dbMatches.length > 0) {
          setLoading(false);
          setRemoteIdTaken(true);
          setRemoteOwnerName(dbMatches[0].name || dbMatches[0].email || 'in Database');
          addToast(
            'error',
            `University ID "${cleanId}" is already registered (${dbMatches[0].name || dbMatches[0].email}). Duplicate accounts with the same ID are strictly prohibited. Please switch to Sign In.`,
            'ID Already Registered'
          );
          return;
        }
      } catch (err) {
        console.warn('DB uniqueness check error:', err);
      }

      const finalDept = role === 'conductor' ? 'Transport & Fleet Division' : department;
      const { error } = await signUp(email, password, name, role, finalDept, idNo);
      if (error) {
        addToast('error', error.message || 'Registration failed with Supabase.', 'Sign Up Failed');
      } else {
        addToast('success', 'Account created successfully! Welcome to Campus 360.', 'Account Created');
      }
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-subtle)',
    fontWeight: 500
  };

  const isStudentEmailMatched = role === 'student' && idNo.trim().length === 9 && email.trim().toLowerCase() === `${idNo.trim()}@student.green.ac.bd`;
  const isCurrentIdDuplicate = isIdTaken(idNo) || remoteIdTaken;

  return (
    <div className="login-page-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Theme Mode Segmented Switcher Top-Right (Night, Light, Pink) */}
      <div className="login-theme-switcher" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
        <div className="theme-segmented-control" role="group" aria-label="Campus 360 Theme Selector">
          <button 
            type="button"
            className={`theme-segmented-btn ${theme === 'dark' ? 'active-dark' : ''}`}
            onClick={() => setTheme('dark')}
            aria-label="Night Mode"
            title="Night Mode (Dark Slate)"
          >
            <Moon size={15} color={theme === 'dark' ? '#38bdf8' : 'currentColor'} />
            <span>Night</span>
          </button>

          <button 
            type="button"
            className={`theme-segmented-btn ${theme === 'light' ? 'active-light' : ''}`}
            onClick={() => setTheme('light')}
            aria-label="Light Mode"
            title="Light Mode (Clean Daylight)"
          >
            <Sun size={15} color={theme === 'light' ? '#d97706' : 'currentColor'} />
            <span>Light</span>
          </button>

          <button 
            type="button"
            className={`theme-segmented-btn ${theme === 'pink' ? 'active-pink' : ''}`}
            onClick={() => setTheme('pink')}
            aria-label="Pink Mode"
            title="Pink Mode (Sakura Rose Glow)"
          >
            <Sparkles size={15} color={theme === 'pink' ? '#ffffff' : '#ec4899'} />
            <span>Pink</span>
          </button>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div className="glass-card animate-fade-in login-auth-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: theme === 'dark'
          ? '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.15)'
          : theme === 'pink'
          ? '0 25px 60px -15px rgba(244, 63, 114, 0.18), 0 0 35px rgba(236, 72, 153, 0.26)'
          : '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 30px rgba(16, 185, 129, 0.12)',
        border: theme === 'pink'
          ? '1.5px solid rgba(244, 114, 182, 0.35)'
          : '1px solid var(--border-card)'
      }}>
        {/* Brand Header */}
        <div className="login-brand-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="login-brand-icon" style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: theme === 'pink'
              ? 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1rem',
            boxShadow: theme === 'pink'
              ? '0 8px 24px rgba(236, 72, 153, 0.45)'
              : '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h1 className="login-brand-title" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Campus<span style={{ color: 'var(--gub-green)' }}>360</span>
          </h1>
          <p className="login-brand-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Green University of Bangladesh
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="login-tab-switcher" style={{
          display: 'flex',
          background: theme === 'dark' ? '#0f172a' : theme === 'pink' ? 'rgba(236, 72, 153, 0.12)' : '#e2e8f0',
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
        <form onSubmit={handleSubmit} className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {mode === 'register' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={role === 'conductor' ? 'e.g. Md. Rafiqul Islam (Conductor)' : 'Ahmed Sizan'}
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
                  onChange={e => {
                    const newRole = e.target.value as UserRole;
                    setRole(newRole);
                    if (newRole === 'student') {
                      const clean = idNo.trim().replace(/\D/g, '').slice(0, 9);
                      setIdNo(clean);
                      if (clean) {
                        setEmail(`${clean}@student.green.ac.bd`);
                      }
                    }
                  }}
                  style={inputStyle}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Administrator</option>
                  <option value="conductor">Bus Conductor (Transit Staff)</option>
                </select>
              </div>

              {/* Department is only for Academic Roles (Student, Teacher, Admin), NOT for Bus Conductor */}
              {role !== 'conductor' && (
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
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    <Fingerprint size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
                    {role === 'conductor' ? 'Staff / Conductor ID Number' : 'University ID Number'}
                  </label>
                  {role === 'student' && (
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      color: idNo.length === 9 ? '#10b981' : idNo.length > 0 ? '#f59e0b' : 'var(--text-muted)' 
                    }}>
                      {idNo.length}/9 digits
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder={
                    role === 'conductor' 
                      ? 'e.g. STAFF-042 or GUB-COND-01' 
                      : role === 'student' 
                      ? 'e.g. 232002038 (Exactly 9 digits)' 
                      : 'e.g. FAC-CSE-104'
                  }
                  value={idNo}
                  maxLength={role === 'student' ? 9 : 25}
                  onChange={e => {
                    let val = e.target.value;
                    if (role === 'student') {
                      val = val.replace(/\D/g, '').slice(0, 9);
                      // Instantly sync email: as soon as ID is typed, email immediately becomes [ID]@student.green.ac.bd
                      setEmail(val ? `${val}@student.green.ac.bd` : '');
                    }
                    setIdNo(val);
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: isCurrentIdDuplicate
                      ? '#ef4444'
                      : role === 'student' && idNo.length > 0 && idNo.length !== 9 
                      ? '#f59e0b' 
                      : role === 'student' && idNo.length === 9 
                      ? '#10b981' 
                      : inputStyle.borderColor
                  }}
                  required
                />
                {role === 'student' && (
                  <div style={{ marginTop: '0.35rem' }}>
                    {isCurrentIdDuplicate ? (
                      <div style={{ 
                        fontSize: '0.78rem', 
                        color: '#ef4444', 
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontWeight: 600 
                      }}>
                        <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                        <span>University ID ({idNo}) is already registered! You cannot create multiple accounts with the same ID. Please switch to Sign In.</span>
                      </div>
                    ) : checkingId ? (
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Checking ID uniqueness...</span>
                      </div>
                    ) : idNo.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        * University ID must be exactly 9 numeric digits (e.g. <code>232002038</code>).
                      </div>
                    ) : idNo.length < 9 ? (
                      <div style={{ fontSize: '0.76rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <AlertCircle size={13} color="#f59e0b" />
                        <span>ID must be 9 digits ({idNo.length}/9). {9 - idNo.length} more needed. Email will be: <code>{idNo}@student.green.ac.bd</code></span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>Valid 9-digit Student ID ({idNo}) is available — Email: <code>{idNo}@student.green.ac.bd</code></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address
              </label>
              {mode === 'register' && role === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    if (idNo) {
                      setEmail(`${idNo}@student.green.ac.bd`);
                    }
                  }}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isStudentEmailMatched ? '#10b981' : '#f59e0b',
                    background: isStudentEmailMatched ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    border: `1px solid ${isStudentEmailMatched ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.4)'}`,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Click to 1-tap auto-fill official student email"
                >
                  {isStudentEmailMatched ? (
                    <>
                      <CheckCircle2 size={12} color="#10b981" />
                      <span>Matched ({idNo}@student.green.ac.bd)</span>
                    </>
                  ) : (
                    <>
                      <span>⚡ 1-Click Fill: {idNo ? `${idNo}@student.green.ac.bd` : '[ID]@student.green.ac.bd'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <input
              type="email"
              className="form-input"
              placeholder={
                mode === 'register' && role === 'student'
                  ? (idNo ? `${idNo}@student.green.ac.bd` : '232002038@student.green.ac.bd')
                  : 'user@green.edu.bd'
              }
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: mode === 'register' && role === 'student' && email.length > 0 && !isStudentEmailMatched
                  ? '#ef4444'
                  : mode === 'register' && role === 'student' && isStudentEmailMatched
                  ? '#10b981'
                  : inputStyle.borderColor
              }}
              required
            />

            {/* Student Email Exact ID Match & Instruction Banner */}
            {mode === 'register' && role === 'student' && (
              <div style={{ marginTop: '0.35rem' }}>
                {idNo.length < 9 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    * Prothome upore 9-digit University ID likhun. Sekhane ID likhle email automatic <code>{idNo || '232002038'}@student.green.ac.bd</code> set hoye jabe.
                  </div>
                ) : isStudentEmailMatched ? (
                  <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span>Exact match: <code>{email}</code> (Matched with ID: {idNo})</span>
                  </div>
                ) : (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    fontSize: '0.78rem',
                    marginTop: '0.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: 700 }}>
                      <AlertCircle size={14} color="#ef4444" />
                      <span>ID & Email Address Match Required</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      Apnar University ID holo <strong>{idNo}</strong>। Tai apnar student email obosshoi <strong>{idNo}@student.green.ac.bd</strong> hote hobe (onno kono email allowed na)।
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmail(`${idNo}@student.green.ac.bd`)}
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '2px',
                        padding: '5px 12px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span>⚡ Click to Auto-Fill: {idNo}@student.green.ac.bd</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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
              className="btn btn-primary login-submit-btn"
              style={{ 
                width: '100%', 
                padding: '0.85rem',
                opacity: (mode === 'register' && isCurrentIdDuplicate) ? 0.65 : 1,
                cursor: (mode === 'register' && isCurrentIdDuplicate) ? 'not-allowed' : 'pointer'
              }}
              disabled={loading || (mode === 'register' && isCurrentIdDuplicate)}
            >
              {loading ? (
                'Please wait...'
              ) : mode === 'login' ? (
                <>Sign In <ArrowRight size={18} /></>
              ) : isCurrentIdDuplicate ? (
                <>ID Already Registered — Switch to Sign In</>
              ) : (
                <>Create Account <CheckCircle2 size={18} /></>
              )}
            </button>
          </div>

          {mode === 'login' && (
            <div className="login-demo-box" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span className="login-demo-title" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
                Quick 1-Tap Tablet Demo Login
              </span>
              <div className="login-demo-buttons" style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    setEmail('student@green.edu.bd');
                    setPassword('student123');
                    setLoading(true);
                    const { error } = await signIn('student@green.edu.bd', 'student123');
                    setLoading(false);
                    if (error) {
                      addToast('error', error.message || 'Login failed', 'Sign In Failed');
                    } else {
                      addToast('success', 'Signed in as Ahmed Sizan (Student)', 'Welcome Back');
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    setEmail('teacher@green.edu.bd');
                    setPassword('teacher123');
                    setLoading(true);
                    const { error } = await signIn('teacher@green.edu.bd', 'teacher123');
                    setLoading(false);
                    if (error) {
                      addToast('error', error.message || 'Login failed', 'Sign In Failed');
                    } else {
                      addToast('success', 'Signed in as Dr. Mohammad Nazmul Islam (Faculty)', 'Welcome Back');
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Faculty Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    setEmail('admin@green.edu.bd');
                    setPassword('admin123');
                    setLoading(true);
                    const { error } = await signIn('admin@green.edu.bd', 'admin123');
                    setLoading(false);
                    if (error) {
                      addToast('error', error.message || 'Login failed', 'Sign In Failed');
                    } else {
                      addToast('success', 'Signed in as Administrator', 'Welcome Back');
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    setEmail('conductor@green.edu.bd');
                    setPassword('conductor123');
                    setLoading(true);
                    const { error } = await signIn('conductor@green.edu.bd', 'conductor123');
                    setLoading(false);
                    if (error) {
                      addToast('error', error.message || 'Login failed', 'Sign In Failed');
                    } else {
                      addToast('success', 'Signed in as Bus Conductor', 'Welcome Back');
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', border: '1.5px solid #f59e0b', color: '#f59e0b', fontWeight: 700 }}
                >
                  🚌 Conductor Demo
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
