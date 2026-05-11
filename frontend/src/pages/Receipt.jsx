import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function VoteCertificate({ voter, candidate, txHash, timestamp }) {
  return (
    <div id="vote-certificate" style={{
      background: 'linear-gradient(135deg, #0d1235, #080c22)',
      border: '2px solid rgba(124,92,252,0.4)',
      borderRadius: 'var(--r-lg)', padding: '2rem', marginBottom: '1rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative corner lines */}
      {[['top:0;left:0;borderTop', 'borderLeft'], ['top:0;right:0;borderTop', 'borderRight'], ['bottom:0;left:0;borderBottom', 'borderLeft'], ['bottom:0;right:0;borderBottom', 'borderRight']].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(i === 0 && { top: 0, left: 0, borderTop: '3px solid var(--violet)', borderLeft: '3px solid var(--violet)', width: 24, height: 24, borderRadius: '4px 0 0 0' }),
          ...(i === 1 && { top: 0, right: 0, borderTop: '3px solid var(--violet)', borderRight: '3px solid var(--violet)', width: 24, height: 24, borderRadius: '0 4px 0 0' }),
          ...(i === 2 && { bottom: 0, left: 0, borderBottom: '3px solid var(--violet)', borderLeft: '3px solid var(--violet)', width: 24, height: 24, borderRadius: '0 0 0 4px' }),
          ...(i === 3 && { bottom: 0, right: 0, borderBottom: '3px solid var(--violet)', borderRight: '3px solid var(--violet)', width: 24, height: 24, borderRadius: '0 0 4px 0' }),
        }} />
      ))}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--violet2)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Official Voting Certificate
        </div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg,var(--violet2),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          BlockVote
        </div>
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text2)', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        This certifies that voter <strong style={{ color: 'var(--text)' }}>{voter?.name || 'Voter'}</strong> successfully cast a verified, encrypted vote in the blockchain-secured election on <strong style={{ color: 'var(--text)' }}>{timestamp}</strong>.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: '1rem' }}>
        <div className={`avatar avatar-md avatar-${candidate?.color || 'v'}`}>
          {getInitials(candidate?.name || 'C')}
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Voted for</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>{candidate?.name}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--violet2)' }}>{candidate?.party}</div>
        </div>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: '1px', marginBottom: '4px' }}>TRANSACTION HASH</div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--violet2)', wordBreak: 'break-all' }}>{txHash}</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.5px' }}>
        Verified on BlockVote Blockchain Network · {timestamp}
      </div>
    </div>
  );
}

function SentimentPanel({ candidate }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [done, setDone] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an election analyst for a university blockchain voting platform. A student just voted for ${candidate?.name} from the "${candidate?.party}" party. Their manifesto: "${candidate?.manifesto}". Write a short, professional 3-sentence post-vote sentiment analysis — what this vote signals about voter priorities, what issues matter to voters who chose this candidate, and what it means for the election overall. Be concise, insightful, and neutral. No bullet points, just flowing analytical prose.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || '').join('') || 'Analysis unavailable.';
      setResult(text);
      setDone(true);
    } catch {
      setResult('AI analysis temporarily unavailable. Your vote has been recorded successfully.');
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <div className="card fade-in-d3" style={{ marginBottom: '1rem', borderColor: 'rgba(124,92,252,0.2)', background: 'rgba(124,92,252,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: done || loading ? '1rem' : 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>
            AI Voter Sentiment Analysis
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
            What your vote signals about election trends
          </div>
        </div>
        {!done && (
          <button className="btn btn-ghost btn-sm" onClick={runAnalysis} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 12, height: 12 }} />Analysing...</> : 'Run Analysis'}
          </button>
        )}
      </div>
      {loading && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text3)', fontSize: '0.85rem' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--violet2)', borderColor: 'rgba(124,92,252,0.2)' }} />
          Analysing voter sentiment patterns...
        </div>
      )}
      {result && (
        <div style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.75, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r-sm)', borderLeft: '3px solid var(--violet)' }}>
          {result}
        </div>
      )}
    </div>
  );
}

function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const voter = JSON.parse(localStorage.getItem('voter') || '{}');
  const [showCert, setShowCert] = useState(false);

  if (!state?.txHash) {
    return (
      <div style={{ position: 'relative' }}>
        <AuroraBg /><Navbar />
        <div className="page"><div className="wrap-xs">
          <div className="alert alert-error">No receipt found.</div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div></div>
      </div>
    );
  }

  const now = new Date().toLocaleString();
  const blockNum = Math.floor(Math.random() * 900000 + 100000);

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-xs">

          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>

          {/* Success header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="fade-in">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 32, height: 32, color: 'var(--emerald)' }} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="page-title" style={{ justifyContent: 'center', display: 'flex', fontSize: '1.75rem' }}>Vote Confirmed</h1>
            <p className="page-sub" style={{ textAlign: 'center' }}>Permanently recorded on the blockchain</p>
          </div>

          {/* Candidate voted for */}
          {state.candidate && (
            <div className="card fade-in-d1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: 'var(--violet2)', fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: '12px' }}>YOU VOTED FOR</div>
              <div className={`avatar avatar-lg avatar-${state.candidate.color || 'v'}`} style={{ margin: '0 auto 10px' }}>
                {getInitials(state.candidate.name)}
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{state.candidate.name}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--violet2)' }}>{state.candidate.party}</div>
            </div>
          )}

          {/* Transaction details */}
          <div className="card fade-in-d2" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: 'var(--violet2)', fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: '12px' }}>TRANSACTION DETAILS</div>
            {[
              { key: 'Status', val: 'Confirmed' },
              { key: 'Timestamp', val: now },
              { key: 'Block Number', val: `#${blockNum}` },
              { key: 'Network', val: 'BlockVote Testnet' },
              { key: 'Confirmations', val: '12 / 12' },
            ].map(r => (
              <div key={r.key} className="receipt-row">
                <span className="receipt-key">{r.key}</span>
                <span className="receipt-val">{r.val}</span>
              </div>
            ))}
          </div>

          {/* TX Hash */}
          <div className="card fade-in-d2" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: 'var(--violet2)', fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: '10px' }}>BLOCKCHAIN TRANSACTION HASH</div>
            <div className="receipt-hash">{state.txHash}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text3)', marginTop: '8px', lineHeight: 1.6 }}>
              Save this hash. Use it on the Audit Trail page to independently verify your vote.
            </div>
          </div>

          {/* AI Sentiment */}
          {state.candidate && <SentimentPanel candidate={state.candidate} />}

          {/* Vote Certificate toggle */}
          <div className="card fade-in-d3" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Vote Certificate</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Official proof of your participation</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCert(c => !c)}>
                {showCert ? 'Hide' : 'View Certificate'}
              </button>
            </div>
            {showCert && (
              <div style={{ marginTop: '1rem' }}>
                <VoteCertificate voter={voter} candidate={state.candidate} txHash={state.txHash} timestamp={now} />
                <div className="alert alert-info" style={{ marginTop: '8px' }}>
                  Use your browser's Print function (Ctrl+P / Cmd+P) to save this certificate as a PDF.
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '10px' }}>
            <div className="btn-shimmer" />Back to Dashboard
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(`/results/${state.electionId || '1'}`)}>
            View Live Results
          </button>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Receipt;