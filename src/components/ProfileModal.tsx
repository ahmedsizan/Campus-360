import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { User, Phone, BookOpen, Fingerprint, Calendar, FileText, Heart, Shield, Camera, Check } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { isProfileModalOpen, setIsProfileModalOpen, addToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [idNo, setIdNo] = useState('');
  const [semester, setSemester] = useState('');
  const [bio, setBio] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setDepartment(profile.department || 'Computer Science & Engineering');
      setIdNo(profile.id_no || '');
      setSemester(profile.semester || 'Spring 2026');
      setBio(profile.bio || '');
      setOfficeHours(profile.office_hours || '');
      setFatherName(profile.father_name || '');
      setMotherName(profile.mother_name || '');
      setBloodGroup(profile.blood_group || 'B+');
      setAvatar(profile.avatar || '');
    }
  }, [profile, isProfileModalOpen]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 400; // 400x400 standard high-res square
          const width = img.width;
          const height = img.height;

          // Center crop calculation for perfect square
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw center-cropped square
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);
          
          // Output compressed JPEG
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressed);
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedAvatar = await compressImage(file);
        setAvatar(compressedAvatar);
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile({
      name,
      phone,
      department,
      id_no: idNo,
      semester,
      bio,
      office_hours: officeHours,
      father_name: fatherName,
      mother_name: motherName,
      blood_group: bloodGroup,
      avatar,
    });
    setSaving(false);

    if (error) {
      addToast('error', error.message || 'Failed to update profile', 'Update Error');
    } else {
      addToast('success', 'Profile and avatar updated and locked successfully!', 'Profile Saved');
      setIsProfileModalOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      title="Edit Profile Information"
      subtitle="Update your university record, avatar, and personal credentials"
      maxWidth="680px"
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Avatar Selection Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
              alt={name} 
              className="avatar-circle"
              style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gub-green)' }}
            />
            <label 
              htmlFor="avatar-upload"
              style={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                background: 'var(--gub-green)', 
                color: '#fff', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
              title="Upload photo from device"
            >
              <Camera size={15} />
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarFile} 
              style={{ display: 'none' }} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Avatar Image URL</label>
            <input 
              type="url" 
              className="form-input" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)} 
              placeholder="https://..." 
              style={{ fontSize: '0.85rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              🔒 Avatar is locked permanently to your account email in local persistence.
            </p>
          </div>
        </div>

        {/* 2-Column Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label"><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label"><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Contact Number</label>
            <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1..." />
          </div>

          <div className="form-group">
            <label className="form-label"><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> Department</label>
            <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
              <option value="Electrical & Electronic Engineering">Electrical & Electronic Engineering (EEE)</option>
              <option value="Textile Engineering">Textile Engineering (TE)</option>
              <option value="Green Business School">Green Business School (BBA)</option>
              <option value="Department of English">Department of English</option>
              <option value="Department of Law">Department of Law</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label"><Fingerprint size={14} style={{ display: 'inline', marginRight: '4px' }} /> Student / Employee ID</label>
            <input type="text" className="form-input" value={idNo} onChange={e => setIdNo(e.target.value)} placeholder="GUB-..." />
          </div>

          {profile?.role === 'student' && (
            <div className="form-group">
              <label className="form-label"><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Semester</label>
              <input type="text" className="form-input" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g. 8th Semester" />
            </div>
          )}

          {profile?.role === 'teacher' && (
            <div className="form-group">
              <label className="form-label"><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Office Hours</label>
              <input type="text" className="form-input" value={officeHours} onChange={e => setOfficeHours(e.target.value)} placeholder="e.g. Sun & Tue 10am-1pm" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label"><Heart size={14} style={{ display: 'inline', marginRight: '4px' }} /> Blood Group</label>
            <select className="form-select" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label"><Shield size={14} style={{ display: 'inline', marginRight: '4px' }} /> Father's Name</label>
            <input type="text" className="form-input" value={fatherName} onChange={e => setFatherName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label"><Shield size={14} style={{ display: 'inline', marginRight: '4px' }} /> Mother's Name</label>
            <input type="text" className="form-input" value={motherName} onChange={e => setMotherName(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label"><FileText size={14} style={{ display: 'inline', marginRight: '4px' }} /> Short Bio / Statement</label>
          <textarea className="form-textarea" rows={2} value={bio} onChange={e => setBio(e.target.value)} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsProfileModalOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : <><Check size={18} /> Save & Apply Changes</>}
          </button>
        </div>
      </form>
    </Modal>
  );
};
