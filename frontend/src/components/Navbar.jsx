import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function AuroraBg() {
  return (
    <>
      <div className="aurora-bg"><div className="aurora-mid" /></div>
      <div className="grid-lines" />
      <div className="noise-overlay" />
    </>
  );
}

const VoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const LINKS = [
  { to: '/dashboard',    label: 'Home',         Icon: HomeIcon },
  { to: '/results/1',   label: 'Live Results', Icon: ChartIcon },
  { to: '/eligibility',  label: 'Who Can Vote', Icon: ShieldIcon },
  { to: '/mission',      label: 'Our Mission',  Icon: TargetIcon },
  { to: '/how-it-works', label: 'How It Works', Icon: InfoIcon },
  { to: '/profile',      label: 'Profile',      Icon: UserIcon },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const voter = JSON.parse(localStorage.getItem('voter') || '{}');
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('voter');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          <div className="nav-logo">
            <VoteIcon />
          </div>
          <span className="nav-name">BlockVote</span>
        </Link>

        <div className="nav-links">
          {LINKS.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
              <Icon />{label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          {voter.name && (
            <Link to="/profile" className="nav-user-pill">
              <div className="nav-user-avatar">{getInitials(voter.name)}</div>
              <span className="nav-user-name">{voter.name.split(' ')[0]}</span>
            </Link>
          )}
          <button className="nav-btn-logout" onClick={logout}>Sign Out</button>
          <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="nav-mobile-drawer">
          {LINKS.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}
              onClick={() => setOpen(false)}>
              <Icon />{label}
            </Link>
          ))}
          <button className="nav-btn-logout" onClick={logout} style={{ marginTop: '8px', width: '100%' }}>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;