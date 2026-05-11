import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuroraBg } from '../components/Navbar';

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

function BiometricModal({ name, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box fade-in">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 30, height: 30, color: 'var(--violet2)' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeOpacity="0.3"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6" />
            <path d="M12 9c-1.66 0-3 1.34-3 3" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <path d="M15 12c0 1.66-1.34 3-3 3"/>
            <path d="M18 12c0 3.31-2.69 6-6 6"/>
          </svg>
        </div>
        <h2 className="modal-title">Enable Biometric Login?</h2>
        <p className="modal-desc">
          Welcome, <strong>{name || 'Voter'}</strong>! Your account has been created successfully.
          Biometric verification — fingerprint and facial recognition — is available exclusively on the <strong>BlockVote mobile app</strong>.
        </p>
        <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          Download the BlockVote app on iOS or Android to enable biometric login and cast votes securely from your phone.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1.25rem' }}>
          {['App Store', 'Google Play'].map(s => (
            <div key={s} style={{ padding: '8px 20px', borderRadius: 'var(--r-sm)', background: 'var(--surface2)', border: '1px solid var(--border2)', fontSize: '0.82rem', color: 'var(--text2)', fontWeight: 600 }}>
              {s}
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-full" onClick={onClose}>
          <div className="btn-shimmer" />Continue to Login
        </button>
        <button className="btn btn-ghost btn-full" onClick={onClose} style={{ marginTop: '8px' }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function Register() {
  const [form, setForm] = useState({ name: '', voterID: '', password: '', confirmPassword: '' });
  const [avatarId, setAvatarId] = useState('v');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const initials = getInitials(form.name);
  const avatarCls = AVATARS.find(a => a.id === avatarId)?.cls || 'avatar-v';

  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.voterID || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setShowBio(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      {showBio && <BiometricModal name={form.name} onClose={() => navigate('/login')} />}
      <div className="page-center" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="auth-card wide fade-in">

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}>
            <div className="auth-logo" style={{ margin: 0, width: 40, height: 40, borderRadius: 11 }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="auth-title" style={{ marginBottom: 0, fontSize: '1.25rem' }}>Create account</h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Register as a verified voter</p>
            </div>
          </div>

          <button className="back-btn" onClick={() => navigate('/login')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
            Back to Sign In
          </button>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
            <div className={`avatar avatar-lg ${avatarCls}`}>{initials || '?'}</div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text3)', marginBottom: '8px' }}>Choose avatar color</div>
              <div className="avatar-picker">
                {AVATARS.map(a => (
                  <div key={a.id}
                    className={`avatar-pick-opt avatar ${a.cls} ${avatarId === a.id ? 'chosen' : ''}`}
                    style={{ width: 32, height: 32, fontSize: '0.65rem' }}
                    onClick={() => setAvatarId(a.id)}>
                    {initials || '?'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input className="field-input" placeholder="Your full name" value={form.name} onChange={set('name')} />
              </div>
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label className="field-label">Voter ID (CNIC)</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </span>
                <input className="field-input" placeholder="CNIC without dashes" value={form.voterID} onChange={set('voterID')} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </span>
                <input className="field-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </span>
                <input className="field-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading}>
            {loading
              ? <><div className="spinner" />Creating account...</>
              : <><div className="btn-shimmer" />Create Voter Account</>}
          </button>

          <div className="link-row" style={{ marginTop: '1rem' }}>
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;