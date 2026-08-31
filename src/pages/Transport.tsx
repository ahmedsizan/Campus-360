import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bus, BusDirection, BusSeatBooking, BusStatus } from '../types';
import { BoardingPassModal } from '../components/BoardingPassModal';
import { GreenLine1Modal, GL1_INBOUND_TRIPS, GL1_OUTBOUND_TRIPS } from '../components/GreenLine1Modal';
import { GreenLine2Modal, GL2_INBOUND_TRIPS, GL2_OUTBOUND_TRIPS } from '../components/GreenLine2Modal';
import { GreenLine3Modal, GL3_INBOUND_TRIPS, GL3_OUTBOUND_TRIPS } from '../components/GreenLine3Modal';
import { GreenLine4Modal, GL4_INBOUND_TRIPS, GL4_OUTBOUND_TRIPS } from '../components/GreenLine4Modal';
import { 
  Bus as BusIcon, 
  MapPin, 
  Clock, 
  Search, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Calendar,
  Compass,
  ArrowRight,
  Armchair,
  Ticket,
  QrCode,
  Sparkles,
  ShieldCheck,
  Layers,
  Send,
  Info,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

type TransportTab = 'fleet' | 'green_line_1_schedule' | 'green_line_2_schedule' | 'green_line_3_schedule' | 'green_line_4_schedule' | 'my_passes';

export const Transport: React.FC = () => {
  const { profile } = useAuth();
  const { 
    buses, 
    loadingBuses, 
    seatBookings, 
    bookSeat, 
    cancelSeatBooking 
  } = useApp();

  const [activeTab, setActiveTab] = useState<TransportTab>('fleet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | BusStatus>('all');

  // Modals for all 4 Green Lines
  const [isGL1ModalOpen, setIsGL1ModalOpen] = useState(false);
  const [isGL2ModalOpen, setIsGL2ModalOpen] = useState(false);
  const [isGL3ModalOpen, setIsGL3ModalOpen] = useState(false);
  const [isGL4ModalOpen, setIsGL4ModalOpen] = useState(false);

  // Digital Boarding Pass Modal
  const [activeBoardingPass, setActiveBoardingPass] = useState<BusSeatBooking | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Filter Bookings for Current User
  const myPasses = seatBookings.filter(
    b => profile?.email && b.user_email.toLowerCase() === profile.email.toLowerCase()
  );

  // Status Badge Helper
  const getStatusBadge = (status: BusStatus) => {
    if (status === 'active') {
      return (
        <span className="badge badge-emerald">
          <span className="live-pulse-dot" style={{ width: '7px', height: '7px' }} /> Live On Route
        </span>
      );
    }
    if (status === 'delayed') {
      return (
        <span className="badge badge-amber">
          <span className="delayed-pulse-dot" style={{ width: '7px', height: '7px' }} /> Delayed
        </span>
      );
    }
    return (
      <span className="badge badge-slate">
        <span className="inactive-dot" style={{ width: '7px', height: '7px' }} /> In Workshop / Stand
      </span>
    );
  };

  // Line Theme Color Helper
  const getLineTheme = (busId: string, busName: string) => {
    if (busId === 'bus-1' || busName.toLowerCase().includes('green line 1') || busName.toLowerCase().includes('mirpur')) {
      return {
        key: 'gl1',
        name: 'Green Line 1',
        color: '#3b82f6',
        lightColor: '#60a5fa',
        badgeClass: 'badge-blue',
        btnGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        bgCardGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.06) 100%)',
        borderAccent: '1px solid rgba(59, 130, 246, 0.3)',
        borderLeft: '4px solid #3b82f6',
        glow: '0 8px 32px rgba(59, 130, 246, 0.15)'
      };
    }
    if (busId === 'bus-2' || busName.toLowerCase().includes('green line 2') || busName.toLowerCase().includes('uttara')) {
      return {
        key: 'gl2',
        name: 'Green Line 2',
        color: '#10b981',
        lightColor: '#34d399',
        badgeClass: 'badge-emerald',
        btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        bgCardGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)',
        borderAccent: '1px solid rgba(16, 185, 129, 0.3)',
        borderLeft: '4px solid #10b981',
        glow: '0 8px 32px rgba(16, 185, 129, 0.15)'
      };
    }
    if (busId === 'bus-3' || busName.toLowerCase().includes('green line 3') || busName.toLowerCase().includes('bishnandi')) {
      return {
        key: 'gl3',
        name: 'Green Line 3',
        color: '#06b6d4',
        lightColor: '#22d3ee',
        badgeClass: 'badge-cyan',
        btnGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        bgCardGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(8, 145, 178, 0.06) 100%)',
        borderAccent: '1px solid rgba(6, 182, 212, 0.3)',
        borderLeft: '4px solid #06b6d4',
        glow: '0 8px 32px rgba(6, 182, 212, 0.15)'
      };
    }
    return {
      key: 'gl4',
      name: 'Green Line 4',
      color: '#f59e0b',
      lightColor: '#fbbf24',
      badgeClass: 'badge-amber',
      btnGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      bgCardGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 100%)',
      borderAccent: '1px solid rgba(245, 158, 11, 0.3)',
      borderLeft: '4px solid #f59e0b',
      glow: '0 8px 32px rgba(245, 158, 11, 0.15)'
    };
  };

  // Filter Buses for All Fleet
  const filteredBuses = buses.filter(bus => {
    const matchesStatus = selectedStatus === 'all' || bus.status === selectedStatus;
    const matchesSearch = 
      bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.current_location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="page-header page-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-emerald">Green University Transit Fleet</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Purbachal Permanent Campus</span>
          </div>
          <h1 className="page-title">University Transport & Shuttle Tracker</h1>
          <p className="page-subtitle">
            Real-time GPS telemetry, accurate stop-by-stop schedules, and 45-seat bus seat booking for Lines 1, 2, 3 & 4
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span className="live-pulse-dot" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gub-green-light)' }}>
            GPS Telemetry Active
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 0 }}>
        <button
          className={`filter-tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Compass size={15} style={{ marginRight: '6px' }} /> All 4 Transit Routes ({buses.length})
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_1_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_1_schedule')}
          style={{ borderColor: activeTab === 'green_line_1_schedule' ? '#3b82f6' : undefined, background: activeTab === 'green_line_1_schedule' ? '#2563eb' : undefined }}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Line 1 (Mirpur)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_2_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_2_schedule')}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Line 2 (Uttara)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_3_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_3_schedule')}
          style={{ borderColor: activeTab === 'green_line_3_schedule' ? '#06b6d4' : undefined, background: activeTab === 'green_line_3_schedule' ? '#0891b2' : undefined }}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Line 3 (Bishnandi)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_4_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_4_schedule')}
          style={{ borderColor: activeTab === 'green_line_4_schedule' ? '#f59e0b' : undefined, background: activeTab === 'green_line_4_schedule' ? '#d97706' : undefined }}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Line 4 (Savar)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'my_passes' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_passes')}
        >
          <Ticket size={15} style={{ marginRight: '6px' }} /> My Bus Passes ({myPasses.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRANSIT ROUTES & FLEET (4 MAIN LINES) */}
      {/* ========================================================================= */}
      {activeTab === 'fleet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Line Booking Cards Showcase */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem' }}>
            {/* Green Line 1 Card - Royal Blue */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(37, 99, 235, 0.06) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-blue">2 Buses • Line 1</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 Seats</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Green Line 1 (Mirpur)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                  Mirpur ➔ Kuril ➔ Campus (7:30 AM & 12:00 PM | Return 1:45 PM & 4:45 PM).
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsGL1ModalOpen(true)}
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
              >
                <Armchair size={14} /> Book Mirpur Seat
              </button>
            </div>

            {/* Green Line 2 Card - Emerald Green */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.06) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-emerald">3 Buses • Line 2</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 Seats</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Green Line 2 (Uttara)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                  Uttara House Building ➔ BNS ➔ Kuril ➔ Campus (7:30 AM, 9:30 AM, 12:00 PM).
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsGL2ModalOpen(true)}
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <Armchair size={14} /> Book Uttara Seat
              </button>
            </div>

            {/* Green Line 3 Card - Cyan/Teal */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.06) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-cyan">3 Buses • Line 3</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 Seats</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Green Line 3 (Bishnandi)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                  Bishnandi ➔ Araihazar ➔ Gawsia ➔ Campus (7:30 AM, 9:30 AM, 12:00 PM).
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsGL3ModalOpen(true)}
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
              >
                <Armchair size={14} /> Book Bishnandi Seat
              </button>
            </div>

            {/* Green Line 4 Card - Amber/Gold */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.06) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-amber">2 Buses • Line 4</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 Seats</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Green Line 4 (Savar)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                  Savar ➔ Kuril ➔ Campus (7:00 AM & 12:00 PM | Return 1:45 PM & 4:45 PM).
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsGL4ModalOpen(true)}
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
              >
                <Armchair size={14} /> Book Savar Seat
              </button>
            </div>
          </div>

          {/* Filter and Search Bar for Fleet */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`filter-tab-btn ${selectedStatus === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('all')}
              >
                All 4 Routes ({buses.length})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatus === 'active' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('active')}
              >
                🟢 Active ({buses.filter(b => b.status === 'active').length})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatus === 'delayed' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('delayed')}
              >
                🟠 Delayed ({buses.filter(b => b.status === 'delayed').length})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatus === 'inactive' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('inactive')}
              >
                ⚪ Workshop ({buses.filter(b => b.status === 'inactive').length})
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search route or stoppage..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Bus Fleet Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredBuses.map(bus => {
              const theme = getLineTheme(bus.id, bus.name);

              return (
                <div
                  key={bus.id}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: theme.borderLeft,
                    boxShadow: theme.glow
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                          {bus.id === 'bus-1' || bus.id === 'bus-4' ? '2 Dedicated Buses • 45 Seats' : '3 Dedicated Buses • 45 Seats'}
                        </span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.1rem', color: 'var(--text-primary)' }}>{bus.name}</h3>
                      </div>
                      {getStatusBadge(bus.status)}
                    </div>

                    {/* Route Flow */}
                    <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                        OFFICIAL ROUTE PATH
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {bus.route}
                      </div>
                    </div>

                    {/* Live Telemetry Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <MapPin size={12} color={theme.color} /> CURRENT LOCATION
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {bus.current_location}
                        </div>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <Clock size={12} color={theme.color} /> ESTIMATED ARRIVAL
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: theme.lightColor }}>
                          {bus.eta}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Chips */}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> BUS SHIFTS & DEPARTURES
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {bus.schedule.map((time, idx) => (
                          <span key={idx} className={`badge ${theme.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA on specific line */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', background: theme.btnGradient }}
                      onClick={() => {
                        if (theme.key === 'gl1') setIsGL1ModalOpen(true);
                        else if (theme.key === 'gl2') setIsGL2ModalOpen(true);
                        else if (theme.key === 'gl3') setIsGL3ModalOpen(true);
                        else setIsGL4ModalOpen(true);
                      }}
                    >
                      <Armchair size={16} /> Select Bus & Reserve 45-Seat Cabin
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        if (theme.key === 'gl1') setActiveTab('green_line_1_schedule');
                        else if (theme.key === 'gl2') setActiveTab('green_line_2_schedule');
                        else if (theme.key === 'gl3') setActiveTab('green_line_3_schedule');
                        else setActiveTab('green_line_4_schedule');
                      }}
                    >
                      View Stop-by-Stop Timings <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GREEN LINE 1 SCHEDULE BREAKDOWN (ROYAL BLUE THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_1_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(37, 99, 235, 0.06) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
                Line 1 Complete Breakdown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Green Line 1 (Mirpur Route)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                Mirpur (Terminal) ➔ Kuril Flyover ➔ Green University Campus & Return
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsGL1ModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
            >
              <Armchair size={17} /> Open 2-Bus Seat Booking
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="#3b82f6" /> Inbound: Mirpur ➔ Campus (2 Buses)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              2 dedicated buses departing Mirpur in 2 shifts (30 mins per leg, 60 mins total):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL1_INBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-blue">{trip.busNumber} • {trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#3b82f6', color: '#3b82f6', background: sIdx === 0 ? '#3b82f6' : undefined }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: '#60a5fa' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL1ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Seat on {trip.busNumber}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} color="var(--gub-purple)" /> Outbound: Campus ➔ Mirpur (Return)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Same stoppage intervals: 1:45 PM (Bus 01) and 4:45 PM (Bus 02)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL1_OUTBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-purple)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: '#a78bfa' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL1ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Return Seat ({trip.departureTime})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GREEN LINE 2 SCHEDULE BREAKDOWN (EMERALD GREEN THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_2_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.06) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                Line 2 Complete Breakdown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Green Line 2 (Uttara Route)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                Uttara House Building ➔ Uttara BNS Center ➔ Kuril Flyover ➔ Green University Campus & Return
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsGL2ModalOpen(true)}
            >
              <Armchair size={17} /> Open 3-Bus Seat Booking
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--gub-green)" /> Inbound: Uttara House Building ➔ Campus (3 Buses)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              3 dedicated buses departing in 3 morning/midday shifts:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL2_INBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-emerald">{trip.busNumber} • {trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-green-light)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gub-green-light)' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL2ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Seat on {trip.busNumber}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} color="var(--gub-purple)" /> Outbound: Campus ➔ Uttara House Building (Return)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Same stoppage intervals: 1:45 PM (1 Bus) and 4:45 PM (2 Buses simultaneously)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL2_OUTBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-purple)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: '#a78bfa' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL2ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Return Seat ({trip.departureTime})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GREEN LINE 3 SCHEDULE BREAKDOWN (CYAN / TEAL THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_3_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(8, 145, 178, 0.06) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>
                Line 3 Complete Breakdown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Green Line 3 (Bishnandi Route)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                Bishnandi Ferry Ghat ➔ Araihazar ➔ Gawsia ➔ Green University Campus & Return
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsGL3ModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
            >
              <Armchair size={17} /> Open 3-Bus Seat Booking
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--gub-cyan)" /> Inbound: Bishnandi Ferry Ghat ➔ Campus (3 Buses)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              3 dedicated buses departing Bishnandi Ferry Ghat in 3 morning/midday shifts (20 mins per leg, 60 mins total):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL3_INBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-cyan">{trip.busNumber} • {trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-cyan)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#06b6d4', color: '#06b6d4' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gub-cyan)' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL3ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Seat on {trip.busNumber}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} color="var(--gub-purple)" /> Outbound: Campus ➔ Bishnandi Ferry Ghat (Return)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Same stoppage intervals: 1:45 PM (1 Bus) and 4:45 PM (2 Buses simultaneously)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL3_OUTBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-purple)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: '#a78bfa' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL3ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Return Seat ({trip.departureTime})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GREEN LINE 4 SCHEDULE BREAKDOWN (AMBER / GOLD THEME) */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_4_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.06) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.35rem' }}>
                Line 4 Complete Breakdown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Green Line 4 (Savar Route)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                Savar (Terminal) ➔ Kuril Flyover ➔ Green University Campus & Return
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsGL4ModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
            >
              <Armchair size={17} /> Open 2-Bus Seat Booking
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--gub-gold)" /> Inbound: Savar ➔ Campus (2 Buses)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              2 dedicated buses departing Savar in 2 shifts (Savar ➔ Kuril: 60 mins, Kuril ➔ Campus: 30 mins. Total 90 mins):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL4_INBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-amber">{trip.busNumber} • {trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-gold)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gub-gold)' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL4ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Seat on {trip.busNumber}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} color="var(--gub-purple)" /> Outbound: Campus ➔ Savar (Return)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Same stoppage intervals: 1:45 PM (Bus 01) and 4:45 PM (Bus 02)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL4_OUTBOUND_TRIPS.map((trip, idx) => (
                <div key={trip.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{trip.shiftTitle}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gub-purple)' }}>45 Seats</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{trip.busName}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.desc}</p>

                  <div className="timeline-track-v">
                    {trip.stoppages.map((st, sIdx) => (
                      <div key={sIdx} className="timeline-step-v">
                        <div className={`timeline-dot-v ${sIdx === 0 ? 'active' : ''}`} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>{sIdx + 1}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</span>
                          <strong style={{ fontSize: '0.85rem', color: '#a78bfa' }}>{st.time}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsGL4ModalOpen(true)}
                  >
                    <Armchair size={14} /> Book Return Seat ({trip.departureTime})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MY BUS PASSES */}
      {/* ========================================================================= */}
      {activeTab === 'my_passes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>My Reserved Bus Passes</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Active digital passes and verified boarding tokens for Green University transport
              </p>
            </div>
          </div>

          {myPasses.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active Bus Passes</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You have not reserved any bus seats yet. Select any Green Line to book your seat!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsGL1ModalOpen(true)}
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
                >
                  <Armchair size={17} /> Book Line 1 (Mirpur)
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsGL2ModalOpen(true)}
                >
                  <Armchair size={17} /> Book Line 2 (Uttara)
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsGL3ModalOpen(true)}
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
                >
                  <Armchair size={17} /> Book Line 3 (Bishnandi)
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsGL4ModalOpen(true)}
                  style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
                >
                  <Armchair size={17} /> Book Line 4 (Savar)
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {myPasses.map(pass => {
                const passTheme = getLineTheme(pass.bus_id, pass.bus_name);

                return (
                  <div 
                    key={pass.id} 
                    className="glass-card" 
                    style={{
                      padding: '1.5rem',
                      borderLeft: passTheme.borderLeft,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span className={`badge ${passTheme.badgeClass}`}>
                          ✓ Active Pass
                        </span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: passTheme.lightColor }}>
                          Seat #{pass.seat_number}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pass.bus_name}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {pass.direction === 'to_campus' ? 'To Campus (Inbound)' : 'Return from Campus (Outbound)'}
                      </p>

                      <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', margin: '1rem 0' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STOPPAGE & DEPARTURE</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                          {pass.stoppage} @ <span style={{ color: passTheme.lightColor }}>{pass.stoppage_time}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Passenger: <strong>{pass.student_name}</strong></span>
                        <span>Date: <strong>{pass.booking_date}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', background: passTheme.btnGradient }}
                        onClick={() => {
                          setActiveBoardingPass(pass);
                          setIsPassModalOpen(true);
                        }}
                      >
                        <QrCode size={15} /> View E-Ticket Pass
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'var(--gub-rose)', color: 'var(--gub-rose)' }}
                        onClick={() => {
                          if (window.confirm('Cancel this bus seat reservation?')) {
                            cancelSeatBooking(pass.id);
                          }
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GREEN LINE 1 MODAL (ROYAL BLUE) */}
      {/* ========================================================================= */}
      <GreenLine1Modal
        isOpen={isGL1ModalOpen}
        onClose={() => setIsGL1ModalOpen(false)}
        seatBookings={seatBookings}
        onBookSeat={bookSeat}
        currentUserEmail={profile?.email}
        currentUserName={profile?.name}
        currentUserIdNo={profile?.id_no}
        onBookingSuccess={booking => {
          setActiveBoardingPass(booking);
          setIsPassModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* GREEN LINE 2 MODAL (EMERALD GREEN) */}
      {/* ========================================================================= */}
      <GreenLine2Modal
        isOpen={isGL2ModalOpen}
        onClose={() => setIsGL2ModalOpen(false)}
        seatBookings={seatBookings}
        onBookSeat={bookSeat}
        currentUserEmail={profile?.email}
        currentUserName={profile?.name}
        currentUserIdNo={profile?.id_no}
        onBookingSuccess={booking => {
          setActiveBoardingPass(booking);
          setIsPassModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* GREEN LINE 3 MODAL (CYAN / TEAL) */}
      {/* ========================================================================= */}
      <GreenLine3Modal
        isOpen={isGL3ModalOpen}
        onClose={() => setIsGL3ModalOpen(false)}
        seatBookings={seatBookings}
        onBookSeat={bookSeat}
        currentUserEmail={profile?.email}
        currentUserName={profile?.name}
        currentUserIdNo={profile?.id_no}
        onBookingSuccess={booking => {
          setActiveBoardingPass(booking);
          setIsPassModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* GREEN LINE 4 MODAL (AMBER / GOLD) */}
      {/* ========================================================================= */}
      <GreenLine4Modal
        isOpen={isGL4ModalOpen}
        onClose={() => setIsGL4ModalOpen(false)}
        seatBookings={seatBookings}
        onBookSeat={bookSeat}
        currentUserEmail={profile?.email}
        currentUserName={profile?.name}
        currentUserIdNo={profile?.id_no}
        onBookingSuccess={booking => {
          setActiveBoardingPass(booking);
          setIsPassModalOpen(true);
        }}
      />

      {/* Digital Boarding Pass Modal */}
      <BoardingPassModal
        booking={activeBoardingPass}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onCancelBooking={id => cancelSeatBooking(id)}
      />
    </div>
  );
};
