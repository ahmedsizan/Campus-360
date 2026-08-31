import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BusDirection, BusSeatBooking } from '../../types';
import { BoardingPassModal } from '../../components/BoardingPassModal';
import { 
  Bus as BusIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  Search, 
  Filter, 
  Armchair, 
  CheckCheck, 
  QrCode, 
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Users,
  Ticket,
  KeyRound,
  Zap
} from 'lucide-react';

export const ConductorDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { 
    buses, 
    seatBookings, 
    updateSeatBookingStatus, 
    cancelSeatBooking,
    refetchSeatBookings,
    addToast
  } = useApp();

  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickTokenInput, setQuickTokenInput] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Selected Booking for Modal Preview
  const [previewBooking, setPreviewBooking] = useState<BusSeatBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active Cabin Manifest Viewer
  const [activeBusView, setActiveBusView] = useState<string>('bus-2');
  const [activeDirectionView, setActiveDirectionView] = useState<BusDirection>('to_campus');
  const [activeSlotView, setActiveSlotView] = useState<string>('07:30 AM');

  // Filter Bookings
  const filteredBookings = seatBookings.filter(b => {
    const matchesLine = selectedLineFilter === 'all' || b.bus_id === selectedLineFilter;
    const bookingStatus = b.status || 'pending';
    const matchesStatus = selectedStatusFilter === 'all' || bookingStatus === selectedStatusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      b.student_name.toLowerCase().includes(query) ||
      b.student_id.toLowerCase().includes(query) ||
      (b.token_id && b.token_id.toLowerCase().includes(query)) ||
      b.stoppage.toLowerCase().includes(query) ||
      b.bus_name.toLowerCase().includes(query) ||
      String(b.seat_number).includes(query);

    return matchesLine && matchesStatus && matchesSearch;
  });

  const pendingCount = seatBookings.filter(b => (!b.status || b.status === 'pending')).length;
  const confirmedCount = seatBookings.filter(b => b.status === 'confirmed').length;
  const rejectedCount = seatBookings.filter(b => b.status === 'rejected').length;

  // Handle Quick Token Verification & Approval
  const handleVerifyQuickToken = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenClean = quickTokenInput.trim().toUpperCase();
    if (!tokenClean) return;

    const matchedBooking = seatBookings.find(
      b => (b.token_id && b.token_id.toUpperCase() === tokenClean) || b.id.toUpperCase().startsWith(tokenClean)
    );

    if (!matchedBooking) {
      addToast('error', `No passenger booking found matching Token "${tokenClean}".`, 'Token Not Found');
      return;
    }

    updateSeatBookingStatus(matchedBooking.id, 'confirmed');
    setQuickTokenInput('');
    setPreviewBooking(matchedBooking);
    setIsModalOpen(true);
  };

  // Approve All Pending on Active Filter
  const handleApproveAllPending = () => {
    const pendings = filteredBookings.filter(b => !b.status || b.status === 'pending');
    if (pendings.length === 0) return;
    
    if (window.confirm(`Approve all ${pendings.length} pending seat requests at once?`)) {
      pendings.forEach(b => updateSeatBookingStatus(b.id, 'confirmed'));
    }
  };

  // Get Bookings for Manifest
  const manifestBookings = seatBookings.filter(
    b => b.bus_id === activeBusView && b.direction === activeDirectionView && b.trip_slot.includes(activeSlotView)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="page-header page-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BusIcon size={12} /> Bus Conductor & Transit Staff Portal
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--gub-green-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={13} /> Real-Time Cross-Device Sync Active
            </span>
          </div>
          <h1 className="page-title">Passenger Seat Verification & Dispatch Desk</h1>
          <p className="page-subtitle">
            Real-time incoming student seat requests, instant token verification, and digital boarding pass approvals
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={async () => {
              setIsSyncing(true);
              await refetchSeatBookings();
              setIsSyncing(false);
              addToast('success', 'Live seating data synchronized with cloud database.', 'Data Refreshed');
            }}
            disabled={isSyncing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Cloud'}
          </button>

          {pendingCount > 0 && (
            <button 
              className="btn btn-primary"
              onClick={handleApproveAllPending}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              <CheckCheck size={16} /> Approve All Pending ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* Instant Token Verification Search Box */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)', border: '1.5px solid rgba(245, 158, 11, 0.35)' }}>
        <form onSubmit={handleVerifyQuickToken} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Fast Token Scanner / Verifier</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Enter the student's Unique Token ID (e.g. <strong>GUB-TK-8942</strong>) to instantly approve boarding
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. GUB-TK-8942 or BK-GL2..."
              value={quickTokenInput}
              onChange={e => setQuickTokenInput(e.target.value)}
              style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', whiteSpace: 'nowrap' }}
            >
              <CheckCircle size={16} /> Verify & Accept
            </button>
          </div>
        </form>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
        {/* Pending Requests */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING APPROVAL</span>
            <span className="badge badge-amber">{pendingCount} Waiting</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#f59e0b' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Student seat requests awaiting your review
          </div>
        </div>

        {/* Confirmed Passes */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONFIRMED SEATS</span>
            <span className="badge badge-emerald">{confirmedCount} Active</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--gub-green-light)' }}>
            {confirmedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Boarding passes verified and cleared to travel
          </div>
        </div>

        {/* Fleet Routes */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TRANSIT FLEET</span>
            <span className="badge badge-blue">4 Lines</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#60a5fa' }}>
            10 Buses
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            45 seats per bus cabin capacity
          </div>
        </div>

        {/* Conductor Info */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gub-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOGGED CONDUCTOR</span>
            <span className="badge badge-purple">On Duty</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {profile?.name || 'Md. Rafiqul Islam'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Staff ID: {profile?.id_no || 'GUB-STAFF-042'}
          </div>
        </div>
      </div>

      {/* Main Seat Request Approvals Queue */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Armchair size={20} color="var(--gub-green)" /> Incoming Passenger Seat Requests
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time feed of passenger bookings with Student Name, ID, Token ID, and Seat Details
            </p>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`filter-tab-btn ${selectedStatusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter('all')}
              >
                All ({seatBookings.length})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter('pending')}
                style={{ borderColor: selectedStatusFilter === 'pending' ? '#f59e0b' : undefined }}
              >
                ⏳ Pending ({pendingCount})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatusFilter === 'confirmed' ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter('confirmed')}
              >
                ✓ Approved ({confirmedCount})
              </button>
              <button
                className={`filter-tab-btn ${selectedStatusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter('rejected')}
              >
                ✕ Declined ({rejectedCount})
              </button>
            </div>

            {/* Line Filter */}
            <select
              className="form-select"
              value={selectedLineFilter}
              onChange={e => setSelectedLineFilter(e.target.value)}
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', height: '36px' }}
            >
              <option value="all">All 4 Lines</option>
              <option value="bus-1">Line 1 (Mirpur)</option>
              <option value="bus-2">Line 2 (Uttara)</option>
              <option value="bus-3">Line 3 (Bishnandi)</option>
              <option value="bus-4">Line 4 (Savar)</option>
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search token, ID or name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '30px', height: '36px', fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

        {/* Requests Table / Cards */}
        {filteredBookings.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Armchair size={42} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No Seat Requests Found</h4>
            <p style={{ fontSize: '0.85rem' }}>No student seat reservations match your current filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredBookings.map(b => {
              const status = b.status || 'pending';
              const isPending = status === 'pending';
              const isConfirmed = status === 'confirmed';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: isPending 
                      ? '1.5px solid rgba(245, 158, 11, 0.5)' 
                      : isConfirmed 
                      ? '1px solid rgba(16, 185, 129, 0.3)' 
                      : '1px solid var(--border-subtle)',
                    gap: '1rem'
                  }}
                >
                  {/* Left: Seat #, Token ID & Passenger Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      background: isConfirmed 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : isRejected 
                        ? 'rgba(239, 68, 68, 0.15)' 
                        : 'rgba(245, 158, 11, 0.15)',
                      border: isConfirmed 
                        ? '1.5px solid #10b981' 
                        : isRejected 
                        ? '1.5px solid #ef4444' 
                        : '1.5px solid #f59e0b',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isConfirmed ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b'
                    }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase' }}>SEAT</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>{b.seat_number}</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        {/* Token ID Badge */}
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          background: isConfirmed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: isConfirmed ? '#10b981' : '#f59e0b',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isConfirmed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                        }}>
                          Token: {b.token_id || b.id.toUpperCase().slice(0, 10)}
                        </span>

                        <span className={`badge ${
                          b.bus_id === 'bus-1' ? 'badge-blue' :
                          b.bus_id === 'bus-2' ? 'badge-emerald' :
                          b.bus_id === 'bus-3' ? 'badge-cyan' : 'badge-amber'
                        }`} style={{ fontSize: '0.68rem', padding: '0.12rem 0.45rem' }}>
                          {b.bus_name}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {b.student_name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <span>Student ID: <strong style={{ color: 'var(--text-primary)' }}>{b.student_id}</strong></span>
                        <span>•</span>
                        <span>{b.user_email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stoppage & Timing */}
                  <div style={{ minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <MapPin size={13} color="var(--gub-green)" /> {b.stoppage}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--gub-green-light)', marginTop: '0.2rem', fontWeight: 600 }}>
                      <Clock size={13} /> {b.stoppage_time} ({b.trip_slot} Departure)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Travel Date: {b.booking_date} ({b.direction === 'to_campus' ? 'To Campus' : 'Return'})
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isConfirmed && (
                      <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={13} /> Approved by Conductor
                      </span>
                    )}
                    {isPending && (
                      <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> Awaiting Approval
                      </span>
                    )}
                    {isRejected && (
                      <span className="badge badge-slate" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gub-rose)' }}>
                        <XCircle size={13} /> Request Declined
                      </span>
                    )}
                  </div>

                  {/* Right Actions: Accept, Decline, View Pass */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isPending ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => updateSeatBookingStatus(b.id, 'confirmed')}
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                          title="Accept seat reservation and issue confirmed boarding pass"
                        >
                          <CheckCircle size={14} /> Accept Seat
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => updateSeatBookingStatus(b.id, 'rejected')}
                          style={{ color: 'var(--gub-rose)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          title="Decline this reservation request"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </>
                    ) : isConfirmed ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateSeatBookingStatus(b.id, 'rejected')}
                        style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      >
                        Revoke Approval
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateSeatBookingStatus(b.id, 'confirmed')}
                        style={{ fontSize: '0.75rem', color: 'var(--gub-green)' }}
                      >
                        Re-Approve
                      </button>
                    )}

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setPreviewBooking(b);
                        setIsModalOpen(true);
                      }}
                      title="Preview Digital Boarding Pass"
                    >
                      <QrCode size={14} /> E-Pass
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bus Cabin Manifest & Seating Roster Section */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--gub-cyan)" /> 45-Seat Bus Cabin Passenger Roster
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live seating manifest for each bus and departure shift
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={activeBusView}
              onChange={e => setActiveBusView(e.target.value)}
              style={{ width: 'auto', fontSize: '0.85rem', height: '36px' }}
            >
              <option value="bus-1">Line 1 (Mirpur Route)</option>
              <option value="bus-2">Line 2 (Uttara Route)</option>
              <option value="bus-3">Line 3 (Bishnandi Route)</option>
              <option value="bus-4">Line 4 (Savar Route)</option>
            </select>

            <select
              className="form-select"
              value={activeDirectionView}
              onChange={e => setActiveDirectionView(e.target.value as BusDirection)}
              style={{ width: 'auto', fontSize: '0.85rem', height: '36px' }}
            >
              <option value="to_campus">Inbound (To Campus)</option>
              <option value="from_campus">Outbound (Return)</option>
            </select>

            <select
              className="form-select"
              value={activeSlotView}
              onChange={e => setActiveSlotView(e.target.value)}
              style={{ width: 'auto', fontSize: '0.85rem', height: '36px' }}
            >
              <option value="07:00 AM">07:00 AM Shift</option>
              <option value="07:30 AM">07:30 AM Shift</option>
              <option value="09:30 AM">09:30 AM Shift</option>
              <option value="12:00 PM">12:00 PM Shift</option>
              <option value="01:45 PM">01:45 PM Shift</option>
              <option value="04:45 PM">04:45 PM Shift</option>
            </select>
          </div>
        </div>

        {/* 45 Seat Quick Manifest Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.65rem',
          padding: '1.25rem',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {Array.from({ length: 45 }, (_, i) => i + 1).map(seatNo => {
            const occupant = manifestBookings.find(b => b.seat_number === seatNo);
            const isConfirmed = occupant?.status === 'confirmed';
            const isPending = occupant && (!occupant.status || occupant.status === 'pending');

            return (
              <div
                key={seatNo}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  background: isConfirmed 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : isPending 
                    ? 'rgba(245, 158, 11, 0.15)' 
                    : 'var(--bg-card)',
                  border: isConfirmed 
                    ? '1.5px solid #10b981' 
                    : isPending 
                    ? '1.5px solid #f59e0b' 
                    : '1px solid var(--border-subtle)',
                  cursor: occupant ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if (occupant) {
                    setPreviewBooking(occupant);
                    setIsModalOpen(true);
                  }
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isConfirmed ? '#10b981' : isPending ? '#f59e0b' : 'var(--text-muted)' }}>
                  Seat #{seatNo}
                </div>
                {occupant ? (
                  <div style={{ marginTop: '0.2rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                      {occupant.student_name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {occupant.token_id || occupant.student_id}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: isConfirmed ? 'var(--gub-green-light)' : '#f59e0b', fontWeight: 600 }}>
                      {isConfirmed ? '✓ Boarding' : '⏳ Pending'}
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Empty</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Boarding Pass Preview Modal */}
      <BoardingPassModal
        booking={previewBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancelBooking={id => cancelSeatBooking(id)}
      />
    </div>
  );
};
