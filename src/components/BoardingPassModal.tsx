import React from 'react';
import { BusSeatBooking } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Bus as BusIcon, 
  ShieldCheck, 
  Printer,
  Trash2,
  CheckCircle,
  Hourglass,
  AlertOctagon
} from 'lucide-react';

interface BoardingPassModalProps {
  booking: BusSeatBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking?: (id: string) => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelBooking
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = booking.status === 'confirmed';
  const isRejected = booking.status === 'rejected';
  const isPending = !booking.status || booking.status === 'pending';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px', padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="boarding-pass-card">
          {/* Top Notch Indicators */}
          <div className="boarding-pass-notch-left" />
          <div className="boarding-pass-notch-right" />

          {/* Header */}
          <div style={{
            background: isRejected 
              ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
              : isPending 
              ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
            padding: '1.5rem',
            color: '#ffffff',
            position: 'relative'
          }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.25)',
                border: 'none',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <BusIcon size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                GUB Digital Boarding Pass
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{booking.bus_name}</h2>
            <p style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '0.2rem' }}>
              {booking.direction === 'to_campus' ? 'To Campus (Inbound)' : 'From Campus (Return)'}
            </p>
          </div>

          {/* Status Bar */}
          <div style={{
            padding: '0.75rem 1.25rem',
            background: isConfirmed ? 'rgba(16, 185, 129, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.15)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {isConfirmed ? (
                <CheckCircle size={16} color="#10b981" />
              ) : isRejected ? (
                <AlertOctagon size={16} color="#ef4444" />
              ) : (
                <Hourglass size={16} color="#f59e0b" />
              )}
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: isConfirmed ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b'
              }}>
                {isConfirmed ? '✓ Approved by Bus Conductor' : isRejected ? '✕ Request Declined' : '⏳ Pending Conductor Approval'}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isConfirmed ? 'Ready to Board' : isRejected ? 'Cancelled' : 'In Queue'}
            </span>
          </div>

          {/* Body Details */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Seat & Pass Code Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.85rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  RESERVED SEAT
                </span>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: isConfirmed ? 'var(--gub-green-light)' : 'var(--gub-gold)' }}>
                  #{booking.seat_number}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  UNIQUE TOKEN ID
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--gub-green-light)', fontFamily: 'var(--font-mono)' }}>
                  {booking.token_id || booking.id.toUpperCase().slice(0, 12)}
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} /> PASSENGER NAME
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {booking.student_name}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> STUDENT / ID NO
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {booking.student_id || 'N/A'}
                </div>
              </div>
            </div>

            {/* Stoppage & Timing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} color="var(--gub-green)" /> BOARDING STOPPAGE
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {booking.stoppage}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} color="var(--gub-cyan)" /> DEPARTURE TIME
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gub-green-light)', marginTop: '0.15rem' }}>
                  {booking.stoppage_time}
                </div>
              </div>
            </div>

            {/* Travel Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} /> Valid Date: <strong style={{ color: 'var(--text-primary)' }}>{booking.booking_date}</strong>
              </div>
              <span className={`badge ${isConfirmed ? 'badge-emerald' : isRejected ? 'badge-slate' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                {isConfirmed ? '✓ Approved' : isRejected ? 'Declined' : 'Pending'}
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.3rem', display: 'block' }}>
                {isConfirmed ? `SHOW TOKEN #${booking.token_id || booking.id.slice(0, 8)} TO CONDUCTOR` : `TOKEN: ${booking.token_id || booking.id.slice(0, 8)} • AWAITING CONDUCTOR`}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handlePrint}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Printer size={15} /> Print / Save
              </button>

              {onCancelBooking && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this reserved seat request?')) {
                      onCancelBooking(booking.id);
                      onClose();
                    }
                  }}
                  style={{ borderColor: 'var(--gub-rose)', color: 'var(--gub-rose)' }}
                >
                  <Trash2 size={15} /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
