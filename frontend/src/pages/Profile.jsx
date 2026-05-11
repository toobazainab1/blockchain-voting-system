import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const HISTORY = [
  { election: 'General Student Council Election 2026', candidate: 'Ahmed Raza', date: '9 May 2026, 10:32 AM', hash: '0x4f3a8c...1b2d', status: 'Confirmed' },
  { election: 'Departmental Committee Election — F23', candidate: 'Hina Malik', date: '1 Apr 2026, 2:15 PM', hash: '0x9e2cf1...4a3b', status: 'Confirmed' },
];

const AVATARS = [
  { id: 'v', cls: 'avatar-v' },
  { id: 'c', cls: 'avatar-c' },
  { id: 'r', cls: 'avatar-r' },
  { id: 'a', cls: 'avatar-a' },
  { id: 'g', cls: 'avatar-g' },
];

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function BiometricModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a10 10 0 00-7.35 16.76"/>
            <path d="M12 6a6 6 0 015.2 9"/>
            <path d="M12 10a2 2 0 011.73 3"/>
            <circle cx="12" cy="12" r="1"/>
            <path d="M12 22v-1"/>
          </svg>
        </div>
        <h2 className="modal-title">Biometric Verification</h2>
        <p className="modal-desc">
          Fingerprint and facial recognition are available on the <strong>BlockVote mobile app</strong>. Web browsers do not support biometric hardware directly.
        </p>
        <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          Download the BlockVote app on iOS or Android to use biometric login and vote from your phone.
        </div>
        <button className="btn btn-primary btn-full" onClick={onClose}>
          <div className="btn-shimmer" />Got it
        </button>
        <button className="btn btn-ghost btn-full" onClick={onClose} style={{ marginTop: '8px' }}>Close</button>
      </div>
    </div>
  );
}

function Profile() {
  const [voter, setVoter] = useState(JSON.parse(localStorage.getItem('voter') || '{}'));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: voter.name || '', avatarId: voter.avatarId || 'v' });
  const [saved, setSaved] = useState(false);
  const [showBio, setShowBio] = useState(false);

  const initials = getInitials(voter.name);
  const avatarCls = AVATARS.find(a => a.id === (voter.avatarId || 'v'))?.cls || 'avatar-v';

  const handleSave = () => {
    const updated = { ...voter, name: form.name, avatarId: form.avatarId };
    localStorage.setItem('voter', JSON.stringify(updated));
    setVoter(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      {showBio && <BiometricModal onClose={() => setShowBio(false)} />}
      <div className="page">
        <div className="wrap">

          {/* Hero */}
          <div className="profile-hero fade-in">
            <div className={`avatar avatar-xl ${avatarCls}`}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div className="profile-name">{voter.name || 'Voter'}</div>
              <div className="profile-id">Voter ID: {voter.voterID || 'N/A'}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-live">Verified Voter</span>
                <span className="badge badge-voted">{HISTORY.length} votes cast</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(e => !e)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowBio(true)}>
                Biometric Login
              </button>
            </div>
          </div>

          {saved && <div className="alert alert-success fade-in">Profile updated successfully.</div>}

          {/* Edit */}
          {editing && (
            <div className="card fade-in" style={{ marginBottom: '1.5rem' }}>
              <div className="section-title">Edit Profile</div>
              <div className="field">
                <label className="field-label">Display Name</label>
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input className="field-input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name" />
                </div>
              </div>
              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Avatar Color</label>
                <div className="avatar-picker">
                  {AVATARS.map(a => (
                    <div key={a.id}
                      className={`avatar-pick-opt avatar ${a.cls} ${form.avatarId === a.id ? 'chosen' : ''}`}
                      style={{ width: 40, height: 40, fontSize: '0.75rem' }}
                      onClick={() => setForm(f => ({ ...f, avatarId: a.id }))}>
                      {getInitials(form.name) || 'U'}
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '1rem' }}>
                <div className="btn-shimmer" />Save Changes
              </button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Elections Voted', value: HISTORY.length },
              { label: 'Voter Status', value: 'Active' },
              { label: 'Member Since', value: 'Mar 2026' },
              { label: 'Blockchain ID', value: '0x4f3a...' },
            ].map(s => (
              <div key={s.label} className="stat-card fade-in fade-in-d1">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ fontSize: '1.3rem' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Personal info */}
          <div className="card fade-in fade-in-d2" style={{ marginBottom: '1.5rem' }}>
            <div className="section-title">Personal Information</div>
            {[
              { key: 'Full Name', val: voter.name || '—' },
              { key: 'Voter ID (CNIC)', val: voter.voterID || '—' },
              { key: 'Account Type', val: 'Registered Voter' },
              { key: 'Verification Status', val: 'Identity Verified' },
              { key: 'Wallet Address', val: '0x' + (voter.voterID || '0000000').slice(0, 8) + '...auto' },
            ].map(r => (
              <div key={r.key} className="receipt-row">
                <span className="receipt-key">{r.key}</span>
                <span className="receipt-val">{r.val}</span>
              </div>
            ))}
          </div>

          {/* Voting history */}
          <div className="card fade-in fade-in-d3">
            <div className="section-title">Voting History</div>
            {HISTORY.map((v, i) => (
              <div key={i} style={{ padding: '1rem 0', borderBottom: i < HISTORY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px' }}>{v.election}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '3px' }}>
                      Voted for: <span style={{ color: 'var(--violet2)', fontWeight: 600 }}>{v.candidate}</span>
                    </div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--text3)' }}>{v.date}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text3)', fontFamily: 'monospace', marginTop: '3px' }}>TX: {v.hash}</div>
                  </div>
                  <span className="badge badge-voted">{v.status}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;