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
  lineThemeColor?: string;
  busLineName?: string;
}

export const BusSeatMap: React.FC<BusSeatMapProps> = ({
  totalSeats = 45,
  selectedSeat,
  onSelectSeat,
  existingBookings,
  currentUserEmail,
  disabled = false,
  lineThemeColor = '#10b981',
  busLineName = 'Green University Express'
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
    let title = `Seat #${seatNumber} • Available`;

    if (isMine) {
      seatClass += ' seat-mine';
      title = `Seat #${seatNumber} • Reserved by You (${booking.student_name})`;
    } else if (isBooked) {
      seatClass += ' seat-occupied';
      title = `Seat #${seatNumber} • Occupied (${booking.student_name})`;
    } else if (isSelected) {
      seatClass += ' seat-selected';
      title = `Seat #${seatNumber} • Selected`;
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
        style={{
          position: 'relative',
          borderColor: isSelected ? lineThemeColor : undefined,
          boxShadow: isSelected ? `0 0 16px ${lineThemeColor}80` : undefined,
          background: isSelected ? lineThemeColor : undefined
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 800, lineHeight: 1 }}>{seatNumber}</span>
        {isMine ? (
          <span style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>YOU</span>
        ) : isBooked ? (
          <span style={{ fontSize: '0.5rem', opacity: 0.8, marginTop: '2px' }}>BUSY</span>
        ) : isSelected ? (
          <span style={{ fontSize: '0.55rem', fontWeight: 800, marginTop: '2px' }}>✓</span>
        ) : (
          <span style={{ fontSize: '0.52rem', opacity: 0.6, marginTop: '2px' }}>FREE</span>
        )}
      </button>
    );
  };

  const availableCount = totalSeats - existingBookings.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      {/* Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.25rem',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid rgba(16, 185, 129, 0.6)' }} />
          <span>Available ({Math.max(0, availableCount)})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: lineThemeColor, border: `1.5px solid ${lineThemeColor}` }} />
          <span>Selected ({selectedSeat ? `#${selectedSeat}` : 'None'})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(244, 63, 94, 0.2)', border: '1.5px solid rgba(244, 63, 94, 0.5)' }} />
          <span>Booked ({existingBookings.length})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: '1.5px solid #a78bfa' }} />
          <span>Your Seat</span>
        </div>
      </div>

      {/* Bus Cabin Visual Frame */}
      <div className="bus-cabin-frame" style={{ width: '100%', borderColor: `${lineThemeColor}40` }}>
        {/* Windshield */}
        <div className="bus-windshield" style={{ background: `linear-gradient(180deg, ${lineThemeColor}20 0%, rgba(255,255,255,0.02) 100%)` }}>
          <Compass size={13} color={lineThemeColor} style={{ marginRight: '5px' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            FRONT WINDSHIELD • {busLineName.toUpperCase()}
          </span>
        </div>

        {/* Driver Cabin & Entrance Door */}
        <div className="bus-driver-row">
          {/* Driver Seat & Steering */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Disc size={18} color="var(--text-muted)" style={{ animation: 'spin 12s linear infinite' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>Driver Cabin</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>GUB Official Fleet</div>
            </div>
          </div>

          {/* Passenger Entrance */}
          <div style={{ textAlign: 'right', background: `${lineThemeColor}15`, padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${lineThemeColor}40` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: lineThemeColor }}>
              🚪 Passenger Door
            </span>
          </div>
        </div>

        {/* 45 Seats Container */}
        <div className="bus-seats-container">
          {standardRows.map(row => (
            <div key={row.rowNum} className="bus-seat-row-4">
              {/* Left 2 Seats */}
              {row.left.map(seatNo => renderSeat(seatNo))}

              {/* Central Aisle */}
              <div className="bus-aisle-label" style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700 }}>
                R{row.rowNum}
              </div>

              {/* Right 2 Seats */}
              {row.right.map(seatNo => renderSeat(seatNo))}
            </div>
          ))}

          {/* Back Row (5 seats: 41 - 45) */}
          {backRow.length > 0 && (
            <div className="bus-seat-row-5">
              {backRow.map(seatNo => renderSeat(seatNo))}
            </div>
          )}
        </div>

        {/* Bus Tail Indicator */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          REAR EMERGENCY EXIT • 45 SEATS LUXURY SHUTTLE
        </div>
      </div>
    </div>
  );
};

