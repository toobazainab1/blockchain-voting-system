import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuroraBg } from '../components/Navbar';

const API = 'http://localhost:5000/api';

function Login() {
  const [voterID, setVoterID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard', { replace: true });
    if (localStorage.getItem('adminToken')) navigate('/admin/dashboard', { replace: true });
  }, []); // eslint-disable-line

  const handleLogin = async () => {
    setError('');
    if (!voterID || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterID, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('voter', JSON.stringify(data.voter));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <div className="page-center">
        <div className="auth-card fade-in">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to access the BlockVote platform</p>

          <div className="aurora-line" />
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label className="field-label">Voter ID</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </span>
              <input className="field-input" type="text"
                placeholder="Enter your Voter ID"
                value={voterID} onChange={e => setVoterID(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </span>
              <input className="field-input" type="password" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <><div className="spinner" />Signing in...</> : <><div className="btn-shimmer" />Sign In to BlockVote</>}
          </button>

          <div className="divider">
            <div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" />
          </div>
          <div className="link-row">New voter? <Link to="/register">Create account</Link></div>

          <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', color: 'var(--text3)', textAlign: 'center', lineHeight: 1.7 }}>
            Register first, then login with your credentials.
          </div>

          <div className="sec-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            256-bit encrypted · Blockchain secured
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;