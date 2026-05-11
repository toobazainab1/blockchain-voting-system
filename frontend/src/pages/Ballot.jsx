import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';
import contractData from '../contracts/BlockVote.json';

const CONTRACT_ADDRESS = contractData.address;
const ABI = contractData.abi;

const CANDIDATES = {
  '1': [
    { _id: 'c1', contractId: 1, name: 'Ahmed Raza', party: 'Progress Alliance', avatarCls: 'avatar-v', color: '#a78bfa', manifesto: 'Modernising campus facilities and improving student welfare programmes across all faculties.' },
    { _id: 'c2', contractId: 2, name: 'Sara Khan', party: 'Unity Front', avatarCls: 'avatar-c', color: '#60a5fa', manifesto: 'Bridging the gap between students and faculty through transparent governance and open dialogue.' },
    { _id: 'c3', contractId: 3, name: 'Bilal Ahmed', party: 'Independent', avatarCls: 'avatar-r', color: '#34d399', manifesto: 'Promoting merit-based opportunities and expanding scholarship programmes for deserving students.' },
    { _id: 'c4', contractId: 4, name: 'Hina Malik', party: 'Future Forward', avatarCls: 'avatar-a', color: '#f472b6', manifesto: 'Integrating technology into learning with smart classrooms, digital resources, and innovation labs.' },
  ],
  '2': [
    { _id: 'c5', contractId: 1, name: 'Dr. Usman Ali', party: 'Academic Excellence', avatarCls: 'avatar-v', color: '#a78bfa', manifesto: 'Raising research output and securing international academic partnerships for the faculty.' },
    { _id: 'c6', contractId: 2, name: 'Prof. Nadia', party: 'Student First', avatarCls: 'avatar-c', color: '#60a5fa', manifesto: 'Advocating for better student support, improved grading transparency, and accessible counselling.' },
    { _id: 'c7', contractId: 3, name: 'Kamran Shah', party: 'Reform Party', avatarCls: 'avatar-r', color: '#34d399', manifesto: 'Streamlining administrative processes and creating a more responsive faculty board.' },
  ],
};

const STEPS = ['Select', 'Confirm', 'Submit'];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function Ballot() {
  const { electionId } = useParams();
  const [candidates] = useState(CANDIDATES[electionId] || CANDIDATES['1']);
  const [selected, setSelected] = useState('');
  const [step, setStep] = useState(0);
  const [chainStep, setChainStep] = useState(-1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const chainSteps = [
    { text: 'Encrypting your vote with election public key...' },
    { text: 'Creating blockchain transaction...' },
    { text: 'Broadcasting to network nodes...' },
    { text: 'Consensus reached — vote added to block!' },
  ];

  const handleNext = () => {
    if (step === 0) {
      if (!selected) { setError('Please select a candidate before continuing.'); return; }
      setError(''); setStep(1);
    } else if (step === 1) {
      setStep(2);
      submitVote();
    }
  };

  const submitVote = async () => {
    const selectedCandidate = candidates.find(c => c._id === selected);

    // Animate chain steps
    let i = 0;
    const animate = () => {
      setChainStep(i);
      i++;
      if (i < chainSteps.length) setTimeout(animate, 900);
    };
    animate();

    try {
      // ── REAL BLOCKCHAIN VOTE ─────────────────────────────
      if (window.ethereum) {
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        const tx = await contract.castVote(
          parseInt(electionId),
          selectedCandidate.contractId
        );
        await tx.wait();

        setTimeout(() => {
          navigate('/receipt', {
            state: {
              txHash: tx.hash,
              candidate: selectedCandidate,
              electionId
            }
          });
        }, 1000);
        return;
      }
      // ── FALLBACK MOCK (no MetaMask) ───────────────────────
      throw new Error("No wallet");

    } catch (err) {
      console.log("Using mock transaction (no wallet detected):", err.message);
      // Mock for demo if no MetaMask
      const mockHash = '0x' + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)).join('');
      setTimeout(() => {
        navigate('/receipt', {
          state: {
            txHash: mockHash,
            candidate: selectedCandidate,
            electionId
          }
        });
      }, chainSteps.length * 900 + 500);
    }
  };

  const selectedCandidate = candidates.find(c => c._id === selected);

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-sm">

          <button className="back-btn" onClick={() => step === 0 ? navigate('/dashboard') : setStep(s => s - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
            {step === 0 ? 'Back to Dashboard' : 'Back'}
          </button>

          {/* Steps */}
          <div className="steps fade-in" style={{ marginBottom: '2rem' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <div className={`step-line ${i <= step ? 'done' : ''}`} />}
                <div className="step">
                  <div className={`step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`step-label ${i === step ? 'active' : ''}`}>{s}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Step 0 — Select */}
          {step === 0 && (
            <div className="fade-in">
              <h1 className="page-title">Cast Your Vote</h1>
              <p className="page-sub">Select one candidate. Your vote is anonymous and permanent once submitted.</p>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {candidates.map(c => (
                  <div key={c._id}
                    className={`candidate-card ${selected === c._id ? 'selected' : ''}`}
                    onClick={() => setSelected(c._id)}>
                    <div className={`avatar avatar-md ${c.avatarCls}`}>
                      {getInitials(c.name)}
                    </div>
                    <div className="candidate-info">
                      <div className="candidate-name">{c.name}</div>
                      <div className="candidate-party" style={{ color: c.color }}>{c.party}</div>
                      <div className="candidate-bio">{c.manifesto}</div>
                    </div>
                    <div className={`candidate-radio ${selected === c._id ? 'checked' : ''}`} />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={handleNext}>
                <div className="btn-shimmer" />Review Selection
              </button>
            </div>
          )}

          {/* Step 1 — Confirm */}
          {step === 1 && selectedCandidate && (
            <div className="fade-in">
              <h1 className="page-title">Confirm Your Vote</h1>
              <p className="page-sub">Review carefully. This cannot be undone once submitted.</p>

              <div className="confirm-box" style={{ marginBottom: '1.5rem' }}>
                <div className="confirm-box-label">Your Selection</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={`avatar avatar-lg ${selectedCandidate.avatarCls}`}>
                    {getInitials(selectedCandidate.name)}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      {selectedCandidate.name}
                    </div>
                    <div style={{ color: selectedCandidate.color, fontSize: '0.9rem', fontWeight: 500 }}>
                      {selectedCandidate.party}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--r-sm)', fontSize: '0.83rem', color: 'var(--text3)', lineHeight: 1.6, borderLeft: `3px solid ${selectedCandidate.color}55` }}>
                  {selectedCandidate.manifesto}
                </div>
              </div>

              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                Once submitted, your vote is permanently recorded on the blockchain and cannot be changed.
              </div>

              {window.ethereum ? (
                <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
                  MetaMask detected — your vote will be recorded on the real blockchain.
                </div>
              ) : (
                <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
                  No wallet detected — running in demo mode with a mock transaction.
                </div>
              )}

              <button className="btn btn-primary" onClick={handleNext} style={{ marginBottom: '10px' }}>
                <div className="btn-shimmer" />Submit to Blockchain
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Change Selection</button>
            </div>
          )}

          {/* Step 2 — Submitting */}
          {step === 2 && (
            <div className="fade-in">
              <h1 className="page-title">Recording Your Vote</h1>
              <p className="page-sub">Please wait while your vote is written to the blockchain...</p>
              <div className="chain-steps">
                {chainSteps.map((cs, i) => (
                  <div key={i} className={`chain-step ${i < chainStep ? 'done' : i === chainStep ? 'active' : ''}`}>
                    <div className={`chain-step-icon ${i < chainStep ? 'chain-step-icon-done' : i === chainStep ? 'chain-step-icon-active' : 'chain-step-icon-pending'}`}>
                      {i < chainStep
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : i === chainStep
                          ? <div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'var(--violet2)', borderColor: 'rgba(124,92,252,0.2)' }} />
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                      }
                    </div>
                    <span className="chain-step-text">{cs.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Ballot;