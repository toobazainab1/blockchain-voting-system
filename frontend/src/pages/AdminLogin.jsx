import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBg } from '../components/AdminNavbar';

const API = 'http://localhost:5000/api';

function AdminLogin() {
  const [voterID, setVoterID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      if (data.voter.role !== 'admin') throw new Error('Not an admin account.');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.voter));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-sub">BlockVote Election Management System</p>

          <div className="aurora-line" />
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label className="field-label">Admin Username</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input className="field-input" type="text" placeholder="Enter admin username"
                value={voterID} onChange={e => setVoterID(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </span>
              <input className="field-input" type="password" placeholder="Enter password"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <><div className="spinner" />Signing in...</> : <><div className="btn-shimmer" />Sign In as Admin</>}
          </button>

   

          <div className="sec-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Admin access only · Blockchain secured
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;