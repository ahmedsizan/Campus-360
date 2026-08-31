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
            Real-time GPS telemetry, stop-by-stop schedules, and 45-seat bus seat booking for Lines 1, 2, 3 & 4
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
          <Compass size={15} style={{ marginRight: '6px' }} /> Transit Routes & Fleet ({buses.length})
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_1_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_1_schedule')}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Green Line 1 (Mirpur)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_2_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_2_schedule')}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Green Line 2 (Uttara)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_3_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_3_schedule')}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Green Line 3 (Bishnandi)
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'green_line_4_schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('green_line_4_schedule')}
        >
          <Sparkles size={15} style={{ marginRight: '6px' }} /> Green Line 4 (Savar)
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
            {/* Green Line 1 Card */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-emerald">2 Buses</span>
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
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Armchair size={14} /> Book Mirpur Seat
              </button>
            </div>

            {/* Green Line 2 Card */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-emerald">3 Buses</span>
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
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Armchair size={14} /> Book Uttara Seat
              </button>
            </div>

            {/* Green Line 3 Card */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-cyan">3 Buses</span>
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

            {/* Green Line 4 Card */}
            <div className="glass-card" style={{
              padding: '1.35rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-amber">2 Buses</span>
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
              const isGreenLine1 = bus.id === 'bus-1' || bus.name.toLowerCase().includes('green line 1') || bus.route.toLowerCase().includes('mirpur');
              const isGreenLine2 = bus.id === 'bus-2' || bus.name.toLowerCase().includes('green line 2') || bus.route.toLowerCase().includes('uttara');
              const isGreenLine3 = bus.id === 'bus-3' || bus.name.toLowerCase().includes('green line 3') || bus.route.toLowerCase().includes('bishnandi');
              const isGreenLine4 = bus.id === 'bus-4' || bus.name.toLowerCase().includes('green line 4') || bus.route.toLowerCase().includes('savar');

              return (
                <div
                  key={bus.id}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${isGreenLine1 ? '#10b981' : isGreenLine2 ? '#10b981' : isGreenLine3 ? '#06b6d4' : isGreenLine4 ? '#f59e0b' : '#64748b'}`,
                    boxShadow: (isGreenLine1 || isGreenLine2 || isGreenLine3 || isGreenLine4) ? '0 8px 32px rgba(16, 185, 129, 0.1)' : undefined
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                          {(isGreenLine1 || isGreenLine4) ? '2 Dedicated Buses • 45 Seats' : (isGreenLine2 || isGreenLine3) ? '3 Dedicated Buses • 45 Seats' : 'GUB Transit Fleet'}
                        </span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.1rem' }}>{bus.name}</h3>
                      </div>
                      {getStatusBadge(bus.status)}
                    </div>

                    {/* Route Flow */}
                    <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                        ROUTE PATH
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {bus.route}
                      </div>
                    </div>

                    {/* Live Telemetry Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <MapPin size={12} color="#10b981" /> CURRENT LOCATION
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {bus.current_location}
                        </div>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <Clock size={12} color="#06b6d4" /> ESTIMATED ARRIVAL
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: bus.status === 'active' ? 'var(--gub-green)' : 'inherit' }}>
                          {bus.eta}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Chips */}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {(isGreenLine1 || isGreenLine2 || isGreenLine3 || isGreenLine4) ? 'BUS SHIFTS & DEPARTURES' : 'DEPARTURE TIMINGS'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {bus.schedule.map((time, idx) => (
                          <span key={idx} className={`badge ${(isGreenLine1 || isGreenLine2 || isGreenLine3 || isGreenLine4) ? 'badge-emerald' : 'badge-slate'}`} style={{ fontSize: '0.75rem' }}>
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA on Line 1, Line 2, Line 3 or Line 4 */}
                  {isGreenLine1 ? (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setIsGL1ModalOpen(true)}
                      >
                        <Armchair size={16} /> Select Bus (Bus 1 or 2) & Book Seat
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setActiveTab('green_line_1_schedule')}
                      >
                        View Full Stop-by-Stop Timetable <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : isGreenLine2 ? (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setIsGL2ModalOpen(true)}
                      >
                        <Armchair size={16} /> Select Bus (Bus 1, 2, or 3) & Book Seat
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setActiveTab('green_line_2_schedule')}
                      >
                        View Full Stop-by-Stop Timetable <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : isGreenLine3 ? (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
                        onClick={() => setIsGL3ModalOpen(true)}
                      >
                        <Armchair size={16} /> Select Bus (Bus 1, 2, or 3) & Book Seat
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setActiveTab('green_line_3_schedule')}
                      >
                        View Full Stop-by-Stop Timetable <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : isGreenLine4 ? (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
                        onClick={() => setIsGL4ModalOpen(true)}
                      >
                        <Armchair size={16} /> Select Bus (Bus 1 or 2) & Book Seat
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setActiveTab('green_line_4_schedule')}
                      >
                        View Full Stop-by-Stop Timetable <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Green University Transit Fleet
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gub-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        GPS Tracking <Compass size={14} />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GREEN LINE 1 SCHEDULE BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_1_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                Line 1 Complete Breakdown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Green Line 1 (Mirpur Route)</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '0.25rem' }}>
                Mirpur ➔ Kuril Flyover ➔ Green University Campus & Return
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsGL1ModalOpen(true)}
            >
              <Armchair size={17} /> Open 2-Bus Seat Booking
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--gub-green)" /> Inbound: Mirpur ➔ Campus (2 Buses)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              2 dedicated buses departing Mirpur in 2 shifts:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {GL1_INBOUND_TRIPS.map((trip, idx) => (
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
      {/* TAB 3: GREEN LINE 2 SCHEDULE BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_2_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
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
      {/* TAB 4: GREEN LINE 3 SCHEDULE BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_3_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
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
              3 dedicated buses departing Bishnandi Ferry Ghat in 3 morning/midday shifts:
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
      {/* TAB 5: GREEN LINE 4 SCHEDULE BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'green_line_4_schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-card" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
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
                Savar ➔ Kuril Flyover ➔ Green University Campus & Return
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
              2 dedicated buses departing Savar in 2 shifts:
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
              {myPasses.map(pass => (
                <div 
                  key={pass.id} 
                  className="glass-card" 
                  style={{
                    padding: '1.5rem',
                    borderLeft: `4px solid ${pass.bus_name.includes('Line 3') ? 'var(--gub-cyan)' : pass.bus_name.includes('Line 4') ? 'var(--gub-gold)' : 'var(--gub-green)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className={`badge ${pass.bus_name.includes('Line 3') ? 'badge-cyan' : pass.bus_name.includes('Line 4') ? 'badge-amber' : 'badge-emerald'}`}>
                        ✓ Active Pass
                      </span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: pass.bus_name.includes('Line 3') ? 'var(--gub-cyan)' : pass.bus_name.includes('Line 4') ? 'var(--gub-gold)' : 'var(--gub-green-light)' }}>
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
                        {pass.stoppage} @ <span style={{ color: pass.bus_name.includes('Line 3') ? 'var(--gub-cyan)' : pass.bus_name.includes('Line 4') ? 'var(--gub-gold)' : 'var(--gub-green-light)' }}>{pass.stoppage_time}</span>
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
                      style={{ flex: 1, justifyContent: 'center' }}
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GREEN LINE 1 MODAL */}
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
      {/* GREEN LINE 2 MODAL */}
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
      {/* GREEN LINE 3 MODAL */}
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
      {/* GREEN LINE 4 MODAL */}
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
