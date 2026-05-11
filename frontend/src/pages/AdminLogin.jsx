import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBg } from '../components/Navbar';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // Admin credentials — change these before production
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-mock-token');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <div className="page-center">
        <div className="auth-card fade-in">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ width: 24, height: 24 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-sub">Sign in to manage elections and candidates</p>
          <div className="aurora-line" />

          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label className="field-label">Username</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input className="field-input" type="text" placeholder="Admin username"
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input className="field-input" type="password" placeholder="Admin password"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading}>
            {loading ? <><div className="spinner" />Signing in...</> : <><div className="btn-shimmer" />Sign In as Admin</>}
          </button>

          <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', color: 'var(--text3)', textAlign: 'center' }}>
            Demo: username <strong style={{ color: 'var(--violet2)' }}>admin</strong> / password <strong style={{ color: 'var(--violet2)' }}>admin123</strong>
          </div>

          <div className="sec-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Restricted access · Admins only
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;