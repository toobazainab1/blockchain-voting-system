import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar, { AuroraBg } from '../components/AdminNavbar';
import Footer from '../components/Footer';

const RESULTS = [
  {
    id: '1', title: 'General Student Council Election 2026',
    status: 'open', totalVotes: 830, integrity: 98.7,
    candidates: [
      { name: 'Ahmed Raza', party: 'Progress Alliance', votes: 312, avatarCls: 'avatar-v' },
      { name: 'Sara Khan', party: 'Unity Front', votes: 274, avatarCls: 'avatar-c' },
      { name: 'Bilal Ahmed', party: 'Independent', votes: 158, avatarCls: 'avatar-r' },
      { name: 'Hina Malik', party: 'Future Forward', votes: 86, avatarCls: 'avatar-a' },
    ],
  },
  {
    id: '2', title: 'Faculty Representative Vote — Spring 2026',
    status: 'open', totalVotes: 210, integrity: 99.2,
    candidates: [
      { name: 'Dr. Usman Ali', party: 'Academic Excellence', votes: 98, avatarCls: 'avatar-v' },
      { name: 'Prof. Nadia', party: 'Student First', votes: 72, avatarCls: 'avatar-c' },
      { name: 'Kamran Shah', party: 'Reform Party', votes: 40, avatarCls: 'avatar-r' },
    ],
  },
  {
    id: '3', title: 'Departmental Committee Election — F23',
    status: 'closed', totalVotes: 320, integrity: 100,
    candidates: [
      { name: 'Ahmed Raza', party: 'Progress Alliance', votes: 122, avatarCls: 'avatar-v' },
      { name: 'Sara Khan', party: 'Unity Front', votes: 98, avatarCls: 'avatar-c' },
      { name: 'Bilal Ahmed', party: 'Independent', votes: 56, avatarCls: 'avatar-r' },
      { name: 'Hina Malik', party: 'Future Forward', votes: 44, avatarCls: 'avatar-a' },
    ],
  },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function AdminResults() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('1');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState([]);

  const election = RESULTS.find(r => r.id === selected);
  const sorted = [...(election?.candidates || [])].sort((a, b) => b.votes - a.votes);
  const max = sorted[0]?.votes || 1;

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1200));
    // TODO: call contract.publishResults(electionId)
    setPublished(p => [...p, selected]);
    setPublishing(false);
  };

  const integrityColor = (score) =>
    score >= 99 ? 'var(--emerald)' : score >= 95 ? 'var(--amber)' : 'var(--rose)';

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <AdminNavbar />
      <div className="page">
        <div className="wrap-sm">

          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Admin</div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>Election Results</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginTop: '4px' }}>Live blockchain vote counts. Publish results after election closes.</p>
          </div>

          {/* Election selector */}
          <div className="field fade-in" style={{ marginBottom: '1.5rem' }}>
            <label className="field-label">Select Election</label>
            <select className="field-input field-input-no-icon" value={selected}
              onChange={e => setSelected(e.target.value)} style={{ appearance: 'none' }}>
              {RESULTS.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>

          {election && (
            <>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="fade-in fade-in-d1">
                {[
                  { label: 'Total Votes', value: election.totalVotes.toLocaleString() },
                  { label: 'Status', value: election.status === 'open' ? 'Live' : 'Closed' },
                  { label: 'Integrity', value: `${election.integrity}%` },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value" style={{ fontSize: '1.4rem' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Winner highlight */}
              <div className="card fade-in fade-in-d2" style={{ marginBottom: '1.5rem', borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--emerald)', fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: '12px' }}>
                  LEADING CANDIDATE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={`avatar avatar-lg ${sorted[0].avatarCls}`}>{getInitials(sorted[0].name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700 }}>{sorted[0].name}</div>
                    <div style={{ color: 'var(--violet2)', fontSize: '0.85rem', marginBottom: '4px' }}>{sorted[0].party}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                      {sorted[0].votes.toLocaleString()} votes · {Math.round((sorted[0].votes / election.totalVotes) * 100)}% share
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, color: 'var(--emerald)' }}>
                    {Math.round((sorted[0].votes / election.totalVotes) * 100)}%
                  </div>
                </div>
              </div>

              {/* All candidates */}
              <div className="card fade-in fade-in-d3" style={{ marginBottom: '1.5rem' }}>
                <div className="section-title">All Candidates</div>
                {sorted.map((c, i) => (
                  <div key={i} className="result-row">
                    <div className="result-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', width: 20 }}>#{i+1}</span>
                        <div className={`avatar avatar-sm ${c.avatarCls}`}>{getInitials(c.name)}</div>
                        <div>
                          <div className="result-name">{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--violet2)' }}>{c.party}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="result-pct" style={{ color: i === 0 ? 'var(--emerald)' : 'var(--text2)' }}>
                          {Math.round((c.votes / election.totalVotes) * 100)}%
                        </div>
                        <div className="result-count">{c.votes.toLocaleString()} votes</div>
                      </div>
                    </div>
                    <div className="result-bar-bg">
                      <div className="result-bar-fill" style={{
                        width: `${Math.round((c.votes / max) * 100)}%`,
                        background: i === 0
                          ? 'linear-gradient(90deg,var(--violet),var(--blue))'
                          : 'rgba(124,92,252,0.35)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin actions */}
              <div className="card fade-in fade-in-d4">
                <div className="section-title">Admin Actions</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {election.status === 'closed' && !published.includes(selected) && (
                    <button className="btn btn-emerald btn-sm" onClick={handlePublish} disabled={publishing}>
                      {publishing ? <><div className="spinner" />Publishing...</> : <><div className="btn-shimmer" />Publish Final Results</>}
                    </button>
                  )}
                  {published.includes(selected) && (
                    <div className="alert alert-success" style={{ margin: 0, flex: 1 }}>Results published on blockchain successfully.</div>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/audit/${selected}`)}>View Audit Trail</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/results/${selected}`)}>Public Results Page</button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminResults;