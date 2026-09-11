import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../translations';
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
  UserCheck,
  Globe
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { addToast, theme, setTheme, language, setLanguage } = useApp();
  const t = translations[language];

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

  // Refs for seamless Arrow Key navigation across form elements
  const formRef = useRef<HTMLFormElement>(null);
  const tabSignInRef = useRef<HTMLButtonElement>(null);
  const tabRegisterRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation: ArrowDown / ArrowUp moves through all form fields
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
      return;
    }

    const target = e.target as HTMLElement;

    // For Select elements: Left/Right arrow keys cycle options, Up/Down navigate fields
    if (target.tagName === 'SELECT') {
      if (e.key === 'ArrowRight') {
        const sel = target as HTMLSelectElement;
        if (sel.selectedIndex < sel.options.length - 1) {
          sel.selectedIndex++;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
      } else if (e.key === 'ArrowLeft') {
        const sel = target as HTMLSelectElement;
        if (sel.selectedIndex > 0) {
          sel.selectedIndex--;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
      }
    }

    // Allow Enter key on submit button or password input to submit the form normally
    if (e.key === 'Enter') {
      if (target.tagName === 'BUTTON' || (target instanceof HTMLInputElement && target.type === 'password')) {
        return;
      }
    }

    const form = formRef.current;
    if (!form) return;

    // Collect all visible, active inputs, selects, and submit button
    const fields = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), button.login-submit-btn:not([disabled])'
      )
    ).filter(el => el.offsetParent !== null);

    const currentIndex = fields.indexOf(target);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % fields.length;
      const nextField = fields[nextIndex];
      if (nextField) {
        nextField.focus();
        if (nextField instanceof HTMLInputElement && nextField.type !== 'password') {
          nextField.select();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // If pressing ArrowUp on the very first field, move focus up to the active tab button
      if (currentIndex === 0) {
        if (mode === 'register') {
          tabRegisterRef.current?.focus();
        } else {
          tabSignInRef.current?.focus();
        }
        return;
      }

      const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
      const prevField = fields[prevIndex];
      if (prevField) {
        prevField.focus();
        if (prevField instanceof HTMLInputElement && prevField.type !== 'password') {
          prevField.select();
        }
      }
    }
  };

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
      setRemoteOwnerName(language === 'bn' ? 'নিবন্ধিত ডেমো অ্যাকাউন্ট' : 'Demo Account');
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
            setRemoteOwnerName(data[0].name || data[0].email || (language === 'bn' ? 'ডাটাবেজে বিদ্যমান' : 'in Database'));
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
  }, [idNo, role, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        addToast('error', error.message || t.toastInvalidCredentials, t.toastSignInFailed);
      } else {
        addToast('success', t.toastSignInSuccess, t.toastWelcome);
      }
    } else {
      const cleanId = idNo.trim();

      // Validate Student Registration Rules (Strictly 9-digit ID and exact [ID]@student.green.ac.bd match)
      if (role === 'student') {
        if (cleanId.length !== 9 || !/^\d{9}$/.test(cleanId)) {
          setLoading(false);
          addToast(
            'error', 
            t.toastInvalidStudentIdMsg.replace('{count}', String(cleanId.length)), 
            t.toastInvalidStudentIdTitle
          );
          return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const expectedEmail = `${cleanId}@student.green.ac.bd`;
        if (cleanEmail !== expectedEmail) {
          setLoading(false);
          addToast(
            'error', 
            t.toastEmailMatchMsg.replace('{expected}', expectedEmail).replace('{actual}', cleanEmail), 
            t.toastEmailMatchTitle
          );
          return;
        }
      }

      // Check if ID is already registered locally or remotely
      if (isIdTaken(cleanId) || remoteIdTaken) {
        setLoading(false);
        addToast(
          'error',
          t.toastIdTakenMsg.replace('{id}', cleanId).replace('{owner}', remoteOwnerName || (language === 'bn' ? 'বিদ্যমান অ্যাকাউন্ট' : 'Existing Account')),
          t.toastIdTakenTitle
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
          setRemoteOwnerName(dbMatches[0].name || dbMatches[0].email || (language === 'bn' ? 'ডাটাবেজে রয়েছে' : 'in Database'));
          addToast(
            'error',
            t.toastIdTakenMsg.replace('{id}', cleanId).replace('{owner}', dbMatches[0].name || dbMatches[0].email),
            t.toastIdTakenTitle
          );
          return;
        }
      } catch (err) {
        console.warn('DB uniqueness check error:', err);
      }

      const finalDept = role === 'conductor' ? 'Transport & Fleet Division' : department;
      const { error } = await signUp(email, password, name, role, finalDept, idNo);
      if (error) {
        addToast('error', error.message || (language === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি।' : 'Registration failed.'), t.toastSignUpFailed);
      } else {
        addToast('success', t.toastAccountCreatedMsg, t.toastAccountCreated);
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
      {/* Unified Non-Overlapping Top Bar for Language & Theme (Single Line on all iOS & Android screens) */}
      <div className="login-top-bar">
        <div className="login-top-bar-left">
          <div className="lang-segmented-control login-lang-control" role="group" aria-label="Language Selector">
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
        </div>

        <div className="login-top-bar-right">
          <div className="theme-segmented-control login-theme-control" role="group" aria-label="Campus 360 Theme Selector">
            <button 
              type="button"
              className={`theme-segmented-btn ${theme === 'dark' ? 'active-dark' : ''}`}
              onClick={() => setTheme('dark')}
              aria-label={t.dashThemeNight}
              title={language === 'bn' ? 'নাইট মোড' : 'Night Mode (Dark Slate)'}
            >
              <Moon size={14} color={theme === 'dark' ? '#38bdf8' : 'currentColor'} />
              <span className="theme-btn-text">{t.dashThemeNight}</span>
            </button>

            <button 
              type="button"
              className={`theme-segmented-btn ${theme === 'light' ? 'active-light' : ''}`}
              onClick={() => setTheme('light')}
              aria-label={t.dashThemeLight}
              title={language === 'bn' ? 'লাইট মোড' : 'Light Mode (Clean Daylight)'}
            >
              <Sun size={14} color={theme === 'light' ? '#d97706' : 'currentColor'} />
              <span className="theme-btn-text">{t.dashThemeLight}</span>
            </button>

            <button 
              type="button"
              className={`theme-segmented-btn ${theme === 'pink' ? 'active-pink' : ''}`}
              onClick={() => setTheme('pink')}
              aria-label={t.dashThemePink}
              title={language === 'bn' ? 'গোলাপী মোড' : 'Pink Mode (Sakura Rose Glow)'}
            >
              <Sparkles size={14} color={theme === 'pink' ? '#ffffff' : '#ec4899'} />
              <span className="theme-btn-text">{t.dashThemePink}</span>
            </button>
          </div>
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
            {t.brandSubtitle}
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
            ref={tabSignInRef}
            onClick={() => setMode('login')}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') {
                setMode('register');
                setTimeout(() => tabRegisterRef.current?.focus(), 10);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const first = formRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled])');
                first?.focus();
              }
            }}
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
            {t.tabSignIn}
          </button>
          <button
            type="button"
            ref={tabRegisterRef}
            onClick={() => setMode('register')}
            onKeyDown={e => {
              if (e.key === 'ArrowLeft') {
                setMode('login');
                setTimeout(() => tabSignInRef.current?.focus(), 10);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const first = formRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled])');
                first?.focus();
              }
            }}
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
            {t.tabCreateAccount}
          </button>
        </div>

        {/* Form with Full Keyboard Arrow Navigation */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          onKeyDown={handleFormKeyDown}
          className="login-form" 
          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
        >
          {mode === 'register' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.labelFullName}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={role === 'conductor' ? t.placeholderNameConductor : t.placeholderNameStudent}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <UserCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.labelRole}
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
                  <option value="student">{t.roleStudent}</option>
                  <option value="teacher">{t.roleTeacher}</option>
                  <option value="admin">{t.roleAdmin}</option>
                  <option value="conductor">{t.roleConductor}</option>
                </select>
              </div>

              {/* Department is only for Academic Roles (Student, Teacher, Admin), NOT for Bus Conductor */}
              {role !== 'conductor' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.labelDepartment}
                  </label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Computer Science & Engineering">{t.deptCSE}</option>
                    <option value="Electrical & Electronic Engineering">{t.deptEEE}</option>
                    <option value="Textile Engineering">{t.deptTE}</option>
                    <option value="Green Business School">{t.deptBBA}</option>
                    <option value="Department of English">{t.deptEnglish}</option>
                    <option value="Department of Law">{t.deptLaw}</option>
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    <Fingerprint size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
                    {role === 'conductor' ? t.labelConductorId : t.labelUniversityId}
                  </label>
                  {role === 'student' && (
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      color: idNo.length === 9 ? '#10b981' : idNo.length > 0 ? '#f59e0b' : 'var(--text-muted)' 
                    }}>
                      {t.digitsCounter.replace('{count}', String(idNo.length))}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder={
                    role === 'conductor' 
                      ? t.placeholderIdConductor
                      : role === 'student' 
                      ? t.placeholderIdStudent
                      : t.placeholderIdTeacher
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
                        <span>{t.idAlreadyTakenAlert.replace('{id}', idNo)}</span>
                      </div>
                    ) : checkingId ? (
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{t.idChecking}</span>
                      </div>
                    ) : idNo.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.idRuleNote}
                      </div>
                    ) : idNo.length < 9 ? (
                      <div style={{ fontSize: '0.76rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <AlertCircle size={13} color="#f59e0b" />
                        <span>
                          {t.idRemainingNote
                            .replace('{current}', String(idNo.length))
                            .replace('{needed}', String(9 - idNo.length))
                            .replace('{email}', `${idNo}@student.green.ac.bd`)}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>
                          {t.idValidAvailable
                            .replace('{id}', idNo)
                            .replace('{email}', `${idNo}@student.green.ac.bd`)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Email Field with explicit USER requirement: Your Microsoft Account Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
                {mode === 'register' ? t.labelEmailRegister : t.labelEmailLogin}
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
                  title={language === 'bn' ? '১-ক্লিকে অফিসিয়াল ইমেইল বসান' : 'Click to auto-fill official Microsoft Teams email'}
                >
                  {isStudentEmailMatched ? (
                    <>
                      <CheckCircle2 size={12} color="#10b981" />
                      <span>{t.msAutoFillMatched.replace('{email}', `${idNo}@student.green.ac.bd`)}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.msAutoFillChip.replace('{email}', idNo ? `${idNo}@student.green.ac.bd` : '[ID]@student.green.ac.bd')}</span>
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
                  ? (idNo ? `${idNo}@student.green.ac.bd` : t.placeholderEmailRegister)
                  : t.placeholderEmailLogin
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

            {/* Student Microsoft Email Exact Match & Guidance Banner */}
            {mode === 'register' && role === 'student' && (
              <div style={{ marginTop: '0.35rem' }}>
                {idNo.length < 9 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t.msTeamsNote}
                  </div>
                ) : isStudentEmailMatched ? (
                  <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span>
                      {language === 'bn' 
                        ? `যথাযথ মিল রয়েছে: ${email} (আইডি: ${idNo})` 
                        : `Exact match: ${email} (Matched with ID: ${idNo})`}
                    </span>
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
                      <span>{language === 'bn' ? 'আইডি ও মাইক্রোসফট ইমেইল মিল থাকা আবশ্যক' : 'ID & Microsoft Email Match Required'}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {t.msEmailMismatchAlert
                        .replace('{expected}', `${idNo}@student.green.ac.bd`)
                        .replace('{actual}', email)}
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
                      <span>{t.msAutoFillChip.replace('{email}', `${idNo}@student.green.ac.bd`)}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.labelPassword}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t.placeholderPassword}
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
                t.btnPleaseWait
              ) : mode === 'login' ? (
                <>{t.btnSignIn} <ArrowRight size={18} /></>
              ) : isCurrentIdDuplicate ? (
                <>{t.btnIdTakenDisabled}</>
              ) : (
                <>{t.btnCreateAccount} <CheckCircle2 size={18} /></>
              )}
            </button>
          </div>

          {mode === 'login' && (
            <div className="login-demo-box" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span className="login-demo-title" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
                {t.demoTitle}
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
                      addToast('error', error.message || t.toastSignInFailed, t.toastSignInFailed);
                    } else {
                      addToast('success', language === 'bn' ? 'আহমেদ সিজান (শিক্ষার্থী) হিসেবে সাইন ইন সম্পন্ন হয়েছে।' : 'Signed in as Ahmed Sizan (Student)', t.toastWelcome);
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  {t.demoStudent}
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
                      addToast('error', error.message || t.toastSignInFailed, t.toastSignInFailed);
                    } else {
                      addToast('success', language === 'bn' ? 'ড. মোহাম্মদ নাজমুল ইসলাম (অনুষদ) হিসেবে সাইন ইন সম্পন্ন হয়েছে।' : 'Signed in as Dr. Mohammad Nazmul Islam (Faculty)', t.toastWelcome);
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  {t.demoTeacher}
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
                      addToast('error', error.message || t.toastSignInFailed, t.toastSignInFailed);
                    } else {
                      addToast('success', language === 'bn' ? 'প্রশাসক হিসেবে সাইন ইন সম্পন্ন হয়েছে।' : 'Signed in as Administrator', t.toastWelcome);
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  {t.demoAdmin}
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
                      addToast('error', error.message || t.toastSignInFailed, t.toastSignInFailed);
                    } else {
                      addToast('success', language === 'bn' ? 'বাস কন্ডাকটর হিসেবে সাইন ইন সম্পন্ন হয়েছে।' : 'Signed in as Bus Conductor', t.toastWelcome);
                    }
                  }}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', border: '1.5px solid #f59e0b', color: '#f59e0b', fontWeight: 700 }}
                >
                  🚌 {t.demoConductor}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
