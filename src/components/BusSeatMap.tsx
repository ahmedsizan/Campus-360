import React from 'react';
import { BusSeatBooking } from '../types';
import { ShieldCheck, User, Disc, Compass } from 'lucide-react';

interface BusSeatMapProps {
  totalSeats?: number;
  selectedSeat: number | null;
  onSelectSeat: (seatNumber: number) => void;
  existingBookings: BusSeatBooking[];
  currentUserEmail?: string;
  disabled?: boolean;
}

export const BusSeatMap: React.FC<BusSeatMapProps> = ({
  totalSeats = 45,
  selectedSeat,
  onSelectSeat,
  existingBookings,
  currentUserEmail,
  disabled = false
}) => {
  // Map of booked seat numbers -> booking details
  const bookingsMap = React.useMemo(() => {
    const map = new Map<number, BusSeatBooking>();
    existingBookings.forEach(b => {
      map.set(b.seat_number, b);
    });
    return map;
  }, [existingBookings]);

  // Generate 10 standard rows of 4 seats (40 seats)
  const standardRows = Array.from({ length: 10 }, (_, rowIdx) => {
    const startNum = rowIdx * 4 + 1;
    return {
      rowNum: rowIdx + 1,
      left: [startNum, startNum + 1],
      right: [startNum + 2, startNum + 3]
    };
  });

  // Back row of 5 seats (Seats 41, 42, 43, 44, 45)
  const backRow = [41, 42, 43, 44, 45].filter(s => s <= totalSeats);

  const renderSeat = (seatNumber: number) => {
    const booking = bookingsMap.get(seatNumber);
    const isBooked = !!booking;
    const isMine = isBooked && currentUserEmail && booking.user_email.toLowerCase() === currentUserEmail.toLowerCase();
    const isSelected = selectedSeat === seatNumber;

    let seatClass = 'bus-seat-btn';
    let label = `${seatNumber}`;
    let title = `Seat #${seatNumber} - Available`;

    if (isMine) {
      seatClass += ' seat-mine';
      title = `Seat #${seatNumber} - Reserved by You (${booking.student_name})`;
    } else if (isBooked) {
      seatClass += ' seat-occupied';
      title = `Seat #${seatNumber} - Reserved by ${booking.student_name} (${booking.stoppage})`;
    } else if (isSelected) {
      seatClass += ' seat-selected';
      title = `Seat #${seatNumber} - Selected`;
    } else {
      seatClass += ' seat-available';
    }

    return (
      <button
        key={seatNumber}
        type="button"
        className={seatClass}
        onClick={() => {
          if (!isBooked && !disabled) {
            onSelectSeat(seatNumber);
          }
        }}
        disabled={disabled || (isBooked && !isMine)}
        title={title}
        aria-label={title}
      >
        <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>{seatNumber}</span>
        {isMine && <span style={{ fontSize: '0.55rem', opacity: 0.9 }}>YOU</span>}
      </button>
    );
  };

  const availableCount = totalSeats - existingBookings.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Seat Stats Indicator */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.25rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.6)' }} />
          Available ({Math.max(0, availableCount)})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--gub-green)' }} />
          Selected ({selectedSeat ? `#${selectedSeat}` : 'None'})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(244, 63, 94, 0.3)', border: '1px solid rgba(244, 63, 94, 0.6)' }} />
          Booked ({existingBookings.length})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }} />
          Your Seat
        </div>
      </div>

      {/* Bus Cabin Visual Frame */}
      <div className="bus-cabin-frame" style={{ width: '100%' }}>
        {/* Windshield */}
        <div className="bus-windshield">
          <Compass size={13} style={{ marginRight: '5px' }} /> FRONT WINDSHIELD • GREEN LINE 2
        </div>

        {/* Driver Cabin & Entrance Door */}
        <div className="bus-driver-row">
          {/* Driver Seat & Steering */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Disc size={18} color="var(--text-muted)" style={{ animation: 'spin 12s linear infinite' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>Driver Cabin</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>GUB Transport</div>
            </div>
          </div>

          {/* Passenger Entrance */}
          <div style={{ textAlign: 'right', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--gub-green-light)' }}>
              🚪 Passenger Door
            </span>
          </div>
        </div>

        {/* 45 Seats Container */}
        <div className="bus-seats-container">
          {standardRows.map(row => (
            <div key={row.rowNum} className="bus-seat-row-4">
              {/* Left 2 Seats (Window + Aisle) */}
              {row.left.map(seatNo => renderSeat(seatNo))}

              {/* Central Aisle */}
              <div className="bus-aisle-label">
                R{row.rowNum}
              </div>

              {/* Right 2 Seats (Aisle + Window) */}
              {row.right.map(seatNo => renderSeat(seatNo))}
            </div>
          ))}

          {/* Back Row (5 seats across: 41 - 45) */}
          {backRow.length > 0 && (
            <div className="bus-seat-row-5">
              {backRow.map(seatNo => renderSeat(seatNo))}
            </div>
          )}
        </div>

        {/* Bus Tail Indicator */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          REAR EMERGENCY EXIT • 45 SEATER LUXURY COACH
        </div>
      </div>
    </div>
  );
};
