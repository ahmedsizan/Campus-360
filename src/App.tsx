import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { ProfileModal } from './components/ProfileModal';
import { ToastContainer } from './components/ToastContainer';
import { InstallAppModal } from './components/InstallAppModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/Dashboards/StudentDashboard';
import { TeacherDashboard } from './pages/Dashboards/TeacherDashboard';
import { AdminDashboard } from './pages/Dashboards/AdminDashboard';
import { Notices } from './pages/Notices';
import { Cafeteria } from './pages/Cafeteria';
import { Transport } from './pages/Transport';
import { LostFound } from './pages/LostFound';
import { Complaints } from './pages/Complaints';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { GraduationCap, Heart, Shield } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { activeTab } = useApp();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          marginBottom: '1.5rem',
          animation: 'pulseGlow 1.5s infinite ease-in-out'
        }}>
          <GraduationCap size={36} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campus<span style={{ color: 'var(--gub-green)' }}>360</span></h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Connecting to Green University Cloud...
        </p>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (profile.role === 'admin') return <AdminDashboard />;
        if (profile.role === 'teacher') return <TeacherDashboard />;
        return <StudentDashboard />;
      case 'notices':
        return <Notices />;
      case 'cafeteria':
        return <Cafeteria />;
      case 'transport':
        return <Transport />;
      case 'lostfound':
        return <LostFound />;
      case 'complaints':
        return <Complaints />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {renderActiveTabContent()}
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <ProfileModal />
      <ToastContainer />
      <InstallAppModal />
      <InstallAppBanner />

      {/* Modern Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-subtle)',
        padding: '2rem 1.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--gub-green)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={15} />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Green University of Bangladesh
            </span>
            <span>• Purbachal American City Permanent Campus</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Campus 360 Solution v1.0</span>
            <span>•</span>
            <span style={{ color: 'var(--gub-green)', fontWeight: 600 }}>Supabase Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
