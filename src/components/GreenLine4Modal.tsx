import React, { useState } from 'react';
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
  User
} from 'lucide-react';

interface GreenLine4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatBookings: BusSeatBooking[];
  onBookSeat: (bookingData: Omit<BusSeatBooking, 'id' | 'created_at'>) => Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }>;
  currentUserEmail?: string;
  currentUserName?: string;
  currentUserIdNo?: string;
  onBookingSuccess: (booking: BusSeatBooking) => void;
}

export const GL4_INBOUND_TRIPS = [
  {
    id: 'trip-gl4-in-1',
    busNumber: 'Bus 01',
    busName: 'Green Line 4 (Bus 01)',
    departureTime: '07:00 AM',
    shiftTitle: 'Morning Shift 1',
    desc: 'Leaves Savar at 7:00 AM for morning 8:30 AM classes',
    stoppages: [
      { name: 'Savar', time: '07:00 AM', desc: 'Starting Point / Savar Terminal' },
      { name: 'Kuril Flyover', time: '08:00 AM', desc: '+60 mins' },
      { name: 'Green University Campus', time: '08:30 AM', desc: 'Arrival (+30 mins)' }
    ]
  },
  {
    id: 'trip-gl4-in-2',
    busNumber: 'Bus 02',
    busName: 'Green Line 4 (Bus 02)',
    departureTime: '12:00 PM',
    shiftTitle: 'Midday Shift 2',
    desc: 'Leaves Savar at 12:00 PM (Noon) for afternoon 1:30 PM classes',
    stoppages: [
      { name: 'Savar', time: '12:00 PM', desc: 'Starting Point / Savar Terminal' },
      { name: 'Kuril Flyover', time: '01:00 PM', desc: '+60 mins' },
      { name: 'Green University Campus', time: '01:30 PM', desc: 'Arrival (+30 mins)' }
    ]
  }
];

export const GL4_OUTBOUND_TRIPS = [
  {
    id: 'trip-gl4-out-1',
    busNumber: 'Bus 01',
    busName: 'Green Line 4 (Bus 01)',
    departureTime: '01:45 PM',
    shiftTitle: 'Afternoon Return (Bus 01)',
    desc: 'Bus 01 departs Campus at 1:45 PM returning to Savar',
    stoppages: [
      { name: 'Green University Campus', time: '01:45 PM', desc: 'Departure Point' },
      { name: 'Kuril Flyover', time: '02:15 PM', desc: '+30 mins' },
      { name: 'Savar', time: '03:15 PM', desc: 'Arrival (+60 mins)' }
    ]
  },
  {
    id: 'trip-gl4-out-2',
    busNumber: 'Bus 02',
    busName: 'Green Line 4 (Bus 02)',
    departureTime: '04:45 PM',
    shiftTitle: 'Evening Return (Bus 02)',
    desc: 'Bus 02 departs Campus at 4:45 PM returning to Savar',
    stoppages: [
      { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
      { name: 'Kuril Flyover', time: '05:15 PM', desc: '+30 mins' },
      { name: 'Savar', time: '06:15 PM', desc: 'Arrival (+60 mins)' }
    ]
  }
];

export const GreenLine4Modal: React.FC<GreenLine4ModalProps> = ({
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
  const [selectedTrip, setSelectedTrip] = useState<typeof GL4_INBOUND_TRIPS[0] | null>(null);

  // Form State for Step 2
  const [selectedStoppage, setSelectedStoppage] = useState<string>('Savar');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [passengerName, setPassengerName] = useState<string>(currentUserName || '');
  const [passengerIdNo, setPassengerIdNo] = useState<string>(currentUserIdNo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (currentUserName && !passengerName) setPassengerName(currentUserName);
    if (currentUserIdNo && !passengerIdNo) setPassengerIdNo(currentUserIdNo);
  }, [currentUserName, currentUserIdNo]);

  React.useEffect(() => {
    if (selectedTrip && selectedTrip.stoppages.length > 0) {
      setSelectedStoppage(selectedTrip.stoppages[0].name);
      setSelectedSeat(null);
    }
  }, [selectedTrip]);

  if (!isOpen) return null;

  const currentTrips = direction === 'to_campus' ? GL4_INBOUND_TRIPS : GL4_OUTBOUND_TRIPS;

  // Filter bookings for a given trip on Line 4
  const getBookingsForTrip = (trip: typeof GL4_INBOUND_TRIPS[0]) => {
    return seatBookings.filter(
      b =>
        b.bus_id === 'bus-4' &&
        (b.bus_name.includes(trip.busNumber) || b.trip_slot === trip.departureTime) &&
        b.direction === direction
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
      bus_id: 'bus-4',
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
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber">
                <Sparkles size={12} /> Green Line 4 • 2 Buses Fleet
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>45 Seats Per Bus</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {selectedTrip ? `Reserve Seat on ${selectedTrip.busName}` : 'Select Bus on Green Line 4'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {selectedTrip 
                ? `Departure: ${selectedTrip.departureTime} • Pick your seat from the 45-seat cabin map` 
                : 'Savar ➔ Kuril Flyover ➔ Green University Campus'}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE WHICH OF THE 2 BUSES TO BOOK ON GREEN LINE 4 */}
        {/* ========================================================================= */}
        {!selectedTrip && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Direction Selector */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="direction-pill-group" style={{ maxWidth: '420px', width: '100%' }}>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'to_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('to_campus')}
                >
                  <Navigation size={15} /> To Campus (Savar ➔ Varsity)
                </button>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'from_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('from_campus')}
                >
                  <RotateCcw size={15} /> Return (Varsity ➔ Savar)
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BusIcon size={16} color="var(--gub-gold)" />
              {direction === 'to_campus' 
                ? 'Select a Bus from Savar Terminal (2 Buses Operating):' 
                : 'Select a Return Bus from Campus Terminal to Savar:'}
            </div>

            {/* 2 Bus Choice Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {currentTrips.map((trip, idx) => {
                const bookedCount = getBookingsForTrip(trip).length;
                const availableCount = Math.max(0, 45 - bookedCount);

                return (
                  <div
                    key={trip.id}
                    className="glass-card glass-card-interactive"
                    style={{
                      padding: '1.5rem',
                      borderLeft: `4px solid ${idx === 0 ? '#f59e0b' : '#10b981'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <span className={`badge ${idx === 0 ? 'badge-amber' : 'badge-emerald'}`}>
                          {trip.busNumber} • {trip.shiftTitle}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gub-gold)' }}>
                          {availableCount} / 45 Seats
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{trip.busName}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem', marginBottom: '1rem' }}>
                        {trip.desc}
                      </p>

                      {/* Stoppage schedule */}
                      <div style={{ background: 'var(--bg-input)', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          STOPPAGE TIMINGS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {trip.stoppages.map((st, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{st.name}</span>
                              <strong style={{ color: 'var(--text-primary)' }}>{st.time}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedTrip(trip);
                      }}
                    >
                      <Armchair size={15} /> Book Seat on {trip.busNumber} ({trip.departureTime})
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: 45-SEAT INTERACTIVE MAP & BOOKING FORM FOR CHOSEN BUS ON LINE 4 */}
        {/* ========================================================================= */}
        {selectedTrip && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Back Button & Bus Summary Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', gap: '0.75rem' }}>
              <div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedTrip(null)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}
                >
                  <ArrowLeft size={14} /> Change Bus ({selectedTrip.busNumber})
                </button>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedTrip.busName} • Departure @ <span style={{ color: 'var(--gub-gold)' }}>{selectedTrip.departureTime}</span>
                </div>
              </div>

              <span className="badge badge-amber" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>
                {45 - getBookingsForTrip(selectedTrip).length} of 45 Seats Available
              </span>
            </div>

            {/* Grid with 45-seat map and booking inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
              {/* Bus Cabin Map */}
              <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <BusSeatMap
                  totalSeats={45}
                  selectedSeat={selectedSeat}
                  onSelectSeat={seatNo => setSelectedSeat(seatNo)}
                  existingBookings={getBookingsForTrip(selectedTrip)}
                  currentUserEmail={currentUserEmail}
                />
              </div>

              {/* Booking Information Form */}
              <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--gub-gold)" /> Select Boarding Stoppage
                  </label>
                  <select
                    className="form-input"
                    value={selectedStoppage}
                    onChange={e => setSelectedStoppage(e.target.value)}
                    required
                  >
                    {selectedTrip.stoppages.map((stop, idx) => (
                      <option key={idx} value={stop.name}>
                        {stop.name} ({stop.time})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Passenger Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={passengerName}
                    onChange={e => setPassengerName(e.target.value)}
                    placeholder="Enter student or teacher name"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Student / ID Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={passengerIdNo}
                    onChange={e => setPassengerIdNo(e.target.value)}
                    placeholder="e.g. 22100234"
                    required
                  />
                </div>

                {/* Selected Seat Summary */}
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SELECTED SEAT</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: selectedSeat ? 'var(--gub-gold)' : 'var(--text-muted)' }}>
                      {selectedSeat ? `Seat #${selectedSeat}` : 'Tap a seat to pick'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Stoppage: <strong>{selectedStoppage}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
                  disabled={!selectedSeat || isSubmitting}
                >
                  {isSubmitting ? (
                    'Processing Reservation...'
                  ) : selectedSeat ? (
                    <>
                      <CheckCircle2 size={18} /> Confirm Seat #{selectedSeat} on {selectedTrip.busNumber}
                    </>
                  ) : (
                    'Please Tap a Seat on the Bus Map'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
