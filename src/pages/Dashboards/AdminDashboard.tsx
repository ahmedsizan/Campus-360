import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Bus, 
  AlertCircle, 
  Utensils, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  MessageSquareQuote,
  Send,
  Sparkles
} from 'lucide-react';
import { Modal } from '../../components/Modal';
import { BusStatus, ComplaintCategory, ComplaintStatus, NoticeCategory } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { 
    notices, 
    addNotice, 
    buses, 
    updateBusStatus, 
    complaints, 
    submitAdminFeedback, 
    foodItems,
    setActiveTab 
  } = useApp();

  // Create Notice Modal
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('academic');
  const [noticeAuthor, setNoticeAuthor] = useState('Office of the Registrar');
  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Manage Bus Modal
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [busLocation, setBusLocation] = useState('');
  const [busEta, setBusEta] = useState('');
  const [busStatus, setBusStatus] = useState<BusStatus>('active');

  // Reply Complaint Modal
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [complaintNewStatus, setComplaintNewStatus] = useState<ComplaintStatus>('resolved');

  const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'under_review');

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    setSubmittingNotice(true);
    await addNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      author: noticeAuthor,
      date: new Date().toISOString().split('T')[0]
    });
    setSubmittingNotice(false);
    setIsNoticeModalOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusId) return;
    await updateBusStatus(selectedBusId, busStatus, busLocation, busEta);
    setSelectedBusId(null);
  };

  const handleReplyComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaintId || !adminReply) return;
    await submitAdminFeedback(activeComplaintId, adminReply, complaintNewStatus);
    setActiveComplaintId(null);
    setAdminReply('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={profile?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'}
            alt={profile?.name}
            className="avatar-circle"
            style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-purple)', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Administration
              </span>
              <span className="badge badge-purple">Superuser Access</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Campus Operations Control</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Logged in as {profile?.name} • Green University of Bangladesh (Purbachal Campus)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setIsNoticeModalOpen(true)}>
            <Plus size={18} /> Publish New Notice
          </button>
        </div>
      </div>

      {/* Admin Central Metrics */}
      <div className="grid-stats">
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Students</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>4,820 Active</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bus size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bus Fleet Active</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{buses.filter(b => b.status === 'active').length} / {buses.length} Routes</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Complaints</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: pendingComplaints.length > 0 ? '#fb7185' : 'inherit' }}>
              {pendingComplaints.length} Grievances
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cafeteria Catalog</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{foodItems.length} Food Items</div>
          </div>
        </div>
      </div>

      {/* Fleet Schedule Controller */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Bus Fleet Route Controller</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage shuttle bus routes, shifts, and operating statuses</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {buses.map(bus => (
            <div key={bus.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{bus.name}</h4>
                <span className={`badge ${bus.status === 'active' ? 'badge-emerald' : bus.status === 'delayed' ? 'badge-amber' : 'badge-slate'}`}>
                  {bus.status === 'active' ? 'Operational' : bus.status === 'delayed' ? 'Delayed' : 'In Workshop'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{bus.route}</p>
              <div style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                <strong>Terminal:</strong> {bus.current_location} • <strong>Shift:</strong> {bus.eta}
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%' }}
                onClick={() => {
                  setSelectedBusId(bus.id);
                  setBusLocation(bus.current_location);
                  setBusEta(bus.eta);
                  setBusStatus(bus.status);
                }}
              >
                Edit Route Status
              </button>
            </div>
          ))}
        </div>
      </div>


      {/* Pending Grievances Management Desk */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Grievance Redressal Desk</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Review reported issues and provide official administrative responses</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('complaints')}>
            All Complaints <ArrowRight size={14} />
          </button>
        </div>

        {complaints.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No complaints filed.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(comp => (
              <div key={comp.id} style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="badge badge-purple">{comp.category}</span>
                      <span className={`badge ${comp.status === 'resolved' ? 'badge-emerald' : comp.status === 'under_review' ? 'badge-amber' : 'badge-rose'}`}>
                        {comp.status.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.date}</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{comp.title}</h4>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setActiveComplaintId(comp.id);
                      setAdminReply(comp.admin_feedback || '');
                      setComplaintNewStatus(comp.status);
                    }}
                  >
                    <MessageSquareQuote size={15} /> Respond / Resolve
                  </button>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {comp.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                  <span>Reported by: <strong>{comp.is_anonymous ? 'Anonymous Student' : `${comp.reported_by} (${comp.reported_by_email})`}</strong></span>
                </div>

                {comp.admin_feedback && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gub-green)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gub-green-light)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Official Admin Feedback
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{comp.admin_feedback}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Publish Official University Notice"
        subtitle="This circular will be instantly broadcasted to all students and faculty"
      >
        <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notice Headline / Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Summer 2026 Semester Registration Schedule" 
              value={noticeTitle}
              onChange={e => setNoticeTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select 
              className="form-select" 
              value={noticeCategory}
              onChange={e => setNoticeCategory(e.target.value as NoticeCategory)}
            >
              <option value="academic">Academic Notice</option>
              <option value="administrative">Administrative Notice</option>
              <option value="events">University Events & Contests</option>
              <option value="sports">Sports & Clubs</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Publishing Authority / Author</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Office of the Registrar" 
              value={noticeAuthor}
              onChange={e => setNoticeAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notice Full Body / Details</label>
            <textarea 
              className="form-textarea" 
              rows={4}
              placeholder="Write the full announcement details here..."
              value={noticeContent}
              onChange={e => setNoticeContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsNoticeModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingNotice}>
              {submittingNotice ? 'Publishing...' : <><Send size={16} /> Broadcast Notice</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Bus Modal */}
      <Modal
        isOpen={!!selectedBusId}
        onClose={() => setSelectedBusId(null)}
        title="Update Bus Route & Shift Details"
        subtitle="Manage official shuttle bus schedule and route statuses"
      >
        <form onSubmit={handleUpdateBus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Operating Status</label>
            <select 
              className="form-select" 
              value={busStatus}
              onChange={e => setBusStatus(e.target.value as BusStatus)}
            >
              <option value="active">Operational (In Service)</option>
              <option value="delayed">Delayed Schedule</option>
              <option value="inactive">In Stand / Workshop</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Starting Terminal / Base</label>
            <input 
              type="text" 
              className="form-input" 
              value={busLocation}
              onChange={e => setBusLocation(e.target.value)}
              placeholder="e.g. Uttara House Building Terminal"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Departure Shifts / Timetable</label>
            <input 
              type="text" 
              className="form-input" 
              value={busEta}
              onChange={e => setBusEta(e.target.value)}
              placeholder="e.g. 07:30 AM Shift or 01:45 PM Return"
              required
            />
          </div>


          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedBusId(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save & Broadcast
            </button>
          </div>
        </form>
      </Modal>

      {/* Reply Complaint Modal */}
      <Modal
        isOpen={!!activeComplaintId}
        onClose={() => setActiveComplaintId(null)}
        title="Submit Admin Feedback & Change Status"
        subtitle="Provide official resolution update for this grievance"
      >
        <form onSubmit={handleReplyComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">New Status</label>
            <select 
              className="form-select" 
              value={complaintNewStatus}
              onChange={e => setComplaintNewStatus(e.target.value as ComplaintStatus)}
            >
              <option value="pending">Pending</option>
              <option value="under_review">Under Review (Investigation in progress)</option>
              <option value="resolved">Resolved (Action completed)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Administrative Feedback / Response</label>
            <textarea 
              className="form-textarea" 
              rows={4}
              placeholder="State the resolution details or team actions taken..."
              value={adminReply}
              onChange={e => setAdminReply(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveComplaintId(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Send Official Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
