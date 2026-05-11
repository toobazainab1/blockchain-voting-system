import React from 'react';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const STEPS = [
  { num: '01', title: 'Register Your Identity', desc: 'Create an account using your CNIC as your unique voter ID. Your identity is verified and a cryptographic key pair is generated for your account.', icon: '📋' },
  { num: '02', title: 'Browse Active Elections', desc: 'Log in to your dashboard to see all active elections you are eligible to vote in, along with candidate details, manifestos, and live turnout data.', icon: '🗂️' },
  { num: '03', title: 'Select Your Candidate', desc: 'Review all candidates and their platforms. Select the candidate you wish to support and review your selection before confirming.', icon: '🗳️' },
  { num: '04', title: 'Vote is Encrypted', desc: 'Your vote is encrypted with the election public key before leaving your device. This ensures that your selection cannot be linked back to your identity.', icon: '🔐' },
  { num: '05', title: 'Broadcast to Blockchain', desc: 'The encrypted vote is packaged into a blockchain transaction and broadcast to the network nodes for validation.', icon: '📡' },
  { num: '06', title: 'Smart Contract Validates', desc: 'The smart contract checks: is this voter registered? Have they voted before? Is the election still open? If all checks pass, the vote is accepted.', icon: '🧠' },
  { num: '07', title: 'Vote Added to Block', desc: 'Once validated, your vote is permanently added to the blockchain. You receive a transaction hash as your cryptographic receipt.', icon: '⛓️' },
  { num: '08', title: 'Results Tallied On-Chain', desc: 'When the election closes, the smart contract automatically tallies all votes and publishes the final result — no manual counting, no delays.', icon: '📊' },
];

function HowItWorks() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap-sm">

          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="fade-in">
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px' }}>
              HOW IT WORKS
            </div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
              From identity to <span className="grad-text">immutable vote</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Every step in the BlockVote process is designed for maximum security, transparency, and verifiability.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={`how-step fade-in`} style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                <div className="how-num">{s.num}</div>
                <div style={{ flex: 1 }}>
                  <div className="how-title">{s.icon} {s.title}</div>
                  <div className="how-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card fade-in" style={{ marginTop: '2rem', background: 'rgba(96,165,250,0.05)', borderColor: 'rgba(96,165,250,0.2)', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Verify any vote yourself</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
              Every transaction on BlockVote can be independently verified using its transaction hash on our blockchain explorer — no trust required.
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HowItWorks;