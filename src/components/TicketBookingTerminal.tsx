import React, { useState, useEffect } from 'react';
import { BusDirection, BusSeatBooking } from '../types';
import { BusSeatMap } from './BusSeatMap';
import { playNotificationChime } from '../lib/realtimeSound';
import { 
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
  Ticket,
  ChevronRight,
  ArrowRight,
  Printer,
  Calendar,
  Hourglass,
  AlertOctagon,
  CheckCircle,
  QrCode,
  Layers,
  X,
  Share2
} from 'lucide-react';

// =============================================================================
// BUS LINE TIMETABLES & DATA
// =============================================================================

export interface BusTrip {
  id: string;
  busNumber: string;
  busName: string;
  departureTime: string;
  shiftTitle: string;
  desc: string;
  stoppages: { name: string; time: string; desc: string }[];
}

export interface LineConfig {
  key: string;
  id: string;
  name: string;
  shortName: string;
  routeTitle: string;
  routePath: string;
  themeColor: string;
  lightColor: string;
  btnGradient: string;
  cardGradient: string;
  borderAccent: string;
  badgeClass: string;
  inboundTrips: BusTrip[];
  outboundTrips: BusTrip[];
}

export const BUS_LINES: Record<string, LineConfig> = {
  'bus-1': {
    key: 'gl1',
    id: 'bus-1',
    name: 'Green Line 1 (Mirpur Route)',
    shortName: 'Line 1 • Mirpur',
    routeTitle: 'Mirpur ➔ Kuril ➔ Campus',
    routePath: 'Mirpur (Terminal) ➔ Kuril Flyover ➔ Green University Campus & Return',
    themeColor: '#3b82f6',
    lightColor: '#60a5fa',
    btnGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(37, 99, 235, 0.05) 100%)',
    borderAccent: 'rgba(59, 130, 246, 0.35)',
    badgeClass: 'badge-blue',
    inboundTrips: [
      {
        id: 'gl1-in-1',
        busNumber: 'Bus 01',
        busName: 'Green Line 1 (Bus 01)',
        departureTime: '07:30 AM',
        shiftTitle: 'Morning Shift 1',
        desc: 'Leaves Mirpur at 7:30 AM ➔ Kuril 8:00 AM ➔ Campus 8:30 AM',
        stoppages: [
          { name: 'Mirpur', time: '07:30 AM', desc: 'Starting Point' },
          { name: 'Kuril Flyover', time: '08:00 AM', desc: '+30 mins' },
          { name: 'Green University Campus', time: '08:30 AM', desc: 'Arrival (+30 mins)' }
        ]
      },
      {
        id: 'gl1-in-2',
        busNumber: 'Bus 02',
        busName: 'Green Line 1 (Bus 02)',
        departureTime: '12:00 PM',
        shiftTitle: 'Midday Shift 2',
        desc: 'Leaves Mirpur at 12:00 PM (Noon) ➔ Kuril 12:30 PM ➔ Campus 1:00 PM',
        stoppages: [
          { name: 'Mirpur', time: '12:00 PM', desc: 'Starting Point' },
          { name: 'Kuril Flyover', time: '12:30 PM', desc: '+30 mins' },
          { name: 'Green University Campus', time: '01:00 PM', desc: 'Arrival (+30 mins)' }
        ]
      }
    ],
    outboundTrips: [
      {
        id: 'gl1-out-1',
        busNumber: 'Bus 01',
        busName: 'Green Line 1 (Bus 01)',
        departureTime: '01:45 PM',
        shiftTitle: 'Afternoon Return',
        desc: 'Leaves Campus at 1:45 PM ➔ Kuril 2:15 PM ➔ Mirpur 2:45 PM',
        stoppages: [
          { name: 'Green University Campus', time: '01:45 PM', desc: 'Departure Point' },
          { name: 'Kuril Flyover', time: '02:15 PM', desc: '+30 mins' },
          { name: 'Mirpur', time: '02:45 PM', desc: 'Arrival (+30 mins)' }
        ]
      },
      {
        id: 'gl1-out-2',
        busNumber: 'Bus 02',
        busName: 'Green Line 1 (Bus 02)',
        departureTime: '04:45 PM',
        shiftTitle: 'Evening Return',
        desc: 'Leaves Campus at 4:45 PM ➔ Kuril 5:15 PM ➔ Mirpur 5:45 PM',
        stoppages: [
          { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
          { name: 'Kuril Flyover', time: '05:15 PM', desc: '+30 mins' },
          { name: 'Mirpur', time: '05:45 PM', desc: 'Arrival (+30 mins)' }
        ]
      }
    ]
  },
  'bus-2': {
    key: 'gl2',
    id: 'bus-2',
    name: 'Green Line 2 (Uttara Route)',
    shortName: 'Line 2 • Uttara',
    routeTitle: 'Uttara House Building ➔ Kuril ➔ Campus',
    routePath: 'Uttara House Building ➔ BNS Center ➔ Kuril ➔ Green University Campus',
    themeColor: '#10b981',
    lightColor: '#34d399',
    btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.05) 100%)',
    borderAccent: 'rgba(16, 185, 129, 0.35)',
    badgeClass: 'badge-emerald',
    inboundTrips: [
      {
        id: 'gl2-in-1',
        busNumber: 'Bus 01',
        busName: 'Green Line 2 (Bus 01)',
        departureTime: '07:30 AM',
        shiftTitle: 'Morning Shift 1',
        desc: 'Leaves Uttara House Building at 7:30 AM for morning 8:30 AM classes',
        stoppages: [
          { name: 'Uttara House Building', time: '07:30 AM', desc: 'Starting Point' },
          { name: 'Uttara BNS Center', time: '07:40 AM', desc: '+10 mins' },
          { name: 'Kuril Flyover', time: '08:00 AM', desc: '+20 mins' },
          { name: 'Green University Campus', time: '08:30 AM', desc: 'Arrival (+30 mins)' }
        ]
      },
      {
        id: 'gl2-in-2',
        busNumber: 'Bus 02',
        busName: 'Green Line 2 (Bus 02)',
        departureTime: '09:30 AM',
        shiftTitle: 'Morning Shift 2',
        desc: 'Leaves Uttara House Building at 9:30 AM for 10:30 AM lectures',
        stoppages: [
          { name: 'Uttara House Building', time: '09:30 AM', desc: 'Starting Point' },
          { name: 'Uttara BNS Center', time: '09:40 AM', desc: '+10 mins' },
          { name: 'Kuril Flyover', time: '10:00 AM', desc: '+20 mins' },
          { name: 'Green University Campus', time: '10:30 AM', desc: 'Arrival (+30 mins)' }
        ]
      },
      {
        id: 'gl2-in-3',
        busNumber: 'Bus 03',
        busName: 'Green Line 2 (Bus 03)',
        departureTime: '12:00 PM',
        shiftTitle: 'Midday Shift',
        desc: 'Leaves Uttara House Building at 12:00 PM (Noon) for afternoon 1:00 PM classes',
        stoppages: [
          { name: 'Uttara House Building', time: '12:00 PM', desc: 'Starting Point' },
          { name: 'Uttara BNS Center', time: '12:10 PM', desc: '+10 mins' },
          { name: 'Kuril Flyover', time: '12:30 PM', desc: '+20 mins' },
          { name: 'Green University Campus', time: '01:00 PM', desc: 'Arrival (+30 mins)' }
        ]
      }
    ],
    outboundTrips: [
      {
        id: 'gl2-out-1',
        busNumber: 'Bus 01',
        busName: 'Green Line 2 (Bus 01)',
        departureTime: '01:45 PM',
        shiftTitle: 'Afternoon Return (1 Bus)',
        desc: '1 Bus departs Campus at 1:45 PM returning to Uttara House Building',
        stoppages: [
          { name: 'Green University Campus', time: '01:45 PM', desc: 'Departure Point' },
          { name: 'Kuril Flyover', time: '02:15 PM', desc: '+30 mins' },
          { name: 'Uttara BNS Center', time: '02:35 PM', desc: '+20 mins' },
          { name: 'Uttara House Building', time: '02:45 PM', desc: 'Arrival (+10 mins)' }
        ]
      },
      {
        id: 'gl2-out-2a',
        busNumber: 'Bus 02',
        busName: 'Green Line 2 (Bus 02 - Shuttle A)',
        departureTime: '04:45 PM',
        shiftTitle: 'Evening Return (Shuttle A - Dual Fleet)',
        desc: 'Departs Campus at 4:45 PM simultaneously with Bus 03',
        stoppages: [
          { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
          { name: 'Kuril Flyover', time: '05:15 PM', desc: '+30 mins' },
          { name: 'Uttara BNS Center', time: '05:35 PM', desc: '+20 mins' },
          { name: 'Uttara House Building', time: '05:45 PM', desc: 'Arrival (+10 mins)' }
        ]
      },
      {
        id: 'gl2-out-2b',
        busNumber: 'Bus 03',
        busName: 'Green Line 2 (Bus 03 - Shuttle B)',
        departureTime: '04:45 PM',
        shiftTitle: 'Evening Return (Shuttle B - Dual Fleet)',
        desc: 'Departs Campus at 4:45 PM simultaneously with Bus 02',
        stoppages: [
          { name: 'Green University Campus', time: '04:45 PM', desc: 'Departure Point' },
          { name: 'Kuril Flyover', time: '05:15 PM', desc: '+30 mins' },
          { name: 'Uttara BNS Center', time: '05:35 PM', desc: '+20 mins' },
          { name: 'Uttara House Building', time: '05:45 PM', desc: 'Arrival (+10 mins)' }
        ]
      }
    ]
  },
  'bus-3': {
    key: 'gl3',
    id: 'bus-3',
    name: 'Green Line 3 (Bishnandi Route)',
    shortName: 'Line 3 • Bishnandi',
    routeTitle: 'Bishnandi Ferry Ghat ➔ Araihazar ➔ Gawsia ➔ Campus',
    routePath: 'Bishnandi Ferry Ghat ➔ Araihazar ➔ Gawsia ➔ Green University Campus',
    themeColor: '#06b6d4',
    lightColor: '#22d3ee',
    btnGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(8, 145, 178, 0.05) 100%)',
    borderAccent: 'rgba(6, 182, 212, 0.35)',
    badgeClass: 'badge-cyan',
    inboundTrips: [
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
    ],
    outboundTrips: [
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
    ]
  },
  'bus-4': {
    key: 'gl4',
    id: 'bus-4',
    name: 'Green Line 4 (Savar Route)',
    shortName: 'Line 4 • Savar',
    routeTitle: 'Savar ➔ Kuril ➔ Campus',
    routePath: 'Savar (Terminal) ➔ Kuril Flyover ➔ Green University Campus & Return',
    themeColor: '#f59e0b',
    lightColor: '#fbbf24',
    btnGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.05) 100%)',
    borderAccent: 'rgba(245, 158, 11, 0.35)',
    badgeClass: 'badge-amber',
    inboundTrips: [
      {
        id: 'gl4-in-1',
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
        id: 'gl4-in-2',
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
    ],
    outboundTrips: [
      {
        id: 'gl4-out-1',
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
        id: 'gl4-out-2',
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
    ]
  }
};

type BookingStep = 'shift' | 'seat' | 'details' | 'pass';

interface TicketBookingTerminalProps {
  initialBusId?: string;
  initialBooking?: BusSeatBooking | null;
  seatBookings: BusSeatBooking[];
  onBookSeat: (bookingData: Omit<BusSeatBooking, 'id' | 'created_at'>) => Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }>;
  currentUserEmail?: string;
  currentUserName?: string;
  currentUserIdNo?: string;
  onClose: () => void;
  onViewMyPasses: () => void;
  onCancelBooking?: (id: string) => void;
}

export const TicketBookingTerminal: React.FC<TicketBookingTerminalProps> = ({
  initialBusId = 'bus-1',
  initialBooking = null,
  seatBookings,
  onBookSeat,
  currentUserEmail,
  currentUserName,
  currentUserIdNo,
  onClose,
  onViewMyPasses,
  onCancelBooking
}) => {
  // Selected line and navigation state
  const [selectedBusId, setSelectedBusId] = useState<string>(
    initialBooking ? (initialBooking.bus_id || 'bus-1') : (initialBusId || 'bus-1')
  );
  const [step, setStep] = useState<BookingStep>(initialBooking ? 'pass' : 'shift');
  const [direction, setDirection] = useState<BusDirection>(
    initialBooking ? initialBooking.direction : 'to_campus'
  );
  
  const currentLine = BUS_LINES[selectedBusId] || BUS_LINES['bus-1'];
  const trips = direction === 'to_campus' ? currentLine.inboundTrips : currentLine.outboundTrips;

  // Selected Trip & Seat
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(trips[0] || null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Form Fields
  const [selectedStoppage, setSelectedStoppage] = useState<string>('');
  const [passengerName, setPassengerName] = useState<string>(currentUserName || '');
  const [passengerIdNo, setPassengerIdNo] = useState<string>(currentUserIdNo || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmed Booking / Pass View
  const [confirmedBooking, setConfirmedBooking] = useState<BusSeatBooking | null>(initialBooking);

  // Real-time synchronization: When conductor approves or rejects the booking,
  // automatically update confirmedBooking in real time and trigger approval chime!
  useEffect(() => {
    if (!confirmedBooking) return;
    const latest = seatBookings.find(
      b => b.id === confirmedBooking.id || (b.token_id && b.token_id === confirmedBooking.token_id)
    );
    if (latest && (latest.status !== confirmedBooking.status || latest.conductor_notes !== confirmedBooking.conductor_notes)) {
      if (confirmedBooking.status === 'pending' && latest.status === 'confirmed') {
        playNotificationChime('confirmed');
      }
      setConfirmedBooking(latest);
    }
  }, [seatBookings, confirmedBooking]);

  // Update selected trip when line or direction changes
  useEffect(() => {
    if (!initialBooking) {
      const newTrips = direction === 'to_campus' ? currentLine.inboundTrips : currentLine.outboundTrips;
      setSelectedTrip(newTrips[0] || null);
      setSelectedSeat(null);
    }
  }, [selectedBusId, direction]);

  // Update default stoppage when trip changes
  useEffect(() => {
    if (selectedTrip && selectedTrip.stoppages.length > 0) {
      setSelectedStoppage(selectedTrip.stoppages[0].name);
    }
  }, [selectedTrip]);

  // Sync profile data
  useEffect(() => {
    if (currentUserName && !passengerName) setPassengerName(currentUserName);
    if (currentUserIdNo && !passengerIdNo) setPassengerIdNo(currentUserIdNo);
  }, [currentUserName, currentUserIdNo]);

  // Bookings for the currently selected trip
  const getBookingsForTrip = (trip: BusTrip | null) => {
    if (!trip) return [];
    return seatBookings.filter(
      b =>
        b.bus_id === currentLine.id &&
        (b.bus_name.includes(trip.busNumber) || b.trip_slot === trip.departureTime) &&
        b.direction === direction &&
        b.status !== 'rejected'
    );
  };

  // Submit Reservation
  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !selectedSeat) {
      alert('Please pick a seat before confirming.');
      return;
    }

    const currentStoppageObj = selectedTrip.stoppages.find(s => s.name === selectedStoppage) || selectedTrip.stoppages[0];

    setIsSubmitting(true);
    try {
      const result = await onBookSeat({
        bus_id: currentLine.id,
        bus_name: selectedTrip.busName,
        direction,
        trip_slot: selectedTrip.departureTime,
        stoppage: currentStoppageObj.name,
        stoppage_time: currentStoppageObj.time,
        seat_number: selectedSeat,
        student_name: passengerName.trim() || currentUserName || 'Student',
        student_id: passengerIdNo.trim() || currentUserIdNo || 'GUB-STU',
        user_email: currentUserEmail || 'student@green.edu.bd',
        booking_date: new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        setStep('pass');
      } else {
        alert(result.message || 'Seat could not be booked. Please select another seat or try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err?.message || 'Error connecting to transit network.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-fullpage-wrapper animate-fade-in">
      {/* Top Breadcrumb & Control Bar */}
      <header className="ticket-top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)' }}
            title="Return to transit overview"
          >
            <ArrowLeft size={16} /> All Transit Routes
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${currentLine.badgeClass}`} style={{ fontSize: '0.78rem', fontWeight: 800 }}>
              {currentLine.shortName}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • 45 Seats Luxury Fleet
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onViewMyPasses}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            <Ticket size={15} /> My Bus Passes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%' }}
            title="Close Terminal"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Progress Stepper Bar (Dedicated full-width breadcrumb) */}
      <div className="ticket-stepper-container">
        <div className="ticket-stepper-steps">
          {/* Step 1 */}
          <button 
            type="button"
            className={`ticket-step-btn ${step === 'shift' ? 'active' : ''} ${step !== 'shift' ? 'completed' : ''}`}
            onClick={() => {
              if (step !== 'pass') setStep('shift');
            }}
          >
            <span className="step-num">{step !== 'shift' && step !== 'pass' ? '✓' : '1'}</span>
            <span className="step-label">1. Route & Shift</span>
          </button>

          <div className={`ticket-step-connector ${step !== 'shift' ? 'active' : ''}`} />

          {/* Step 2 */}
          <button 
            type="button"
            className={`ticket-step-btn ${step === 'seat' ? 'active' : ''} ${step === 'details' || step === 'pass' ? 'completed' : ''}`}
            onClick={() => {
              if (selectedTrip && step !== 'pass') setStep('seat');
            }}
            disabled={!selectedTrip}
          >
            <span className="step-num">{step === 'details' || step === 'pass' ? '✓' : '2'}</span>
            <span className="step-label">2. Select Seat</span>
          </button>

          <div className={`ticket-step-connector ${step === 'details' || step === 'pass' ? 'active' : ''}`} />

          {/* Step 3 */}
          <button 
            type="button"
            className={`ticket-step-btn ${step === 'details' ? 'active' : ''} ${step === 'pass' ? 'completed' : ''}`}
            onClick={() => {
              if (selectedSeat && step !== 'pass') setStep('details');
            }}
            disabled={!selectedSeat}
          >
            <span className="step-num">{step === 'pass' ? '✓' : '3'}</span>
            <span className="step-label">3. Boarding & Details</span>
          </button>

          <div className={`ticket-step-connector ${step === 'pass' ? 'active' : ''}`} />

          {/* Step 4 */}
          <button 
            type="button"
            className={`ticket-step-btn ${step === 'pass' ? 'active' : ''}`}
            disabled={!confirmedBooking}
          >
            <span className="step-num">4</span>
            <span className="step-label">
              {confirmedBooking?.status === 'confirmed' ? '4. Confirmed Pass' : '4. ⏳ Pending Pass'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Each Step Covers Full Screen Cleanly */}
      <main className="ticket-fullpage-content">
        {/* ===================================================================== */}
        {/* STEP 1: ROUTE, DIRECTION & BUS SHIFT SELECTION (FULL PAGE) */}
        {/* ===================================================================== */}
        {step === 'shift' && (
          <div className="ticket-page-section animate-fade-in">
            {/* Line Selection Switcher Pills */}
            <div className="ticket-line-selector-bar">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TRANSIT ROUTE:
              </span>
              <div className="ticket-line-pills">
                {Object.values(BUS_LINES).map(line => (
                  <button
                    key={line.id}
                    type="button"
                    className={`ticket-line-pill ${selectedBusId === line.id ? 'active' : ''}`}
                    onClick={() => setSelectedBusId(line.id)}
                    style={{
                      borderColor: selectedBusId === line.id ? line.themeColor : undefined,
                      background: selectedBusId === line.id ? line.btnGradient : undefined,
                      color: selectedBusId === line.id ? '#fff' : undefined
                    }}
                  >
                    <BusIcon size={15} />
                    <span>{line.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Line Route Info Banner */}
            <div className="glass-card" style={{
              padding: '1.5rem 1.75rem',
              background: currentLine.cardGradient,
              border: `1px solid ${currentLine.borderAccent}`,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}>
              <div>
                <span className={`badge ${currentLine.badgeClass}`} style={{ marginBottom: '0.35rem' }}>
                  {currentLine.name}
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
                  {currentLine.routeTitle}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.3rem', margin: 0 }}>
                  {currentLine.routePath}
                </p>
              </div>

              {/* Direction Switcher Toggle */}
              <div className="direction-pill-group" style={{ padding: '4px', maxWidth: '440px', width: '100%' }}>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'to_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('to_campus')}
                  style={{
                    background: direction === 'to_campus' ? currentLine.btnGradient : undefined,
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <Navigation size={14} /> To Campus (Inbound)
                </button>
                <button
                  type="button"
                  className={`direction-pill-btn ${direction === 'from_campus' ? 'active' : ''}`}
                  onClick={() => setDirection('from_campus')}
                  style={{
                    background: direction === 'from_campus' ? currentLine.btnGradient : undefined,
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <RotateCcw size={14} /> Return from Campus
                </button>
              </div>
            </div>

            {/* Shift Cards Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={19} color={currentLine.themeColor} />
                    Available Bus Shifts & Timetables
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                    Select your departure bus to choose an available passenger seat from the 45-seat cabin.
                  </p>
                </div>
                <span className="badge badge-emerald">
                  ✓ Daily Transit Operational
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {trips.map(trip => {
                  const bookedCount = getBookingsForTrip(trip).length;
                  const availableCount = Math.max(0, 45 - bookedCount);
                  const isSelected = selectedTrip?.id === trip.id;

                  return (
                    <div
                      key={trip.id}
                      className="glass-card"
                      style={{
                        padding: '1.75rem',
                        borderLeft: `5px solid ${currentLine.themeColor}`,
                        border: isSelected ? `2px solid ${currentLine.themeColor}` : undefined,
                        boxShadow: isSelected ? `0 8px 28px ${currentLine.themeColor}30` : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                      onClick={() => {
                        setSelectedTrip(trip);
                        setSelectedSeat(null);
                        setStep('seat');
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <span className={`badge ${currentLine.badgeClass}`} style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                              {trip.busNumber} • {trip.shiftTitle}
                            </span>
                            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                              {trip.busName}
                            </h4>
                          </div>

                          <div style={{
                            textAlign: 'right',
                            padding: '0.5rem 0.9rem',
                            background: `${currentLine.themeColor}18`,
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${currentLine.borderAccent}`
                          }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                              DEPARTS
                            </span>
                            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: currentLine.lightColor }}>
                              {trip.departureTime}
                            </span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                          {trip.desc}
                        </p>

                        {/* Scheduled Stoppage Route */}
                        <div style={{
                          background: 'var(--bg-input)',
                          padding: '0.9rem 1.1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          marginBottom: '1.25rem'
                        }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                            SCHEDULED TIMINGS & STOPS
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {trip.stoppages.map((s, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {idx === 0 ? '🚩' : idx === trip.stoppages.length - 1 ? '🏁' : '📍'} {s.name}
                                </span>
                                <span style={{ color: currentLine.lightColor, fontWeight: 700 }}>{s.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Capacity Bar */}
                        <div style={{ marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Live Seat Capacity</span>
                            <span style={{ fontWeight: 800, color: availableCount < 10 ? '#f59e0b' : 'var(--gub-green-light)' }}>
                              {availableCount} of 45 Seats Available
                            </span>
                          </div>
                          <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${(bookedCount / 45) * 100}%`,
                              background: currentLine.btnGradient,
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
                          background: currentLine.btnGradient,
                          padding: '0.85rem 1.25rem',
                          fontWeight: 800,
                          fontSize: '0.95rem'
                        }}
                      >
                        <Armchair size={17} /> Select Bus & Choose Seat <ArrowRight size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 2: FULL-PAGE 45-SEAT BUS CABIN RESERVATION */}
        {/* ===================================================================== */}
        {step === 'seat' && selectedTrip && (
          <div className="ticket-page-section animate-fade-in">
            {/* Header with quick back and summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStep('shift')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}
                >
                  <ArrowLeft size={15} /> Back to Shift Selection
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                  Select Your Passenger Seat (1 to 45)
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                  {selectedTrip.busName} • Departure @ <strong>{selectedTrip.departureTime}</strong> ({direction === 'to_campus' ? 'To Campus' : 'Return'})
                </p>
              </div>

              {selectedSeat ? (
                <div style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: `${currentLine.themeColor}20`,
                  border: `1.5px solid ${currentLine.themeColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <Armchair size={22} color={currentLine.lightColor} />
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                      SELECTED SEAT
                    </span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: currentLine.lightColor }}>
                      Seat #{selectedSeat}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  👆 Click any open green seat to select
                </div>
              )}
            </div>

            {/* Dedicated Full-Page Bus Cabin Layout */}
            <div className="glass-card" style={{ padding: '2rem 1.5rem', border: `1.5px solid ${currentLine.borderAccent}`, maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className={`badge ${currentLine.badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                  Green University Official Luxury Bus
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.35rem' }}>
                  45-Seat Air Conditioned Campus Express
                </h3>
              </div>

              {/* Full Cabin Map */}
              <BusSeatMap
                totalSeats={45}
                selectedSeat={selectedSeat}
                onSelectSeat={seatNo => setSelectedSeat(seatNo)}
                existingBookings={getBookingsForTrip(selectedTrip)}
                currentUserEmail={currentUserEmail}
                lineThemeColor={currentLine.themeColor}
                busLineName={selectedTrip.busName}
              />
            </div>

            {/* Step 2 Bottom Navigation Action Bar */}
            <div className="ticket-bottom-bar" style={{ marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep('shift')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.85rem 1.5rem' }}
              >
                <ArrowLeft size={16} /> Back to Shifts
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedSeat}
                onClick={() => setStep('details')}
                style={{
                  background: currentLine.btnGradient,
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  boxShadow: selectedSeat ? `0 6px 20px ${currentLine.themeColor}50` : undefined
                }}
              >
                {selectedSeat ? (
                  <>Continue with Seat #{selectedSeat} <ArrowRight size={18} /></>
                ) : (
                  <>Please Select a Seat to Continue</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 3: FULL-PAGE BOARDING STOPPAGE & PASSENGER INFORMATION */}
        {/* ===================================================================== */}
        {step === 'details' && selectedTrip && selectedSeat && (
          <form onSubmit={handleConfirmReservation} className="ticket-page-section animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setStep('seat')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}
              >
                <ArrowLeft size={15} /> Back to Seat Map
              </button>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>
                Passenger & Boarding Confirmation
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                Verify your personal credentials and select your scheduled pickup stoppage point.
              </p>
            </div>

            {/* Selected Booking Summary Preview */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              background: currentLine.cardGradient,
              border: `1.5px solid ${currentLine.borderAccent}`,
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  BUS ROUTE & NAME
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {selectedTrip.busName}
                </div>
                <span className={`badge ${currentLine.badgeClass}`} style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>
                  {currentLine.shortName}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  DIRECTION & TIME
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: currentLine.lightColor, marginTop: '0.15rem' }}>
                  {selectedTrip.departureTime}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {direction === 'to_campus' ? 'Mirpur/Terminal ➔ Campus' : 'Campus ➔ Terminal'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  RESERVED SEAT
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: currentLine.lightColor, marginTop: '0.1rem' }}>
                  Seat #{selectedSeat}
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Hourglass size={12} className="animate-pulse" /> Status: Pending Approval
                </span>
              </div>
            </div>

            {/* Form Fields: Stoppage + Passenger Info */}
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Stoppage Select */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color={currentLine.themeColor} />
                  Choose Your Boarding / Stoppage Location
                </label>
                <select
                  className="form-select"
                  value={selectedStoppage}
                  onChange={e => setSelectedStoppage(e.target.value)}
                  style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 600 }}
                  required
                >
                  {selectedTrip.stoppages.map((st, idx) => (
                    <option key={idx} value={st.name}>
                      {st.name} — Scheduled Arrival @ {st.time} ({st.desc})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  Please arrive at this stoppage at least 5 minutes before the scheduled time.
                </span>
              </div>

              {/* Passenger Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color={currentLine.themeColor} />
                  Passenger Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  placeholder="e.g. Ahmed Sizan"
                  style={{ padding: '0.8rem 1rem', fontSize: '0.92rem' }}
                  required
                />
              </div>

              {/* Student ID / Employee ID */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color={currentLine.themeColor} />
                  Student / Employee ID Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={passengerIdNo}
                  onChange={e => setPassengerIdNo(e.target.value)}
                  placeholder="e.g. 221002001"
                  style={{ padding: '0.8rem 1rem', fontSize: '0.92rem' }}
                  required
                />
              </div>

              {/* Transit Subsidy Notice */}
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--gub-green-light)', display: 'block' }}>
                    Green University Transit Fare: 0 BDT (Free)
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Fully covered by University Student Transport Subsidy.
                  </span>
                </div>
                <span className="badge badge-emerald" style={{ fontWeight: 800, fontSize: '0.8rem' }}>
                  100% SUBSIDIZED
                </span>
              </div>

              {/* Real-time Pending Notice Box */}
              <div style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1.5px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Hourglass size={20} color="#f59e0b" className="animate-pulse" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>⏳ Booking Status: PENDING (পেন্ডিং অনুমোদন মোড)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    নিচের বাটনে ক্লিক করলে আপনার সিটটি <strong>পেন্ডিং (Pending)</strong> হিসেবে বুক হবে এবং সাথে সাথে বাস কন্ডাক্টরের কাছে নোটিফিকেশন যাবে। কন্ডাক্টর গ্রহণ (Accept) করলে সাথে সাথে আপনার টিকিটটি কনফার্মড হয়ে যাবে।
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="ticket-bottom-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep('seat')}
                style={{ padding: '0.85rem 1.5rem' }}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} /> Change Seat
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #b45309 100%)',
                  padding: '0.9rem 2.25rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Hourglass size={18} style={{ animation: 'spin 2s linear infinite' }} /> Submitting Pending Request...
                  </>
                ) : (
                  <>
                    <Hourglass size={18} /> Book Seat #{selectedSeat} (Pending Approval / পেন্ডিং বুকিং)
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* STEP 4: FULL-PAGE DIGITAL BOARDING PASS & LIVE TOKEN */}
        {/* ===================================================================== */}
        {step === 'pass' && confirmedBooking && (
          <div className="ticket-page-section animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: confirmedBooking.status === 'confirmed'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : confirmedBooking.status === 'rejected'
                  ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: confirmedBooking.status === 'confirmed'
                  ? '0 8px 24px rgba(16, 185, 129, 0.4)'
                  : confirmedBooking.status === 'rejected'
                  ? '0 8px 24px rgba(239, 68, 68, 0.4)'
                  : '0 8px 24px rgba(245, 158, 11, 0.4)',
                marginBottom: '0.75rem'
              }}>
                {confirmedBooking.status === 'confirmed' ? (
                  <CheckCircle2 size={34} />
                ) : confirmedBooking.status === 'rejected' ? (
                  <AlertOctagon size={34} />
                ) : (
                  <Hourglass size={34} style={{ animation: 'spin 4s linear infinite' }} />
                )}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                {confirmedBooking.status === 'confirmed' 
                  ? 'Seat Reservation Confirmed!' 
                  : confirmedBooking.status === 'rejected' 
                  ? 'Reservation Declined' 
                  : 'Reservation Submitted (Pending Approval)'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {confirmedBooking.status === 'confirmed' 
                  ? 'Your digital bus boarding pass is officially verified and ready for boarding.' 
                  : confirmedBooking.status === 'rejected' 
                  ? 'Your seat request was declined by the conductor. You can choose another seat or schedule.' 
                  : 'Your seat request has been transmitted to the Bus Conductor in real time. Please wait while the conductor verifies and accepts it.'}
              </p>
            </div>

            {/* Real-Time Live Status Indicator Banner */}
            {confirmedBooking.status === 'pending' && (
              <div style={{
                marginBottom: '1.25rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 12px #f59e0b',
                  flexShrink: 0
                }} className="animate-pulse" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🔴 Live Conductor Sync Active</span>
                    <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 500 }}>(Awaiting Approval)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    The Bus Conductor has received your request. As soon as the conductor accepts, this pass will instantly turn green and chime automatically!
                  </div>
                </div>
              </div>
            )}

            {confirmedBooking.status === 'confirmed' && (
              <div style={{
                marginBottom: '1.25rem',
                padding: '0.9rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid rgba(16, 185, 129, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle size={20} color="#10b981" />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981', display: 'block' }}>
                    ✓ Approved & Confirmed in Real Time
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Your seat is officially secured. Show your Token #{confirmedBooking.token_id || confirmedBooking.id.slice(0, 8)} to the conductor when boarding.
                  </span>
                </div>
              </div>
            )}

            {/* The Digital Boarding Pass Ticket Card */}
            <div className="boarding-pass-card" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
              <div className="boarding-pass-notch-left" />
              <div className="boarding-pass-notch-right" />

              {/* Pass Header */}
              <div style={{
                background: confirmedBooking.status === 'rejected'
                  ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                  : confirmedBooking.status === 'confirmed'
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)'
                  : 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #b45309 100%)',
                padding: '1.75rem',
                color: '#ffffff',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BusIcon size={20} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Green University Transit
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700 }}>
                    {confirmedBooking.status === 'confirmed' ? 'OFFICIAL E-TICKET' : 'REQUEST TOKEN PASS'}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>
                  {confirmedBooking.bus_name}
                </h2>
                <p style={{ fontSize: '0.84rem', opacity: 0.9, marginTop: '0.2rem', margin: 0 }}>
                  {confirmedBooking.direction === 'to_campus' ? 'Inbound to Campus (Mirpur/Uttara ➔ GUB)' : 'Outbound Return from Campus'}
                </p>
              </div>

              {/* Status Bar */}
              <div style={{
                padding: '0.85rem 1.5rem',
                background: confirmedBooking.status === 'confirmed'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : confirmedBooking.status === 'rejected'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(245, 158, 11, 0.18)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {confirmedBooking.status === 'confirmed' ? (
                    <CheckCircle size={18} color="#10b981" />
                  ) : confirmedBooking.status === 'rejected' ? (
                    <AlertOctagon size={18} color="#ef4444" />
                  ) : (
                    <Hourglass size={18} color="#f59e0b" className="animate-pulse" />
                  )}
                  <span style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: confirmedBooking.status === 'confirmed' ? '#10b981' : confirmedBooking.status === 'rejected' ? '#ef4444' : '#f59e0b'
                  }}>
                    {confirmedBooking.status === 'confirmed' 
                      ? '✓ Approved by Bus Conductor' 
                      : confirmedBooking.status === 'rejected' 
                      ? '✕ Request Declined' 
                      : '⏳ Pending Conductor Approval'}
                  </span>
                </div>
                <span className={confirmedBooking.status === 'confirmed' ? 'badge badge-emerald' : confirmedBooking.status === 'rejected' ? 'badge badge-slate' : 'badge badge-amber'} style={{ fontSize: '0.72rem' }}>
                  {confirmedBooking.status === 'confirmed' ? 'Ready to Board' : confirmedBooking.status === 'rejected' ? 'Declined' : 'Pending'}
                </span>
              </div>

              {/* Body Details */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Seat & Token ID Box */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-input)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      RESERVED SEAT
                    </span>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gub-green-light)', lineHeight: 1.1 }}>
                      #{confirmedBooking.seat_number}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      UNIQUE TOKEN ID
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--gub-green-light)', fontFamily: 'var(--font-mono)' }}>
                      #{confirmedBooking.token_id || confirmedBooking.id.toUpperCase().slice(0, 8)}
                    </div>
                  </div>
                </div>

                {/* Passenger Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={13} /> PASSENGER NAME
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      {confirmedBooking.student_name}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldCheck size={13} /> STUDENT / ID NO
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      {confirmedBooking.student_id || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Stoppage & Timing */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} color="var(--gub-green)" /> BOARDING STOP
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      {confirmedBooking.stoppage}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={13} color="var(--gub-cyan)" /> DEPARTURE TIME
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--gub-green-light)', marginTop: '0.15rem' }}>
                      {confirmedBooking.stoppage_time || confirmedBooking.trip_slot}
                    </div>
                  </div>
                </div>

                {/* Travel Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} /> Travel Date: <strong style={{ color: 'var(--text-primary)' }}>{confirmedBooking.booking_date}</strong>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                    STUDENT SUBSIDY: FREE
                  </span>
                </div>

                {/* Barcode Strip */}
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <div className="barcode-strip">
                    {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4].map((w, idx) => (
                      <div 
                        key={idx} 
                        className="barcode-bar" 
                        style={{ width: `${w * 1.6}px`, opacity: idx % 4 === 0 ? 0.9 : 1 }} 
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.4rem', display: 'block' }}>
                    SHOW TOKEN #{confirmedBooking.token_id || confirmedBooking.id.slice(0, 8)} TO CONDUCTOR
                  </span>
                </div>

                {/* Ticket Actions */}
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    onClick={handlePrint}
                    style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
                  >
                    <Printer size={16} /> Print / Save PDF
                  </button>

                  {onCancelBooking && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this reserved seat request?')) {
                          onCancelBooking(confirmedBooking.id);
                          onClose();
                        }
                      }}
                      style={{ borderColor: 'var(--gub-rose)', color: 'var(--gub-rose)', padding: '0.75rem' }}
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Post-Booking Full Page Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} /> Back to Transit Overview
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={onViewMyPasses}
                style={{ padding: '0.85rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
              >
                <Ticket size={16} /> View All My Passes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
