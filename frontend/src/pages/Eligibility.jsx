import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const REQUIREMENTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    iconCls: 'elig-icon-violet',
    title: 'Registered Account',
    desc: 'You must have a verified BlockVote account created with your official CNIC number. Each CNIC can only be registered once on the platform.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    iconCls: 'elig-icon-blue',
    title: 'Valid CNIC',
    desc: 'A valid Pakistani CNIC is required for identity verification. Your CNIC is used as your unique Voter ID and is stored in encrypted form. It is never shared publicly.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    iconCls: 'elig-icon-green',
    title: 'Enrolled Student or Faculty',
    desc: 'Only currently enrolled students and active faculty members of IIU are eligible to vote. Eligibility is verified against the university enrollment database during registration.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    iconCls: 'elig-icon-amber',
    title: 'One Vote Per Election',
    desc: 'Each voter may cast exactly one vote per election. This is enforced at the smart contract level on the blockchain — it is technically impossible to vote more than once, regardless of circumstances.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    iconCls: 'elig-icon-rose',
    title: 'Vote During Active Window',
    desc: 'Each election has a specific start and end date and time. Votes can only be cast while the election is open. The blockchain smart contract automatically enforces these time boundaries.',
  },
];

const CAN_VOTE = [
  'Currently enrolled IIU students (undergraduate and postgraduate)',
  'Active faculty members of IIU',
  'Administrative staff registered in the system',
  'Voters whose CNIC is verified and active',
  'Accounts in good standing with no active disqualification',
];

const CANNOT_VOTE = [
  'Alumni who are no longer enrolled',
  'Students on academic suspension',
  'Anyone who has already voted in the same election',
  'Accounts flagged for suspicious activity',
  'Unregistered individuals without a BlockVote account',
];

const FAQS = [
  {
    q: 'Can I vote from any device?',
    a: 'Yes. BlockVote works on any device with a modern web browser. For biometric login, download the BlockVote mobile app on iOS or Android.',
  },
  {
    q: 'Is my vote anonymous?',
    a: 'Yes. Your vote is cryptographically separated from your identity once submitted. The blockchain records that you voted, but not which candidate you chose. Not even administrators can see your selection.',
  },
  {
    q: 'What if I make a mistake while voting?',
    a: 'Before you submit, you have a confirmation step to review your selection. Once you click "Submit to Blockchain," your vote is final and cannot be changed. This is by design — blockchain records are immutable.',
  },
  {
    q: 'Can my vote be cancelled or deleted?',
    a: 'No. Once recorded on the blockchain, your vote becomes a permanent, tamper-proof entry. No administrator, developer, or third party can alter or delete it.',
  },
  {
    q: 'What if I lose my transaction hash?',
    a: 'Your transaction hash is your personal proof of participation. If lost, you can still verify your participation status on the Audit Trail page using your voter address, though the specific hash will not be recoverable.',
  },
  {
    q: 'How are results counted?',
    a: 'Results are tallied automatically by the smart contract on the blockchain. There is no manual counting. The moment an election closes, the contract calculates and publishes the final result.',
  },
  {
    q: 'What is the Integrity Score?',
    a: 'The Integrity Score is a percentage calculated from on-chain metrics — block confirmations, zero duplicate vote attempts, network consensus rate, and contract audit status. A score of 100% means the election is fully verified and dispute-free.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen(o => !o)}>
      <div className="faq-q">
        {q}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={open ? 'open' : ''}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

function Eligibility() {
  const navigate = useNavigate();

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

          {/* Hero */}
          <div className="elig-hero fade-in" style={{ paddingTop: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 40, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)', letterSpacing: '1px', marginBottom: '1rem' }}>
              VOTER ELIGIBILITY
            </div>
            <h1 className="mission-title" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: '1rem' }}>
              Who can <span style={{ background: 'linear-gradient(135deg,var(--violet2),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>vote</span> on BlockVote?
            </h1>
            <p className="mission-sub" style={{ fontSize: '0.92rem' }}>
              BlockVote is a secure, transparent voting platform for the IIU community. Participation requires verified identity and current enrollment status.
            </p>
          </div>

          {/* Requirements */}
          <div className="section-title fade-in fade-in-d1">Eligibility Requirements</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2.5rem' }}>
            {REQUIREMENTS.map((r, i) => (
              <div key={i} className={`elig-card fade-in`} style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className={`elig-icon ${r.iconCls}`}>{r.icon}</div>
                <div>
                  <div className="elig-title">{r.title}</div>
                  <div className="elig-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Can / Cannot vote */}
          <div className="section-title fade-in">Who Can and Cannot Vote</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }} className="fade-in fade-in-d2">
            <div className="card" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald)', letterSpacing: '1px', marginBottom: '12px' }}>
                CAN VOTE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CAN_VOTE.map((item, i) => (
                  <div key={i} className="elig-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ borderColor: 'rgba(244,63,94,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--rose)', letterSpacing: '1px', marginBottom: '12px' }}>
                CANNOT VOTE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CANNOT_VOTE.map((item, i) => (
                  <div key={i} className="elig-cross">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voting process */}
          <div className="section-title fade-in">How the Vote is Protected</div>
          <div className="card fade-in fade-in-d3" style={{ marginBottom: '2.5rem' }}>
            {[
              { step: '01', title: 'Identity Verified at Registration', desc: 'Your CNIC is checked once when you create your account. After that, your identity is cryptographically linked to your wallet address.' },
              { step: '02', title: 'Smart Contract Enforces Rules', desc: 'The blockchain smart contract automatically checks: are you registered? Have you already voted? Is the election open? All three must pass or the transaction is rejected.' },
              { step: '03', title: 'Vote Encrypted Before Submission', desc: 'Your selection is encrypted with the election public key before leaving your device. Not even the system can read your choice.' },
              { step: '04', title: 'Permanent On-Chain Record', desc: 'Once confirmed, your vote is part of an immutable blockchain record. It cannot be changed, deleted, or disputed.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div className="how-num" style={{ flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div className="how-title">{s.title}</div>
                  <div className="how-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="section-title fade-in">Frequently Asked Questions</div>
          <div className="card fade-in fade-in-d4" style={{ marginBottom: '2rem' }}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>

          {/* CTA */}
          <div className="card fade-in" style={{ textAlign: 'center', padding: '2rem', borderColor: 'rgba(124,92,252,0.2)', background: 'rgba(124,92,252,0.05)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
              Ready to participate?
            </div>
            <div style={{ fontSize: '0.87rem', color: 'var(--text2)', marginBottom: '1.25rem' }}>
              Your vote matters. Every election on BlockVote is transparent, secure, and permanently auditable.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-primary" style={{ width: 'auto', padding: '11px 24px' }}
                onClick={() => navigate('/dashboard')}>
                <div className="btn-shimmer" />Go to Dashboard
              </button>
              <button className="btn btn-ghost" style={{ width: 'auto', padding: '11px 20px' }}
                onClick={() => navigate('/register')}>
                Register Now
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Eligibility;