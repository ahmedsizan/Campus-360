import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  LogIn,
  Bus, 
  Utensils, 
  Search, 
  AlertCircle, 
  LayoutDashboard,
  ShieldCheck,
  Download,
  MoreVertical,
  Palette,
  Sparkles,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { translations } from '../translations';

export const Navbar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { 
    theme, 
    setTheme,
    toggleTheme, 
    language,
    setLanguage,
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartOpen, 
    setIsProfileModalOpen,
    triggerInstallApp
  } = useApp();

  const t = translations[language];
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: <LayoutDashboard size={18} /> },
    { id: 'notices', label: t.navNotices, icon: <Bell size={18} /> },
    { id: 'cafeteria', label: t.navCafeteria, icon: <Utensils size={18} /> },
    { id: 'transport', label: t.navTransport, icon: <Bus size={18} /> },
    { id: 'lostfound', label: t.navLostFound, icon: <Search size={18} /> },
    { id: 'complaints', label: t.navComplaints, icon: <AlertCircle size={18} /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsUserDropdownOpen(false);
  };

  const getRoleBadge = () => {
    if (profile?.role === 'admin') {
      return <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}><ShieldCheck size={10} /> {t.roleAdminShort}</span>;
    }
    if (profile?.role === 'teacher') {
      return <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>{t.roleTeacherShort}</span>;
    }
    if (profile?.role === 'conductor') {
      return <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}><Bus size={10} /> {t.roleConductorShort}</span>;
    }
    return <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>{t.roleStudentShort}</span>;
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--transition-normal)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        width: '100%',
        overflowX: 'clip'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0.55rem 0.85rem',
          paddingLeft: 'max(0.85rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.85rem, env(safe-area-inset-right, 0px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          width: '100%'
        }}>
          {/* Brand - Compact Single Line */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer', 
              flexShrink: 0,
              minWidth: 0
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.4)',
              flexShrink: 0
            }}>
              <GraduationCap size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Campus<span style={{ color: 'var(--gub-green)' }}>360</span>
              </span>
              {getRoleBadge()}
            </div>
          </div>

          {/* Desktop Navigation Links (Hidden on Mobile/Tablet) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--gub-green)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Controls - Ultra Compact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            {/* Desktop Only: Dedicated Install & Theme Buttons */}
            <button 
              className="btn btn-outline btn-sm desktop-only-control" 
              onClick={triggerInstallApp}
              aria-label="Install Campus 360 App"
              style={{
                borderColor: 'var(--gub-green)',
                color: 'var(--gub-green)',
                background: 'rgba(16, 185, 129, 0.08)',
                gap: '0.35rem',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'none'
              }}
            >
              <Download size={14} color="var(--gub-green)" />
              <span>Install App</span>
            </button>

            {/* Language Switcher (বাংলা | English) */}
            <div className="lang-segmented-control navbar-lang-control" role="group" aria-label="Language Selector">
              <button
                type="button"
                className={`lang-segmented-btn navbar-lang-btn ${language === 'bn' ? 'active' : ''}`}
                onClick={() => setLanguage('bn')}
                title="বাংলা"
                aria-label="বাংলা ভাষা"
              >
                <Globe size={13} />
                <span>বাংলা</span>
              </button>
              <button
                type="button"
                className={`lang-segmented-btn navbar-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                title="English"
                aria-label="English Language"
              >
                <span>English</span>
              </button>
            </div>

            {/* Theme Selector (Night / Light / Pink) */}
            <div className="theme-segmented-control navbar-theme-control" role="group" aria-label="Appearance Theme Selector">
              <button
                type="button"
                className={`theme-segmented-btn navbar-theme-btn ${theme === 'dark' ? 'active-dark' : ''}`}
                onClick={() => setTheme('dark')}
                title={language === 'bn' ? 'নাইট মোড' : 'Night Mode (Dark Slate)'}
                aria-label="Night Mode"
              >
                <Moon size={13} color={theme === 'dark' ? '#38bdf8' : 'currentColor'} />
                <span className="navbar-theme-label">{t.dashThemeNight}</span>
              </button>

              <button
                type="button"
                className={`theme-segmented-btn navbar-theme-btn ${theme === 'light' ? 'active-light' : ''}`}
                onClick={() => setTheme('light')}
                title={language === 'bn' ? 'লাইট মোড' : 'Light Mode (Clean Daylight)'}
                aria-label="Light Mode"
              >
                <Sun size={13} color={theme === 'light' ? '#d97706' : 'currentColor'} />
                <span className="navbar-theme-label">{t.dashThemeLight}</span>
              </button>

              <button
                type="button"
                className={`theme-segmented-btn navbar-theme-btn ${theme === 'pink' ? 'active-pink' : ''}`}
                onClick={() => setTheme('pink')}
                title={language === 'bn' ? 'গোলাপী মোড' : 'Pink Mode (Sakura Rose Glow)'}
                aria-label="Pink Mode"
              >
                <Sparkles size={13} color={theme === 'pink' ? '#ffffff' : '#ec4899'} />
                <span className="navbar-theme-label">{t.dashThemePink}</span>
              </button>
            </div>

            {/* Cart Trigger */}
            <button 
              className="btn btn-secondary btn-icon" 
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}
              aria-label="Open cafeteria tray"
              title="Cafeteria Tray"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--gub-green)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dedicated Log In / Switch Account Button for Tablet & Mobile Header */}
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => signOut()}
              title="Log In or Switch Account"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0
              }}
            >
              <LogIn size={14} />
              <span>Log In</span>
            </button>

            {/* User Profile & More Menu (Three-Dot & Avatar) */}
            <div style={{ position: 'relative', flexShrink: 0, width: '38px', height: '38px' }}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{
                  width: '38px',
                  height: '38px',
                  minWidth: '38px',
                  minHeight: '38px',
                  aspectRatio: '1 / 1',
                  padding: 0,
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                aria-label="User account and settings menu"
                title={profile?.name || 'Account menu'}
              >
                <img 
                  src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                  alt={profile?.name || 'User'} 
                  className="avatar-circle"
                  style={{ 
                    width: '34px', 
                    height: '34px', 
                    minWidth: '34px', 
                    minHeight: '34px', 
                    aspectRatio: '1 / 1', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    flexShrink: 0,
                    display: 'block'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--gub-green)',
                  border: '2px solid var(--nav-bg)',
                  flexShrink: 0
                }} />
              </button>

              {/* Comprehensive Dropdown Menu */}
              {isUserDropdownOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 910 }} 
                    onClick={() => setIsUserDropdownOpen(false)} 
                  />
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '250px',
                    maxWidth: 'calc(100vw - 1.5rem)',
                    background: 'var(--modal-bg)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.75rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
                    zIndex: 920,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {/* User info */}
                    <div style={{ padding: '0.45rem 0.65rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profile?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profile?.email}
                      </div>
                    </div>

                    {/* Language Selector Inside Dropdown */}
                    <div style={{ padding: '0.5rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{language === 'bn' ? 'বাংলা' : 'English'}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => { setLanguage('bn'); setIsUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '0.4rem 0.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: language === 'bn' ? '1.5px solid var(--gub-green)' : '1px solid var(--border-subtle)',
                            background: language === 'bn' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            color: language === 'bn' ? 'var(--gub-green)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.76rem',
                            fontWeight: 700
                          }}
                        >
                          <Globe size={13} />
                          <span>বাংলা</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLanguage('en'); setIsUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '0.4rem 0.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: language === 'en' ? '1.5px solid var(--gub-green)' : '1px solid var(--border-subtle)',
                            background: language === 'en' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            color: language === 'en' ? 'var(--gub-green)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.76rem',
                            fontWeight: 700
                          }}
                        >
                          <span>English</span>
                        </button>
                      </div>
                    </div>

                    {/* Theme Mode Selector Inside Dropdown */}
                    <div style={{ padding: '0.5rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{language === 'bn' ? 'থিম বা রং' : 'Appearance Theme'}</span>
                        <span className="badge badge-slate" style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}>{theme}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => { setTheme('dark'); setIsUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '0.4rem 0.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: theme === 'dark' ? '1.5px solid #38bdf8' : '1px solid var(--border-subtle)',
                            background: theme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                            color: theme === 'dark' ? '#38bdf8' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                          title="Night Mode"
                        >
                          <Moon size={14} color={theme === 'dark' ? '#38bdf8' : 'currentColor'} />
                          <span>{t.dashThemeNight}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTheme('light'); setIsUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '0.4rem 0.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: theme === 'light' ? '1.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                            background: theme === 'light' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                            color: theme === 'light' ? '#d97706' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                          title="Light Mode"
                        >
                          <Sun size={14} color={theme === 'light' ? '#d97706' : 'currentColor'} />
                          <span>{t.dashThemeLight}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTheme('pink'); setIsUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '0.4rem 0.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: theme === 'pink' ? '1.5px solid #ec4899' : '1px solid var(--border-subtle)',
                            background: theme === 'pink' ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                            color: theme === 'pink' ? '#ec4899' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                          title="Pink Mode"
                        >
                          <Sparkles size={14} color={theme === 'pink' ? '#ec4899' : 'currentColor'} />
                          <span>{t.dashThemePink}</span>
                        </button>
                      </div>
                    </div>

                    {/* Install App Trigger */}
                    <button
                      onClick={() => {
                        triggerInstallApp();
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-green-light)', fontWeight: 600, textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Download size={16} color="var(--gub-green)" /> {t.navInstallApp}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <User size={16} /> {t.navMyProfile}
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Settings size={16} /> {language === 'bn' ? 'তথ্য ও ছবি পরিবর্তন' : 'Edit Info & Photo'}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Palette size={16} /> {t.navSettings}
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-green-light)', textAlign: 'left', width: '100%', fontWeight: 700 }}
                      >
                        <LogIn size={16} color="var(--gub-green)" /> {language === 'bn' ? 'লগ ইন / অ্যাকাউন্ট পরিবর্তন' : 'Log In / Switch Account'}
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-rose)', textAlign: 'left', width: '100%', fontWeight: 600 }}
                      >
                        <LogOut size={16} /> {t.navSignOut}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 600px) {
            .desktop-nav {
              display: flex !important;
            }
            .desktop-only-control {
              display: inline-flex !important;
            }
          }
        `}</style>
      </nav>

      {/* Mobile Bottom Navigation Bar (Phones only) */}
      <div className="mobile-bottom-nav">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`mobile-bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={19} />
          <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => handleNavClick('notices')}
          className={`mobile-bottom-nav-item ${activeTab === 'notices' ? 'active' : ''}`}
        >
          <Bell size={19} />
          <span>{t.navNotices}</span>
        </button>

        <button
          onClick={() => handleNavClick('cafeteria')}
          className={`mobile-bottom-nav-item ${activeTab === 'cafeteria' ? 'active' : ''}`}
        >
          <Utensils size={19} />
          <span>{language === 'bn' ? 'খাবার' : 'Food'}</span>
        </button>

        <button
          onClick={() => handleNavClick('transport')}
          className={`mobile-bottom-nav-item ${activeTab === 'transport' ? 'active' : ''}`}
        >
          <Bus size={19} />
          <span>{language === 'bn' ? 'বাস' : 'Bus'}</span>
        </button>

        <button
          onClick={() => handleNavClick('complaints')}
          className={`mobile-bottom-nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
        >
          <AlertCircle size={19} />
          <span>{language === 'bn' ? 'মতামত' : 'Feedback'}</span>
        </button>
      </div>
    </>
  );
};
