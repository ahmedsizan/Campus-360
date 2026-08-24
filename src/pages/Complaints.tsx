import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintCategory, ComplaintStatus } from '../types';
import { 
  AlertCircle, 
  Plus, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  UserX, 
  MessageSquareQuote,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const Complaints: React.FC = () => {
  const { complaints, submitComplaint, submitAdminFeedback } = useApp();
  const { profile } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<'all' | ComplaintCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');

  // Submit Complaint Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('facilities');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Admin Reply Modal
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyFeedback, setReplyFeedback] = useState('');
  const [replyStatus, setReplyStatus] = useState<ComplaintStatus>('resolved');

  const filteredComplaints = complaints.filter(c => {
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    await submitComplaint({
      title,
      description,
      category,
      status: 'pending',
      is_anonymous: isAnonymous,
      date: new Date().toISOString().split('T')[0],
      reported_by: isAnonymous ? 'Anonymous Student' : (profile?.name || 'Student'),
      reported_by_email: isAnonymous ? 'anonymous@green.edu.bd' : (profile?.email || 'student@green.edu.bd')
    });
    setSubmitting(false);
    setIsSubmitModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleAdminFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyId || !replyFeedback) return;
    await submitAdminFeedback(activeReplyId, replyFeedback, replyStatus);
    setActiveReplyId(null);
    setReplyFeedback('');
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'resolved':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Resolved</span>;
      case 'under_review':
        return <span className="badge badge-amber"><Clock size={12} /> Under Review</span>;
      default:
        return <span className="badge badge-rose"><AlertCircle size={12} /> Pending</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">Campus Grievance & Complaint Redressal</h1>
          <p className="page-subtitle">Submit concerns regarding campus facilities, IT networks, academic issues, or transport</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsSubmitModalOpen(true)}>
          <Plus size={18} /> File a Grievance
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button
            className={`filter-tab-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          <button
            className={`filter-tab-btn ${categoryFilter === 'facilities' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('facilities')}
          >
            🏢 Facilities & Campus
          </button>
          <button
            className={`filter-tab-btn ${categoryFilter === 'it' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('it')}
          >
            💻 IT & WiFi
          </button>
          <button
            className={`filter-tab-btn ${categoryFilter === 'academic' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('academic')}
          >
            📚 Academic
          </button>
          <button
            className={`filter-tab-btn ${categoryFilter === 'transport' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('transport')}
          >
            🚌 Transport
          </button>
          <button
            className={`filter-tab-btn ${categoryFilter === 'cafeteria' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('cafeteria')}
          >
            ☕ Cafeteria
          </button>
        </div>
      </div>

      {/* Complaints Feed */}
      {filteredComplaints.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <ShieldAlert size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No grievances found in this category</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            All campus issues here are resolved or no complaint has been logged.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredComplaints.map(comp => (
            <div
              key={comp.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderLeft: `4px solid ${comp.status === 'resolved' ? '#10b981' : comp.status === 'under_review' ? '#f59e0b' : '#f43f5e'}`
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {comp.category}
                    </span>
                    {getStatusBadge(comp.status)}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Submitted on: {comp.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {comp.title}
                  </h3>
                </div>

                {profile?.role === 'admin' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setActiveReplyId(comp.id);
                      setReplyFeedback(comp.admin_feedback || '');
                      setReplyStatus(comp.status);
                    }}
                  >
                    <MessageSquareQuote size={15} /> Admin Action
                  </button>
                )}
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {comp.description}
              </p>

              {/* Submitter info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', paddingBottom: '0.75rem' }}>
                {comp.is_anonymous ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gub-gold)' }}>
                    <UserX size={14} /> Anonymous Student (Identity Protected)
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <UserCheck size={14} color="var(--gub-green)" /> Reported by {comp.reported_by} ({comp.reported_by_email})
                  </span>
                )}
              </div>

              {/* Admin Official Response Thread */}
              {comp.admin_feedback ? (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderLeft: '4px solid var(--gub-green)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gub-green-light)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <CheckCircle2 size={14} /> Campus Admin Resolution Update
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {comp.admin_feedback}
                  </p>
                </div>
              ) : (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Clock size={14} /> Awaiting administrative review and team dispatch.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Grievance Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit a Grievance or Feedback"
        subtitle="Your report helps university management improve campus infrastructure and services"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as ComplaintCategory)}
            >
              <option value="facilities">Facilities & Sanitation</option>
              <option value="it">IT, WiFi & Lab Hardware</option>
              <option value="academic">Academic & Examination</option>
              <option value="transport">Bus & Shuttle Transport</option>
              <option value="cafeteria">Cafeteria & Canteen Food</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Grievance Headline</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. WiFi connectivity drops in Lab 404"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Specific Details</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe the issue, location, and when it occurred..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Anonymous Toggle Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Submit Anonymously</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Your name and student email will not be disclosed to anyone.
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--gub-green)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : <><Send size={16} /> File Grievance</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Reply Modal */}
      <Modal
        isOpen={!!activeReplyId}
        onClose={() => setActiveReplyId(null)}
        title="Administrative Resolution Update"
        subtitle="Post official response to the reporter and update ticket status"
      >
        <form onSubmit={handleAdminFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Change Ticket Status</label>
            <select
              className="form-select"
              value={replyStatus}
              onChange={e => setReplyStatus(e.target.value as ComplaintStatus)}
            >
              <option value="pending">Pending</option>
              <option value="under_review">Under Review (Assigned to Maintenance/IT)</option>
              <option value="resolved">Resolved (Action completed)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Official Feedback / Resolution Statement</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="e.g. Electrician team dispatched; bulb replaced in Room 302."
              value={replyFeedback}
              onChange={e => setReplyFeedback(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveReplyId(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Post Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
