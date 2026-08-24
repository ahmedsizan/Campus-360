import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Notice, NoticeCategory } from '../types';
import { Bell, Search, Plus, Calendar, User, Tag, Sparkles, Filter } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Notices: React.FC = () => {
  const { notices, addNotice, loadingNotices } = useApp();
  const { profile } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<'all' | NoticeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // New Notice Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('academic');
  const [author, setAuthor] = useState('Office of the Registrar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: 'all' | NoticeCategory; label: string }[] = [
    { id: 'all', label: 'All Notices' },
    { id: 'academic', label: 'Academic' },
    { id: 'administrative', label: 'Administrative' },
    { id: 'events', label: 'Events & Contests' },
    { id: 'sports', label: 'Sports & Clubs' },
  ];

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    await addNotice({
      title,
      content,
      category,
      author,
      date: new Date().toISOString().split('T')[0]
    });
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setTitle('');
    setContent('');
  };

  const getCategoryBadgeClass = (cat: NoticeCategory) => {
    switch (cat) {
      case 'academic': return 'badge-emerald';
      case 'events': return 'badge-purple';
      case 'administrative': return 'badge-cyan';
      case 'sports': return 'badge-amber';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">University Notice Board</h1>
          <p className="page-subtitle">Official announcements, academic circulars, exam routines, and campus events</p>
        </div>

        {profile?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} /> Post New Notice
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bell size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No notices found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Try changing your search query or selecting a different category tab.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="glass-card glass-card-interactive"
              onClick={() => setSelectedNotice(notice)}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge ${getCategoryBadgeClass(notice.category)}`}>
                    {notice.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} /> {notice.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.35, color: 'var(--text-primary)' }}>
                  {notice.title}
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem'
                }}>
                  {notice.content}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={13} /> {notice.author || 'GUB Administration'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gub-green)' }}>
                  Read Full &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read Notice Detail Modal */}
      <Modal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title={selectedNotice?.title || 'Notice Details'}
        maxWidth="680px"
      >
        {selectedNotice && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className={`badge ${getCategoryBadgeClass(selectedNotice.category)}`}>
                {selectedNotice.category}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> Published on: {selectedNotice.date}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} /> Issued by: {selectedNotice.author || 'Registrar'}
              </span>
            </div>

            <div style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
              {selectedNotice.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedNotice(null)}>
                Close Notice
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Post Notice Modal for Admins */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post New Circular / Notice"
        subtitle="This notice will appear on all student and faculty notice feeds"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Schedule of Final Examinations Summer 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as NoticeCategory)}
            >
              <option value="academic">Academic</option>
              <option value="administrative">Administrative</option>
              <option value="events">Events & Contests</option>
              <option value="sports">Sports & Clubs</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Issuing Authority</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notice Body</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Write the full announcement text..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Publish to Board'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
