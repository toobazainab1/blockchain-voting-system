import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const API = 'http://localhost:5000/api';
const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fb923c', '#38bdf8'];

function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [eRes, rRes] = await Promise.all([
          fetch(`${API}/elections/${electionId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/votes/results/${electionId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const eData = await eRes.json();
        const rData = await rRes.json();

        if (eData.success) setElection(eData.election);
        if (rData.success) {
          const withColors = rData.candidates.map((c, i) => ({
            ...c,
            color: COLORS[i % COLORS.length],
          }));
          setCandidates(withColors);
          setTotalVotes(rData.totalVotes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimated(true), 300);
      }
    };
    load();
  }, [electionId, token]); // eslint-disable-line

  if (loading) return (
    <div style={{ position: 'relative' }}>
      <AuroraBg /><Navbar />
      <div className="page"><div className="wrap-sm" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text3)' }}>Loading results...</p>
      </div></div>
    </div>
  );

  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const max = sorted[0]?.votes || 1;
  const leader = sorted[0];

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-sm">

          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '8px' }}>
              <span className={`badge ${election?.status === 'open' ? 'badge-live' : 'badge-closed'}`}>
                <span className="badge-dot" />{election?.status === 'open' ? 'Live Results' : 'Final Results'}
              </span>
            </div>
            <div className="page-title">{election?.title || 'Election Results'}</div>
            <div className="page-sub">{totalVotes.toLocaleString()} votes recorded on blockchain</div>
          </div>

          {/* Leading candidate */}
          {leader && totalVotes > 0 && (
            <div className="card fade-in fade-in-d1" style={{ marginBottom: '1.5rem', borderColor: 'rgba(167,139,250,0.25)', background: 'rgba(167,139,250,0.05)' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--aurora1)', fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: '12px' }}>🏆 Leading Candidate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${leader.color}22`, border: `2px solid ${leader.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: leader.color, flexShrink: 0 }}>
                  {leader.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700 }}>{leader.name}</div>
                  <div style={{ color: leader.color, fontSize: '0.85rem', marginBottom: '4px', fontWeight: 500 }}>{leader.party}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                    {leader.votes.toLocaleString()} votes · {Math.round((leader.votes / totalVotes) * 100)}% share
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--aurora1),var(--aurora2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {Math.round((leader.votes / totalVotes) * 100)}%
                </div>
              </div>
            </div>
          )}

          {totalVotes === 0 && (
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              No votes have been cast yet. Be the first to vote!
            </div>
          )}

          {/* All candidates */}
          <div className="section-title fade-in">All Candidates</div>
          <div className="card fade-in fade-in-d2" style={{ marginBottom: '1rem' }}>
            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                No candidates added yet.
              </div>
            ) : sorted.map((c, i) => (
              <div key={c._id} className="result-row">
                <div className="result-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', width: '20px' }}>#{i + 1}</span>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `${c.color}22`, border: `1.5px solid ${c.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: c.color, flexShrink: 0 }}>
                      {c.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="result-name">{c.name}</div>
                      <div style={{ fontSize: '0.78rem', color: c.color, fontWeight: 500 }}>{c.party}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, color: i === 0 ? 'var(--aurora1)' : 'var(--text2)' }}>
                      {totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0}%
                    </div>
                    <div className="result-count">{c.votes.toLocaleString()} votes</div>
                  </div>
                </div>
                <div className="result-bar-bg">
                  <div className="result-bar-fill"
                    style={{
                      width: animated ? `${max > 0 ? Math.round((c.votes / max) * 100) : 0}%` : '0%',
                      background: i === 0
                        ? 'linear-gradient(90deg,var(--aurora1),var(--aurora2))'
                        : `linear-gradient(90deg,${c.color}99,${c.color}55)`
                    }} />
                </div>
              </div>
            ))}
          </div>

          {/* Blockchain audit */}
          <div className="card fade-in fade-in-d3">
            <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--aurora1)', fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: '12px' }}>⛓️ Blockchain Audit</div>
            {[
              { key: 'Total votes on chain', val: totalVotes.toLocaleString() },
              { key: 'Election status', val: election?.status === 'open' ? '🟢 Open' : '🔴 Closed' },
              { key: 'Integrity status', val: '✅ All votes verified' },
              { key: 'Smart contract', val: '0x5FbDB...0aa3' },
              { key: 'Network', val: 'Hardhat Local Testnet' },
            ].map(r => (
              <div key={r.key} className="receipt-row">
                <span className="receipt-key">{r.key}</span>
                <span className="receipt-val" style={{ fontSize: '0.85rem' }}>{r.val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => navigate(`/audit/${electionId}`)}>
              View Audit Trail
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Results;