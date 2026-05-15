import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuroraBg } from './Navbar';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to: '/admin/elections', label: 'Elections',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { to: '/admin/candidates', label: 'Candidates',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/admin/results', label: 'Results',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/bsse-f23b-admin-iiu');
  };

  return (
    <nav className="navbar">
      <Link to="/admin/dashboard" className="nav-brand">
        <div className="nav-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span className="nav-name">BlockVote Admin</span>
      </Link>

      <div className="nav-links">
        {LINKS.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
            <Icon />{label}
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <div style={{ fontSize: '0.82rem', color: 'var(--text3)', padding: '4px 10px', background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 20 }}>
          Admin
        </div>
        <button className="nav-btn-logout" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}

export { AuroraBg };
export default AdminNavbar;