import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  Calendar, 
  MapPin, 
  Bell, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { notices, setActiveTab } = useApp();

  const teacherSchedule = [
    { code: 'CSE 411', title: 'Distributed Systems & Cloud Computing', section: 'Sec A (60 Students)', time: '08:30 AM - 10:00 AM', room: 'Building A, Room 402', status: 'Completed' },
    { code: 'CSE 323', title: 'Operating Systems & Concurrency', section: 'Sec B (45 Students)', time: '11:30 AM - 01:00 PM', room: 'Software Lab 3, 5th Floor', status: 'Ongoing' },
    { code: 'CSE 499', title: 'Senior Capstone Project Supervision', section: 'Team Alpha & Beta', time: '03:00 PM - 04:30 PM', room: 'Faculty Lounge Room 302', status: 'Upcoming' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Faculty Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={profile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
            alt={profile?.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-cyan)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--gub-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Faculty Portal
              </span>
              <span className="badge badge-cyan">Faculty ID: {profile?.id_no || 'FAC-8891'}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, {profile?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {profile?.department} • Office Hours: {profile?.office_hours || 'Sun & Tue: 10:00 AM - 1:00 PM'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('notices')}>
            <Bell size={18} /> View Circulars
          </button>
        </div>
      </div>

      {/* Faculty Metrics */}
      <div className="grid-stats">
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Courses</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>3 Sections</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Students</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>128 Enrolled</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Consultation Hours</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>6.0 hrs/wk</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Grades Submitted</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>Midterm Ready</div>
          </div>
        </div>
      </div>

      {/* Today's Lecture Schedule */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Today's Teaching Schedule</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classrooms, labs, and student consultation slots</p>
          </div>
          <span className="badge badge-emerald">Spring/Summer 2026</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {teacherSchedule.map((item, idx) => (
            <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-cyan">{item.code}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.section}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {item.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {item.room}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${item.status === 'Completed' ? 'badge-slate' : item.status === 'Ongoing' ? 'badge-emerald' : 'badge-amber'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
