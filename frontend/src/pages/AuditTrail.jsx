import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

function generateTx(i) {
  const hash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...';
  const voters = ['34101...', '42201...', '35502...', '31103...', '44404...', '32205...'];
  const times = [
    '09 May 2026, 08:14 AM', '09 May 2026, 08:47 AM', '09 May 2026, 09:03 AM',
    '09 May 2026, 10:22 AM', '09 May 2026, 11:55 AM', '09 May 2026, 12:31 PM',
    '09 May 2026, 01:08 PM', '09 May 2026, 02:44 PM', '09 May 2026, 03:19 PM',
    '09 May 2026, 04:02 PM',
  ];
  return {
    id: i,
    hash,
    block: 583201 + i,
    time: times[i % times.length],
    voterHash: voters[i % voters.length],
    status: 'Confirmed',
    confirmations: 12,
  };
}

const TRANSACTIONS = Array.from({ length: 10 }, (_, i) => generateTx(i));

const ELECTION_INFO = {
  '1': { title: 'General Student Council Election 2026', totalVotes: 830, integrity: 98.7, contract: '0x7f3ac4...b2e9', startDate: '07 May 2026', endDate: '13 May 2026' },
  '2': { title: 'Faculty Representative Vote — Spring 2026', totalVotes: 210, integrity: 99.2, contract: '0x3a9bd1...c4f7', startDate: '05 May 2026', endDate: '15 May 2026' },
  '3': { title: 'Departmental Committee Election — F23', totalVotes: 320, integrity: 100, contract: '0x8c2ef5...a1d3', startDate: '01 Apr 2026', endDate: '05 Apr 2026' },
};

function VerifyBox() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);

  const verify = () => {
    if (!hash.trim()) return;
    // Mock verification
    if (hash.startsWith('0x') && hash.length > 10) {
      setResult({ found: true, block: 583214, time: '09 May 2026, 02:44 PM', confirmations: 12 });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <div className="card card-violet" style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
        Verify Your Vote
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem' }}>
        Paste your transaction hash to confirm it exists on the blockchain
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input className="field-input field-input-no-icon" style={{ flex: 1 }}
          placeholder="Paste your 0x transaction hash..."
          value={hash} onChange={e => setHash(e.target.value)} />
        <button className="btn btn-primary btn-sm" onClick={verify}>Verify</button>
      </div>
      {result && (
        <div className={`alert ${result.found ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '10px', marginBottom: 0 }}>
          {result.found
            ? `Vote verified. Found in block #${result.block} at ${result.time} with ${result.confirmations} confirmations.`
            : 'Transaction not found. Check the hash and try again.'}
        </div>
      )}
    </div>
  );
}

function AuditTrail() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const info = ELECTION_INFO[electionId] || ELECTION_INFO['1'];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const integrityColor = info.integrity >= 99 ? 'var(--emerald)' : info.integrity >= 95 ? 'var(--amber)' : 'var(--rose)';

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-sm">

          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          {/* Header */}
          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--violet2)', letterSpacing: '1px', marginBottom: '10px' }}>
              BLOCKCHAIN AUDIT TRAIL
            </div>
            <h1 className="page-title">{info.title}</h1>
            <p className="page-sub">Full on-chain transaction log. Every vote is recorded as an immutable blockchain transaction.</p>
          </div>

          {/* Integrity score */}
          <div className="card fade-in-d1" style={{ marginBottom: '1.5rem', borderColor: `${integrityColor}33` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text3)', marginBottom: '6px' }}>Election Integrity Score</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '3rem', fontWeight: 800, color: integrityColor, lineHeight: 1 }}>
                  {info.integrity}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Calculated from block confirmations, zero disputes, zero duplicate attempts
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { k: 'Total Votes', v: info.totalVotes.toLocaleString() },
                  { k: 'Contract', v: info.contract },
                  { k: 'Start Date', v: info.startDate },
                  { k: 'End Date', v: info.endDate },
                ].map(r => (
                  <div key={r.k} style={{ padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{r.k}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', fontFamily: r.k === 'Contract' ? 'monospace' : 'inherit' }}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Integrity bar */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: visible ? `${info.integrity}%` : '0%', background: `linear-gradient(90deg, ${integrityColor}, ${integrityColor}99)`, borderRadius: 3, transition: 'width 1.5s ease' }} />
              </div>
            </div>
          </div>

          {/* Verify your vote */}
          <VerifyBox />

          {/* Transaction log */}
          <div className="section-title fade-in">Transaction Log (Latest {TRANSACTIONS.length} of {info.totalVotes})</div>
          <div className="card fade-in-d2" style={{ padding: '0' }}>
            {TRANSACTIONS.map((tx, i) => (
              <div key={tx.id} style={{
                padding: '1rem 1.5rem',
                borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', flexShrink: 0 }} />
                    <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--violet2)', fontWeight: 600 }}>{tx.hash}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                    Block #{tx.block} · Voter {tx.voterHash} · {tx.confirmations} confirmations
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '3px' }}>{tx.time}</div>
                  <span className="badge badge-live" style={{ fontSize: '0.65rem' }}>
                    <span className="badge-dot" />Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            Only the last {TRANSACTIONS.length} transactions are shown. All {info.totalVotes.toLocaleString()} votes are permanently stored on the blockchain and independently verifiable.
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuditTrail;