import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const RESULTS_DATA = {
  '1': {
    title: 'General Student Council Election 2026',
    status: 'open', totalVotes: 830,
    candidates: [
      { _id: 'c1', name: 'Ahmed Raza', party: 'Progress Alliance', avatar: '👨‍💼', color: '#a78bfa', votes: 312 },
      { _id: 'c2', name: 'Sara Khan', party: 'Unity Front', avatar: '👩‍🎓', color: '#60a5fa', votes: 274 },
      { _id: 'c3', name: 'Bilal Ahmed', party: 'Independent', avatar: '👨‍🎓', color: '#34d399', votes: 158 },
      { _id: 'c4', name: 'Hina Malik', party: 'Future Forward', avatar: '👩‍💻', color: '#f472b6', votes: 86 },
    ],
  },
  '2': {
    title: 'Faculty Representative Vote — Spring 2026',
    status: 'open', totalVotes: 210,
    candidates: [
      { _id: 'c5', name: 'Dr. Usman Ali', party: 'Academic Excellence', avatar: '👨‍🔬', color: '#a78bfa', votes: 98 },
      { _id: 'c6', name: 'Prof. Nadia', party: 'Student First', avatar: '👩‍🏫', color: '#60a5fa', votes: 72 },
      { _id: 'c7', name: 'Kamran Shah', party: 'Reform Party', avatar: '🧑‍💼', color: '#34d399', votes: 40 },
    ],
  },
};

function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const data = RESULTS_DATA[electionId] || RESULTS_DATA['1'];
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const sorted = [...data.candidates].sort((a, b) => b.votes - a.votes);
  const max = sorted[0]?.votes || 1;

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-sm">

          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '8px' }}>
              <span className={`badge ${data.status === 'open' ? 'badge-open' : 'badge-closed'}`}>
                <span className="badge-dot" />{data.status === 'open' ? 'Live Results' : 'Final Results'}
              </span>
            </div>
            <div className="page-title">{data.title}</div>
            <div className="page-sub">{data.totalVotes.toLocaleString()} votes recorded on blockchain</div>
          </div>

          {/* Leading candidate */}
          <div className="card fade-in fade-in-d1" style={{ marginBottom: '1.5rem', borderColor: 'rgba(167,139,250,0.25)', background: 'rgba(167,139,250,0.05)' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--aurora1)', fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: '12px' }}>🏆 Leading Candidate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${sorted[0].color}22`, border: `2px solid ${sorted[0].color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                {sorted[0].avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{sorted[0].name}</div>
                <div style={{ color: sorted[0].color, fontSize: '0.85rem', marginBottom: '4px', fontWeight: 500 }}>{sorted[0].party}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                  {sorted[0].votes.toLocaleString()} votes · {Math.round((sorted[0].votes / data.totalVotes) * 100)}% share
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--aurora1),var(--aurora2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {Math.round((sorted[0].votes / data.totalVotes) * 100)}%
              </div>
            </div>
          </div>

          {/* All candidates */}
          <div className="section-title fade-in">All Candidates</div>
          <div className="card fade-in fade-in-d2" style={{ marginBottom: '1rem' }}>
            {sorted.map((c, i) => (
              <div key={c._id} className="result-row">
                <div className="result-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', width: '20px' }}>#{i + 1}</span>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `${c.color}22`, border: `1.5px solid ${c.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      {c.avatar}
                    </div>
                    <div>
                      <div className="result-name">{c.name}</div>
                      <div style={{ fontSize: '0.78rem', color: c.color, fontWeight: 500 }}>{c.party}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, color: i === 0 ? 'var(--aurora1)' : 'var(--text2)' }}>
                      {Math.round((c.votes / data.totalVotes) * 100)}%
                    </div>
                    <div className="result-count">{c.votes.toLocaleString()} votes</div>
                  </div>
                </div>
                <div className="result-bar-bg">
                  <div className="result-bar-fill"
                    style={{
                      width: animated ? `${Math.round((c.votes / max) * 100)}%` : '0%',
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
              { key: 'Total votes on chain', val: data.totalVotes.toLocaleString() },
              { key: 'Last block', val: `#${Math.floor(Math.random() * 900000 + 100000)}` },
              { key: 'Integrity status', val: '✅ All votes verified' },
              { key: 'Smart contract', val: '0x7f3a...c9b2' },
            ].map(r => (
              <div key={r.key} className="receipt-row">
                <span className="receipt-key">{r.key}</span>
                <span className="receipt-val" style={{ fontSize: '0.85rem' }}>{r.val}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Results;