import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LostFoundCategory, LostFoundItem, LostFoundStatus } from '../types';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Tag, 
  HelpCircle, 
  CheckCircle, 
  Laptop, 
  FileText, 
  Briefcase, 
  Package
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const LostFound: React.FC = () => {
  const { lostFoundItems, reportLostFound } = useApp();
  const { profile } = useAuth();

  const [statusFilter, setStatusFilter] = useState<'all' | LostFoundStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | LostFoundCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<LostFoundStatus>('found');
  const [category, setCategory] = useState<LostFoundCategory>('documents');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState(profile?.name || '');
  const [contactPhone, setContactPhone] = useState(profile?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  const filteredItems = lostFoundItems.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;
    setSubmitting(true);
    await reportLostFound({
      title,
      description,
      status,
      category,
      location,
      date: new Date().toISOString().split('T')[0],
      contact_name: contactName || profile?.name || 'Anonymous Student',
      contact_phone: contactPhone || '01700000000',
      reported_by: profile?.email || 'student@green.edu.bd'
    });
    setSubmitting(false);
    setIsReportModalOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
  };

  const getCategoryIcon = (cat: LostFoundCategory) => {
    switch (cat) {
      case 'electronics': return <Laptop size={16} />;
      case 'documents': return <FileText size={16} />;
      case 'accessories': return <Briefcase size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">Campus Lost & Found Portal</h1>
          <p className="page-subtitle">Report missing belongings or browse items recovered across university buildings</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsReportModalOpen(true)}>
          <Plus size={18} /> Report Lost / Found Item
        </button>
      </div>

      {/* Filter Tabs and Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            <button
              className={`filter-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Items ({lostFoundItems.length})
            </button>
            <button
              className={`filter-tab-btn ${statusFilter === 'found' ? 'active' : ''}`}
              onClick={() => setStatusFilter('found')}
            >
              🎉 Found ({lostFoundItems.filter(i => i.status === 'found').length})
            </button>
            <button
              className={`filter-tab-btn ${statusFilter === 'lost' ? 'active' : ''}`}
              onClick={() => setStatusFilter('lost')}
            >
              🔍 Missing / Lost ({lostFoundItems.filter(i => i.status === 'lost').length})
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search items, locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No lost or found items reported</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Try resetting your filters or report a newly discovered item.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${item.status === 'found' ? '#10b981' : '#f43f5e'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge ${item.status === 'found' ? 'badge-emerald' : 'badge-rose'}`}>
                    {item.status === 'found' ? '🎉 Item Found' : '🔍 Lost / Missing'}
                  </span>
                  <span className="badge badge-slate" style={{ fontSize: '0.75rem', gap: '4px' }}>
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={13} color="var(--gub-green)" /> <strong>Location:</strong> {item.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} color="var(--gub-cyan)" /> <strong>Date:</strong> {item.date}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contact Person</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.contact_name}</div>
                </div>
                <a
                  href={`tel:${item.contact_phone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                >
                  <Phone size={13} /> {item.contact_phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Lost or Recovered Belonging"
        subtitle="Help reunite students and staff with their personal possessions"
      >
        <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value as LostFoundStatus)}
              >
                <option value="found">I Found Something (Recovered)</option>
                <option value="lost">I Lost Something (Missing)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value as LostFoundCategory)}
              >
                <option value="documents">Student ID / Documents</option>
                <option value="electronics">Electronics (Calculator/Laptop/Phone)</option>
                <option value="accessories">Wallets, Bags & Keys</option>
                <option value="others">Other Items</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Item Name / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Casio Scientific Calculator or Student ID"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Campus Location Found / Lost</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Main Cafeteria Table 4 or Library 3rd Floor"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide color, stickers, unique identification markers..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                className="form-input"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Contact Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="017..."
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
