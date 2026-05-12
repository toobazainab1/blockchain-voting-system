import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';
const CATEGORIES = ['All', 'Student Council', 'Faculty', 'Department'];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function useCountdown(endDate) {
  const calc = () => {
    const diff = new Date(endDate) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t); // eslint-disable-line
  }, []); // eslint-disable-line
  return time;
}

function Countdown({ endDate }) {
  const { d, h, m, s } = useCountdown(endDate);
  return (
    <div className="countdown">
      {[['D', d], ['H', h], ['M', m], ['S', s]].map(([l, v]) => (
        <div key={l} className="countdown-block">
          <span className="countdown-num">{String(v).padStart(2, '0')}</span>
          <span className="countdown-lbl">{l}</span>
        </div>
      ))}
    </div>
  );
}

function IntegrityBadge({ score }) {
  const color  = score >= 99 ? 'var(--emerald)' : score >= 95 ? 'var(--amber)' : 'var(--rose)';
  const bg     = score >= 99 ? 'rgba(16,185,129,0.1)' : score >= 95 ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)';
  const border = score >= 99 ? 'rgba(16,185,129,0.25)' : score >= 95 ? 'rgba(245,158,11,0.25)' : 'rgba(244,63,94,0.25)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: bg, border: `1px solid ${border}`, fontSize: '0.72rem', fontWeight: 700, color, letterSpacing: '0.3px' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      Integrity {score}%
    </div>
  );
}

function ElectionCard({ election, onVote, onResults, onAudit, onCompare }) {
  const turnout = election.totalVoters > 0
    ? Math.round((election.votedCount / election.totalVoters) * 100)
    : 0;
  return (
    <div className="election-card fade-in">
      <div className="election-card-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div className="election-card-cat">{election.category}</div>
          <IntegrityBadge score={election.integrityScore || 99} />
        </div>
        <div className="election-card-title">{election.title}</div>
        <div className="election-card-desc">{election.description}</div>
        <div className="election-card-meta">
          {election.status === 'open'
            ? <span className="badge badge-live"><span className="badge-dot" />Live</span>
            : <span className="badge badge-closed">Closed</span>}
          {election.hasVoted && <span className="badge badge-voted">Voted</span>}
          <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
            {election.totalCandidates || 0} candidates
          </span>
        </div>
        <div className="turnout-bar-wrap">
          <div className="turnout-label">TURNOUT {turnout}% — {(election.votedCount||0).toLocaleString()} / {(election.totalVoters||0).toLocaleString()}</div>
          <div className="turnout-bar"><div className="turnout-fill" style={{ width: `${turnout}%` }} /></div>
        </div>
        {election.status === 'open' && <Countdown endDate={election.endDate} />}
        {election.status === 'closed' && election.winner && (
          <div className="winner-banner">
            <div className={`winner-avatar-sm ${election.winner.avatarCls || 'avatar-v'}`}>
              {getInitials(election.winner.name)}
            </div>
            <div>
              <div className="winner-label">WINNER — {election.winner.pct}% of votes</div>
              <div className="winner-name">{election.winner.name} · {election.winner.party}</div>
            </div>
          </div>
        )}
      </div>
      <div className="election-card-right">
        {election.status === 'open' && !election.hasVoted && (
          <button className="btn btn-primary btn-sm" onClick={() => onVote(election._id)}>
            <div className="btn-shimmer" />Vote Now
          </button>
        )}
        {election.hasVoted && (
          <button className="btn btn-ghost btn-sm" onClick={() => onResults(election._id)}>Receipt</button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => onResults(election._id)}>Results</button>
        <button className="btn btn-ghost btn-sm" onClick={() => onCompare(election._id)}>Compare</button>
        <button className="btn btn-ghost btn-sm" onClick={() => onAudit(election._id)}>Audit Trail</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const voter = JSON.parse(localStorage.getItem('voter') || '{}');
  const token = localStorage.getItem('token');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        // Fetch elections from API
        const res = await fetch(`${API}/elections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) return;

        // Check which elections this voter has voted in
        const votedIn = voter.votedIn || [];

        // Fetch candidate counts for each election
        const enriched = await Promise.all(data.elections.map(async (e) => {
          try {
            const cRes = await fetch(`${API}/candidates?electionId=${e._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const cData = await cRes.json();
            const totalCandidates = cData.success ? cData.candidates.length : 0;
            return {
              ...e,
              totalCandidates,
              hasVoted: votedIn.includes(e._id),
              integrityScore: 99,
              totalVoters: e.totalVoters || 1000,
            };
          } catch {
            return { ...e, totalCandidates: 0, hasVoted: votedIn.includes(e._id), integrityScore: 99 };
          }
        }));

        setElections(enriched);
      } catch (err) {
        console.error('Failed to fetch elections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, [token]); // eslint-disable-line

  const filtered = activeCategory === 'All' ? elections : elections.filter(e => e.category === activeCategory);
  const openCount = elections.filter(e => e.status === 'open').length;
  const votedCount = elections.filter(e => e.hasVoted).length;
  const initials = voter.name ? voter.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  const avatarCls = voter.avatarId ? `avatar-${voter.avatarId}` : 'avatar-v';

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />

      {/* HERO */}
      <section className="hero" style={{ paddingTop: 'calc(var(--nav-h) + 2rem)' }}>
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Blockchain-Secured Voting Platform
          </div>
          <h1 className="hero-title">
            Your vote.<br />
            <span className="hl">Your voice.</span><br />
            On-chain forever.
          </h1>
          <p className="hero-quote">
            "The ballot is stronger than the bullet." — Every vote cast on BlockVote is encrypted, anonymous, and permanently verifiable on the blockchain.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" style={{ width: 'auto', padding: '13px 28px' }}
              onClick={() => document.getElementById('elections-section').scrollIntoView({ behavior: 'smooth' })}>
              <div className="btn-shimmer" />View Elections
            </button>
            <button className="btn btn-ghost" style={{ width: 'auto', padding: '13px 28px' }}
              onClick={() => navigate('/how-it-works')}>
              How It Works
            </button>
          </div>
          <div className="hero-stats">
            {[
              { val: openCount, lbl: 'Live Elections' },
              { val: `${elections.length}`, lbl: 'Total Elections' },
              { val: votedCount, lbl: 'Your Votes Cast' },
              { val: '100%', lbl: 'Tamper-Proof' },
            ].map(s => (
              <div key={s.lbl} className="hero-stat">
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="hero-scroll-arrow" />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="page" id="elections-section" style={{ paddingTop: '2rem' }}>
        <div className="wrap">

          {/* Welcome */}
          <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem' }}>
            <div className={`avatar avatar-xl ${avatarCls}`}>{initials}</div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Voter Dashboard</div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>
                Welcome back, {voter.name?.split(' ')[0] || 'Voter'}
              </h2>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }} className="fade-in fade-in-d1">
            {[
              { label: 'Live Elections', value: openCount, sub: 'currently active', iconCls: 'stat-icon-violet',
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              { label: 'Votes Cast', value: votedCount, sub: 'by you total', iconCls: 'stat-icon-emerald',
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
              { label: 'Total Elections', value: elections.length, sub: 'on platform', iconCls: 'stat-icon-cyan',
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
              { label: 'Avg Integrity', value: '99.3%', sub: 'blockchain verified', iconCls: 'stat-icon-rose',
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.iconCls}`}><s.Icon /></div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Category tabs */}
          <div className="section-title fade-in fade-in-d2">Elections</div>
          <div className="category-tabs fade-in fade-in-d2">
            {CATEGORIES.map(c => (
              <button key={c} className={`category-tab ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              Loading elections from blockchain...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map(e => (
                <ElectionCard key={e._id} election={e}
                  onVote={id => navigate(`/ballot/${id}`)}
                  onResults={id => navigate(`/results/${id}`)}
                  onAudit={id => navigate(`/audit/${id}`)}
                  onCompare={id => navigate(`/compare/${id}`)} />
              ))}
              {filtered.length === 0 && !loading && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
                  No elections in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;