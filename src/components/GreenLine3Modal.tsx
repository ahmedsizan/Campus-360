import React, { useState, useEffect } from 'react';
import { BusDirection, BusSeatBooking } from '../types';
import { BusSeatMap } from './BusSeatMap';
import { 
  X, 
  Bus as BusIcon, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  Navigation, 
  RotateCcw, 
  Armchair, 
  ShieldCheck, 
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';

interface GreenLine3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatBookings: BusSeatBooking[];
  onBookSeat: (bookingData: Omit<BusSeatBooking, 'id' | 'created_at'>) => Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }>;
  currentUserEmail?: string;
  currentUserName?: string;
  currentUserIdNo?: string;
  onBookingSuccess: (booking: BusSeatBooking) => void;
}

export const GL3_INBOUND_TRIPS = [
  {
    id: 'gl3-in-1',
    busNumber: 'Bus 01',
    busName: 'Green Line 3 (Bus 01)',
    departureTime: '07:30 AM',
    shiftTitle: 'Morning Shift 1',
    desc: 'Leaves Bishnandi Ferry Ghat at 7:30 AM for morning 8:30 AM classes',
    stoppages: [
      { name: 'Bishnandi Ferry Ghat', time: '07:30 AM', desc: 'Starting Point / Terminal' },
      { name: 'Araihazar', time: '07:50 AM', desc: '+20 mins' },
      { name: 'Gawsia', time: '08:10 AM', desc: '+20 mins' },
      { name: 'Green University Campus', time: '08:30 AM', desc: 'Arrival (+20 mins)' }
    ]
  },
  {
    id: 'gl3-in-2',
    busNumber: 'Bus 02',
    busName: 'Green Line 3 (Bus 02)',
    departureTime: '09:30 AM',
    shiftTitle: 'Morning Shift 2',
    desc: 'Leaves Bishnandi Ferry Ghat at 9:30 AM for 10:30 AM classes',
    stoppages: [
      { name: 'Bishnandi Ferry Ghat', time: '09:30 AM', desc: 'Starting Point / Terminal' },
      { name: 'Araihazar', time: '09:50 AM', desc: '+20 mins' },
      { name: 'Gawsia', time: '10:10 AM', desc: '+20 mins' },
      { name: 'Green University Campus', time: '10:30 AM', desc: 'Arrival (+20 mins)' }
    ]
  },
  {
    id: 'gl3-in-3',
    busNumber: 'Bus 03',
    busName: 'Green Line 3 (Bus 03)',
    departureTime: '12:00 PM',
    shiftTitle: 'Midday Shift',
    desc: 'Leaves Bishnandi Ferry Ghat at 12:00 PM (Noon) for afternoon 1:00 PM classes',
    stoppages: [
      { name: 'Bishnandi Ferry Ghat', time: '12:00 PM', desc: 'Starting Point / Terminal' },
      { name: 'Araihazar', time: '12:20 PM', desc: '+20 mins' },
      { name: 'Gawsia', time: '12:40 PM', desc: '+20 mins' },
      { name: 'Green University Campus', time: '01:00 PM', desc: 'Arrival (+20 mins)' }
    ]
  }
];

export const GL3_OUTBOUND_TRIPS = [
  {
    id: 'gl3-out-1',
    busNumber: 'Bus 01',
    busName: 'Green Line 3 (Bus 01)',
    departureTime: '01:45 PM',
    shiftTitle: 'Afternoon Return (1 Bus)',
    desc: '1 Bus departs Campus at 1:45 PM returning to Bishnandi Ferry Ghat',
    stoppages: [
      { name: 'Green University Campus', time: '01:45 PM', desc: 'Departure Point' },
      { name: 'Gawsia', time: '02:05 PM', desc: '+20 mins' },
      { name: 'Araihazar', time: '02:25 PM', desc: '+20 mins' },
      { name: 'Bishnandi Ferry Ghat', time: '02:45 PM', desc: 'Arrival (+20 mins)' }
    ]
  },
  {
    id: 'gl3-out-2a',
    busNumber: 'Bus 02',
    busName: 'Green Line 3 (Bus 02 - Shuttle A)',
    departureTime: '04:45 PM',
    shiftTitle: 'Evening Return (Shuttle A - Dual Fleet)',
    desc: 'Departs Campus at 4:45 PM simultaneously with Bus 03',
    stoppages: [
      { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
      { name: 'Gawsia', time: '05:05 PM', desc: '+20 mins' },
      { name: 'Araihazar', time: '05:25 PM', desc: '+20 mins' },
      { name: 'Bishnandi Ferry Ghat', time: '05:45 PM', desc: 'Arrival (+20 mins)' }
    ]
  },
  {
    id: 'gl3-out-2b',
    busNumber: 'Bus 03',
    busName: 'Green Line 3 (Bus 03 - Shuttle B)',
    departureTime: '04:45 PM',
    shiftTitle: 'Evening Return (Shuttle B - Dual Fleet)',
    desc: 'Departs Campus at 4:45 PM simultaneously with Bus 02',
    stoppages: [
      { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
      { name: 'Gawsia', time: '05:05 PM', desc: '+20 mins' },
      { name: 'Araihazar', time: '05:25 PM', desc: '+20 mins' },
      { name: 'Bishnandi Ferry Ghat', time: '05:45 PM', desc: 'Arrival (+20 mins)' }
    ]
  }
];

export const GreenLine3Modal: React.FC<GreenLine3ModalProps> = ({
  isOpen,
  onClose,
  seatBookings,
  onBookSeat,
  currentUserEmail,
  currentUserName,
  currentUserIdNo,
  onBookingSuccess
}) => {
  const [direction, setDirection] = useState<BusDirection>('to_campus');
  const [selectedTrip, setSelectedTrip] = useState<typeof GL3_INBOUND_TRIPS[0] | null>(null);

  // Form State for Step 2
  const [selectedStoppage, setSelectedStoppage] = useState<string>('Bishnandi Ferry Ghat');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [passengerName, setPassengerName] = useState<string>(currentUserName || '');
  const [passengerIdNo, setPassengerIdNo] = useState<string>(currentUserIdNo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserName && !passengerName) setPassengerName(currentUserName);
    if (currentUserIdNo && !passengerIdNo) setPassengerIdNo(currentUserIdNo);
  }, [currentUserName, currentUserIdNo]);

  useEffect(() => {
    if (selectedTrip && selectedTrip.stoppages.length > 0) {
      setSelectedStoppage(selectedTrip.stoppages[0].name);
      setSelectedSeat(null);
    }
  }, [selectedTrip]);

  // Handle ESC Key to Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTrips = direction === 'to_campus' ? GL3_INBOUND_TRIPS : GL3_OUTBOUND_TRIPS;

  // Filter bookings for a given trip on Line 3
  const getBookingsForTrip = (trip: typeof GL3_INBOUND_TRIPS[0]) => {
    return seatBookings.filter(
      b =>
        b.bus_id === 'bus-3' &&
        (b.bus_name.includes(trip.busNumber) || b.trip_slot === trip.departureTime) &&
        b.direction === direction &&
        b.status !== 'rejected'
    );
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !selectedSeat) {
      alert('Please select an available seat (1 to 45).');
      return;
    }

    const currentStoppageObj = selectedTrip.stoppages.find(s => s.name === selectedStoppage) || selectedTrip.stoppages[0];

    setIsSubmitting(true);
    const result = await onBookSeat({
      bus_id: 'bus-3',
      bus_name: selectedTrip.busName,
      direction,
      trip_slot: selectedTrip.departureTime,
      stoppage: currentStoppageObj.name,
      stoppage_time: currentStoppageObj.time,
      seat_number: selectedSeat,
      student_name: passengerName.trim() || 'Student',
      student_id: passengerIdNo.trim() || 'GUB-STU',
      user_email: currentUserEmail || 'student@green.edu.bd',
      booking_date: new Date().toISOString().split('T')[0]
    });
    setIsSubmitting(false);

    if (result.success && result.booking) {
      onBookingSuccess(result.booking);
      setSelectedTrip(null);
      setSelectedSeat(null);
    }
  };

  return (
    <div className="booking-modal-fullscreen animate-fade-in">
      {/* Sticky Fullscreen Top Header */}
      <div className="booking-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
          <div style={{
            width: '38px',
            height: '38px',
            minWidth: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)',
            flexShrink: 0
          }}>
            <BusIcon size={20} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                Green Line 3 • Bishnandi
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                45 Seats Riverfront Fleet
              </span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.1rem 0 0', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedTrip ? `${selectedTrip.busName} (${selectedTrip.departureTime})` : 'Select Bus Shift & Direction'}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {selectedTrip && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedTrip(null);
                setSelectedSeat(null);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', fontSize: '0.78rem' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', flexShrink: 0 }}
            title="Close Full Screen Terminal (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Terminal Container */}
      <div className="booking-terminal-container">
        {/* ========================================================================= */}
        {/* STEP 1: SELECT BUS SHIFT */}
        {/* ========================================================================= */}
        {!selectedTrip ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Direction Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="direction-pill-group" style={{ maxWidth: '520px', width: '100%', padding: '5px' }}>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'to_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('to_campus')}
                  style={{
                    background: direction === 'to_campus' ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' : undefined,
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <Navigation size={15} /> To Campus (Bishnandi ➔ GUB)
                </button>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'from_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('from_campus')}
                  style={{
                    background: direction === 'from_campus' ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' : undefined,
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <RotateCcw size={15} /> Return (GUB ➔ Bishnandi)
                </button>
              </div>
            </div>

            {/* Shift List Header */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={18} color="#06b6d4" />
                {direction === 'to_campus' ? 'Available Buses Departing from Bishnandi Ferry Ghat' : 'Available Return Buses from Campus Terminal'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Select your preferred departure timetable to choose your 45-seat position.
              </p>
            </div>

            {/* Bus Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {currentTrips.map(trip => {
                const bookedCount = getBookingsForTrip(trip).length;
                const availableCount = Math.max(0, 45 - bookedCount);

                return (
                  <div
                    key={trip.id}
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      borderLeft: '4px solid #0891b2',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span className="badge badge-cyan" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                            {trip.busNumber} • {trip.shiftTitle}
                          </span>
                          <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                            {trip.busName}
                          </h4>
                        </div>

                        <div style={{
                          textAlign: 'right',
                          padding: '0.5rem 0.9rem',
                          background: 'rgba(8, 145, 178, 0.15)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(8, 145, 178, 0.3)'
                        }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>DEPARTS</span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22d3ee' }}>{trip.departureTime}</span>
                        </div>
                      </div>

                      {/* Stoppage Route Preview */}
                      <div style={{
                        background: 'var(--bg-input)',
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        margin: '1.1rem 0'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                          SCHEDULED STOPS & TIMING
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {trip.stoppages.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {idx === 0 ? '🚩' : idx === trip.stoppages.length - 1 ? '🏁' : '📍'} {s.name}
                              </span>
                              <span style={{ color: '#22d3ee', fontWeight: 700 }}>{s.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Available Cabin Capacity</span>
                          <span style={{ fontWeight: 800, color: availableCount < 10 ? '#f59e0b' : 'var(--gub-green-light)' }}>
                            {availableCount} of 45 Seats Available
                          </span>
                        </div>
                        <div style={{ height: '7px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(bookedCount / 45) * 100}%`,
                            background: 'linear-gradient(90deg, #0891b2 0%, #22d3ee 100%)',
                            borderRadius: 'var(--radius-full)'
                          }} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <Armchair size={17} /> Select This Bus & Pick Seat <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STEP 2: 2-COLUMN LUXURY BOOKING TERMINAL */
          /* ========================================================================= */
          <form onSubmit={handleConfirmReservation} className="booking-grid-layout">
            {/* Left Column: 45-Seat Bus Cabin Layout */}
            <div className="luxury-bus-cabin" style={{ borderColor: 'rgba(8, 145, 178, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
                    <Armchair size={19} color="#06b6d4" /> Select Your Seat (1 to 45)
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    Tap any available seat to select your passenger position
                  </p>
                </div>

                {selectedSeat && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                    ✓ Seat #{selectedSeat} Selected
                  </span>
                )}
              </div>

              <BusSeatMap
                totalSeats={45}
                selectedSeat={selectedSeat}
                onSelectSeat={seatNo => setSelectedSeat(seatNo)}
                existingBookings={getBookingsForTrip(selectedTrip)}
                currentUserEmail={currentUserEmail}
                lineThemeColor="#06b6d4"
                busLineName={selectedTrip.busName}
              />
            </div>

            {/* Right Column: Passenger Details, Stoppage & Ticket Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Trip Summary Card */}
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #0891b2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                      Green Line 3 • {direction === 'to_campus' ? 'Inbound to Campus' : 'Outbound Return'}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                      {selectedTrip.busName}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 800 }}>DEPARTURE</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#22d3ee' }}>{selectedTrip.departureTime}</div>
                  </div>
                </div>

                {/* Stoppage Selector */}
                <div style={{ marginTop: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#06b6d4" /> Select Your Boarding Stoppage
                  </label>
                  <select
                    className="form-select"
                    value={selectedStoppage}
                    onChange={e => setSelectedStoppage(e.target.value)}
                    style={{ padding: '0.75rem', fontSize: '0.92rem', fontWeight: 600 }}
                  >
                    {selectedTrip.stoppages.map((st, idx) => (
                      <option key={idx} value={st.name}>
                        {st.name} — Scheduled @ {st.time} ({st.desc})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Identity Information */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} color="#06b6d4" /> Passenger Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Passenger Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={passengerName}
                      onChange={e => setPassengerName(e.target.value)}
                      placeholder="Ahmed Sizan"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Student / Employee ID Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={passengerIdNo}
                      onChange={e => setPassengerIdNo(e.target.value)}
                      placeholder="221002001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Live Ticket & Token Preview Card */}
              <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.12) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1.5px solid rgba(8, 145, 178, 0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    DIGITAL TOKEN PREVIEW
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    ⏳ Sent for Conductor Approval
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>RESERVED SEAT</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: selectedSeat ? '#22d3ee' : 'var(--text-muted)' }}>
                      {selectedSeat ? `Seat #${selectedSeat}` : 'Pick Seat Left'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT FARE</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--gub-green-light)' }}>
                      FREE • GUB SUBSIDY
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedSeat || isSubmitting}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                    boxShadow: selectedSeat ? '0 4px 18px rgba(8, 145, 178, 0.5)' : undefined
                  }}
                >
                  {isSubmitting ? (
                    'Dispatching Seat Request to Conductor...'
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Confirm Seat #{selectedSeat || '?'} & Get Token
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
