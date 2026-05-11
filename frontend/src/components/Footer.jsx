import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ width: 16, height: 16 }} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <span className="footer-brand-name">BlockVote</span>
            </div>
            <p className="footer-brand-desc">
              A decentralized, tamper-proof voting platform built on blockchain. Every vote is secure, anonymous, and permanently verifiable.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
              {['Encrypted', 'On-Chain', 'Auditable'].map(b => (
                <span key={b} className="footer-badge">{b}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <Link className="footer-link" to="/dashboard">Dashboard</Link>
            <Link className="footer-link" to="/results/1">Live Results</Link>
            <Link className="footer-link" to="/how-it-works">How It Works</Link>
            <Link className="footer-link" to="/mission">Our Mission</Link>
          </div>
          <div>
            <div className="footer-col-title">Account</div>
            <Link className="footer-link" to="/profile">My Profile</Link>
            <Link className="footer-link" to="/profile">Voting History</Link>
            <Link className="footer-link" to="/login">Sign In</Link>
            <Link className="footer-link" to="/register">Register</Link>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Use</span>
            <span className="footer-link">Security</span>
            <span className="footer-link">Contact Us</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 BlockVote — BSSE-F23-B, IIU Islamabad</span>
          <div className="footer-badges">
            <span className="footer-badge">Blockchain Secured</span>
            <span className="footer-badge">256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;