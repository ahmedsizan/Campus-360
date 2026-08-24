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
  Bus, 
  Utensils, 
  Search, 
  AlertCircle, 
  LayoutDashboard,
  ShieldCheck
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
    setIsProfileModalOpen 
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  const getRoleBadge = () => {
    if (profile?.role === 'admin') {
      return <span className="badge badge-purple"><ShieldCheck size={12} /> Admin</span>;
    }
    if (profile?.role === 'teacher') {
      return <span className="badge badge-cyan">Faculty</span>;
    }
    return <span className="badge badge-emerald">Student</span>;
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                Campus<span style={{ color: 'var(--gub-green)' }}>360</span>
              </span>
              {getRoleBadge()}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              Green University of Bangladesh
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.35rem' }} className="desktop-nav">
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
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
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

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} color="#6366f1" />}
          </button>

          {/* Cart Trigger */}
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative' }}
            aria-label="Open cafeteria tray"
            title="Cafeteria Tray"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--gub-green)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                width: '20px',
                height: '20px',
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

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0.65rem 0.35rem 0.35rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <img 
                src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                alt={profile?.name || 'User'} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile?.name ? profile.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Dropdown Menu */}
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
                  width: '240px',
                  background: 'var(--modal-bg)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.75rem',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  zIndex: 920,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{profile?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{profile?.email}</div>
                  </div>

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
                    <Settings size={16} /> Edit Info & Avatar
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsUserDropdownOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%' }}
                    className="btn-secondary"
                  >
                    <Settings size={16} /> App Preferences
                  </button>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
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

          {/* Mobile Hamburger */}
          <button 
            className="btn btn-secondary btn-icon mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          background: 'var(--bg-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: isActive ? '#fff' : 'var(--text-primary)',
                  background: isActive ? 'var(--gub-green)' : 'var(--bg-card)',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
