import React from 'react';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const FEATURES = [
  { icon: '🔐', title: 'Tamper-Proof Voting', desc: 'Every vote is encrypted and stored on an immutable blockchain ledger. No one — not even system administrators — can alter a submitted vote.' },
  { icon: '👁️', title: 'Full Transparency', desc: 'Anyone can verify election results using the public blockchain. Every transaction is auditable, yet voter identities remain completely anonymous.' },
  { icon: '⚡', title: 'Real-Time Results', desc: 'Votes are counted automatically by smart contracts the moment they are cast. Live results are available instantly with no manual counting.' },
  { icon: '🌍', title: 'Accessible to All', desc: 'Vote from anywhere with an internet connection. No need to travel to a polling station — your vote is just as valid from home.' },
  { icon: '🧠', title: 'Smart Contracts', desc: 'Election rules are enforced automatically by code — no human intervention, no bias, no errors. The contract does exactly what it is programmed to do.' },
  { icon: '🛡️', title: 'Privacy First', desc: 'Your identity is verified once during registration. After that, your vote is cryptographically separated from your identity.' },
];



function Mission() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap">

          {/* Hero */}
          <div className="mission-hero fade-in" style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px' }}>
              OUR MISSION
            </div>
            <h1 className="mission-title">
              <span className="grad-text">Democracy</span> deserves<br />better technology.
            </h1>
            <p className="mission-sub">
              BlockVote was built to solve a real problem — traditional voting systems are slow, opaque, and vulnerable to manipulation. We believe every vote deserves to be counted accurately, transparently, and securely.
            </p>
          </div>

          {/* Features */}
          <div className="section-title fade-in">WHY BLOCKVOTE</div>
          <div className="card-grid card-grid-3 fade-in fade-in-d1" style={{ marginBottom: '3rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="card fade-in fade-in-d2" style={{ marginBottom: '3rem', background: 'rgba(167,139,250,0.05)', borderColor: 'rgba(167,139,250,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center', padding: '1rem' }}>
              {[
                { val: '100%', label: 'Tamper-proof' },
                { val: '0ms', label: 'Vote delay' },
                { val: '∞', label: 'Audit trail' },
                { val: '1', label: 'Vote per person' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>{s.val}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Mission;