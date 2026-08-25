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
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const Navbar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { 
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartOpen, 
    setIsProfileModalOpen,
    triggerInstallApp
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
    { id: 'cafeteria', label: 'Cafeteria', icon: <Utensils size={18} /> },
    { id: 'transport', label: 'Transport', icon: <Bus size={18} /> },
    { id: 'lostfound', label: 'Lost & Found', icon: <Search size={18} /> },
    { id: 'complaints', label: 'Complaints', icon: <AlertCircle size={18} /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsUserDropdownOpen(false);
  };

  const getRoleBadge = () => {
    if (profile?.role === 'admin') {
      return <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}><ShieldCheck size={10} /> Admin</span>;
    }
    if (profile?.role === 'teacher') {
      return <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Faculty</span>;
    }
    return <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>Student</span>;
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

            <button 
              className="btn btn-secondary btn-icon desktop-only-control" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ width: '36px', height: '36px', display: 'none' }}
            >
              {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
            </button>

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

                    {/* Theme Mode Toggle Inside Dropdown (Frees Navbar Space!) */}
                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '0.88rem', 
                        color: 'var(--text-primary)', 
                        textAlign: 'left', 
                        width: '100%',
                        background: 'var(--bg-input)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {theme === 'dark' ? <Moon size={16} color="#fbbf24" /> : <Sun size={16} color="#6366f1" />}
                        <span>{theme === 'dark' ? 'Dark Theme (Night)' : 'Light Theme (Day)'}</span>
                      </div>
                      <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                        {theme === 'dark' ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Install App Trigger */}
                    <button
                      onClick={() => {
                        triggerInstallApp();
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-green-light)', fontWeight: 600, textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Download size={16} color="var(--gub-green)" /> Install Mobile App
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <User size={16} /> My Full Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Settings size={16} /> Edit Info & Photo
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsUserDropdownOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                      className="btn-secondary"
                    >
                      <Palette size={16} /> App Preferences
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-green-light)', textAlign: 'left', width: '100%', fontWeight: 700 }}
                      >
                        <LogIn size={16} color="var(--gub-green)" /> Log In / Switch Account
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--gub-rose)', textAlign: 'left', width: '100%', fontWeight: 600 }}
                      >
                        <LogOut size={16} /> Sign Out
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
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('notices')}
          className={`mobile-bottom-nav-item ${activeTab === 'notices' ? 'active' : ''}`}
        >
          <Bell size={19} />
          <span>Notices</span>
        </button>

        <button
          onClick={() => handleNavClick('cafeteria')}
          className={`mobile-bottom-nav-item ${activeTab === 'cafeteria' ? 'active' : ''}`}
        >
          <Utensils size={19} />
          <span>Food</span>
        </button>

        <button
          onClick={() => handleNavClick('transport')}
          className={`mobile-bottom-nav-item ${activeTab === 'transport' ? 'active' : ''}`}
        >
          <Bus size={19} />
          <span>Bus</span>
        </button>

        <button
          onClick={() => handleNavClick('complaints')}
          className={`mobile-bottom-nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
        >
          <AlertCircle size={19} />
          <span>Feedback</span>
        </button>
      </div>
    </>
  );
};
