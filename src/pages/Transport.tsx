import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bus, BusStatus } from '../types';
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
  ArrowRight
} from 'lucide-react';

export const Transport: React.FC = () => {
  const { buses, loadingBuses } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | BusStatus>('all');

  const filteredBuses = buses.filter(bus => {
    const matchesStatus = selectedStatus === 'all' || bus.status === selectedStatus;
    const matchesSearch = 
      bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.current_location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        <span className="inactive-dot" style={{ width: '7px', height: '7px' }} /> In Workshop
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">University Transport Tracker</h1>
          <p className="page-subtitle">Real-time GPS tracking, arrival estimates, and departure schedules for GUB campus shuttles</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span className="live-pulse-dot" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gub-green-light)' }}>
            GPS Telemetry Sync Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button
            className={`filter-tab-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            All Buses ({buses.length})
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
            ⚪ Depot ({buses.filter(b => b.status === 'inactive').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search route or stop..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Bus Cards Grid */}
      {filteredBuses.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BusIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No buses match criteria</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Check other routes or clear your search term.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredBuses.map(bus => (
            <div
              key={bus.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${bus.status === 'active' ? '#10b981' : bus.status === 'delayed' ? '#f59e0b' : '#64748b'}`
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      GUB Transit Fleet
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
                    <Calendar size={13} /> DAILY DEPARTURE TIMINGS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {bus.schedule.map((time, idx) => (
                      <span key={idx} className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Green University Purbachal Campus
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gub-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Live Tracking <Compass size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
