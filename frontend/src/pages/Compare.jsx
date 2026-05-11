import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar, { AuroraBg } from '../components/Navbar';
import Footer from '../components/Footer';

const ALL_CANDIDATES = {
  '1': [
    { _id: 'c1', name: 'Ahmed Raza', party: 'Progress Alliance', avatarCls: 'avatar-v', color: '#a78bfa',
      manifesto: 'Modernising campus facilities and improving student welfare programmes across all faculties.',
      policies: [
        { topic: 'Campus Facilities', stance: 'Upgrade all labs and libraries by semester end', score: 90 },
        { topic: 'Student Welfare', stance: 'Introduce mental health support programmes', score: 85 },
        { topic: 'Transparency', stance: 'Monthly public council reports', score: 80 },
        { topic: 'Scholarships', stance: 'Expand merit-based aid by 20%', score: 75 },
        { topic: 'Digital Access', stance: 'Free Wi-Fi in all campus zones', score: 88 },
      ],
      experience: '2 years on student committee', education: '3rd year BSSE',
    },
    { _id: 'c2', name: 'Sara Khan', party: 'Unity Front', avatarCls: 'avatar-c', color: '#60a5fa',
      manifesto: 'Bridging the gap between students and faculty through transparent governance and open dialogue.',
      policies: [
        { topic: 'Campus Facilities', stance: 'Prioritise clean and safe spaces', score: 75 },
        { topic: 'Student Welfare', stance: 'Open dialogue forums every week', score: 92 },
        { topic: 'Transparency', stance: 'Live streaming of all council meetings', score: 95 },
        { topic: 'Scholarships', stance: 'Need-based aid reform', score: 80 },
        { topic: 'Digital Access', stance: 'Student digital literacy workshops', score: 70 },
      ],
      experience: '1 year as class rep', education: '3rd year BSSE',
    },
    { _id: 'c3', name: 'Bilal Ahmed', party: 'Independent', avatarCls: 'avatar-r', color: '#34d399',
      manifesto: 'Promoting merit-based opportunities and expanding scholarship programmes for deserving students.',
      policies: [
        { topic: 'Campus Facilities', stance: 'Focus budget on academic resources only', score: 65 },
        { topic: 'Student Welfare', stance: 'Peer mentorship programme', score: 78 },
        { topic: 'Transparency', stance: 'Independent audit of council funds', score: 88 },
        { topic: 'Scholarships', stance: 'Double scholarship pool in 2 years', score: 95 },
        { topic: 'Digital Access', stance: 'Open source software for all students', score: 72 },
      ],
      experience: 'Academic achiever, no council exp.', education: '4th year BSSE',
    },
    { _id: 'c4', name: 'Hina Malik', party: 'Future Forward', avatarCls: 'avatar-a', color: '#f472b6',
      manifesto: 'Integrating technology into learning with smart classrooms, digital resources, and innovation labs.',
      policies: [
        { topic: 'Campus Facilities', stance: 'Build 2 new innovation labs', score: 95 },
        { topic: 'Student Welfare', stance: 'App-based student services platform', score: 80 },
        { topic: 'Transparency', stance: 'Digital dashboard for all decisions', score: 85 },
        { topic: 'Scholarships', stance: 'Tech-skills based scholarships', score: 70 },
        { topic: 'Digital Access', stance: 'Smart classrooms in every department', score: 98 },
      ],
      experience: '3 years tech society lead', education: '3rd year BSSE',
    },
  ],
  '2': [
    { _id: 'c5', name: 'Dr. Usman Ali', party: 'Academic Excellence', avatarCls: 'avatar-v', color: '#a78bfa',
      manifesto: 'Raising research output and securing international academic partnerships.',
      policies: [
        { topic: 'Research Output', stance: 'Double published papers in 2 years', score: 92 },
        { topic: 'Student Support', stance: 'Research assistant stipends', score: 80 },
        { topic: 'Partnerships', stance: '3 international university MOUs', score: 95 },
        { topic: 'Curriculum', stance: 'Industry-aligned course updates', score: 85 },
      ],
      experience: '10 years faculty', education: 'PhD Computer Science',
    },
    { _id: 'c6', name: 'Prof. Nadia', party: 'Student First', avatarCls: 'avatar-c', color: '#60a5fa',
      manifesto: 'Advocating for better student support, improved grading transparency, and accessible counselling.',
      policies: [
        { topic: 'Research Output', stance: 'Undergraduate research programme', score: 72 },
        { topic: 'Student Support', stance: 'Free counselling for all students', score: 98 },
        { topic: 'Partnerships', stance: 'Industry internship partnerships', score: 80 },
        { topic: 'Curriculum', stance: 'Transparent grading rubrics', score: 90 },
      ],
      experience: '7 years faculty', education: 'MSc Software Engineering',
    },
    { _id: 'c7', name: 'Kamran Shah', party: 'Reform Party', avatarCls: 'avatar-r', color: '#34d399',
      manifesto: 'Streamlining administrative processes and creating a more responsive faculty board.',
      policies: [
        { topic: 'Research Output', stance: 'Streamline paper submission process', score: 78 },
        { topic: 'Student Support', stance: 'Digital complaint resolution system', score: 85 },
        { topic: 'Partnerships', stance: 'Focus on local industry ties', score: 70 },
        { topic: 'Curriculum', stance: 'Cut bureaucratic delays in approvals', score: 92 },
      ],
      experience: '5 years faculty', education: 'MSc Information Technology',
    },
  ],
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function Compare() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const candidates = ALL_CANDIDATES[electionId] || ALL_CANDIDATES['1'];
  const [leftId, setLeftId] = useState(candidates[0]._id);
  const [rightId, setRightId] = useState(candidates[1]._id);

  const left  = candidates.find(c => c._id === leftId);
  const right = candidates.find(c => c._id === rightId);
  const topics = left?.policies.map(p => p.topic) || [];

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <Navbar />
      <div className="page">
        <div className="wrap">

          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '1px', marginBottom: '10px' }}>
              CANDIDATE COMPARISON
            </div>
            <h1 className="page-title">Compare Candidates</h1>
            <p className="page-sub">Select two candidates to compare their policies, stances, and platform scores side by side.</p>
          </div>

          {/* Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }} className="fade-in fade-in-d1">
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>Left candidate</label>
              <select className="field-input field-input-no-icon"
                value={leftId} onChange={e => setLeftId(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}>
                {candidates.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 800, color: 'var(--text3)', textAlign: 'center', paddingTop: '24px' }}>VS</div>
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>Right candidate</label>
              <select className="field-input field-input-no-icon"
                value={rightId} onChange={e => setRightId(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}>
                {candidates.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Candidate headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="fade-in fade-in-d2">
            {[left, right].map((c, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', borderColor: `${c.color}44` }}>
                <div className={`avatar avatar-lg ${c.avatarCls}`} style={{ margin: '0 auto 10px' }}>
                  {getInitials(c.name)}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, marginBottom: '3px' }}>{c.name}</div>
                <div style={{ fontSize: '0.82rem', color: c.color, fontWeight: 600, marginBottom: '8px' }}>{c.party}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', lineHeight: 1.6, marginBottom: '10px' }}>{c.manifesto}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{c.education}</span>
                  <span style={{ padding: '3px 8px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{c.experience}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Policy comparison */}
          <div className="section-title fade-in fade-in-d2">Policy Comparison</div>
          <div className="card fade-in fade-in-d3" style={{ padding: 0 }}>
            {topics.map((topic, i) => {
              const lp = left.policies.find(p => p.topic === topic);
              const rp = right.policies.find(p => p.topic === topic);
              const lWins = lp?.score > rp?.score;
              const rWins = rp?.score > lp?.score;
              return (
                <div key={topic} style={{ padding: '1.25rem 1.5rem', borderBottom: i < topics.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text3)', textAlign: 'center', marginBottom: '12px' }}>
                    {topic}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
                    {/* Left */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', color: lWins ? left.color : 'var(--text2)', fontWeight: lWins ? 600 : 400, marginBottom: '6px', lineHeight: 1.5 }}>{lp?.stance}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${lp?.score}%`, background: left.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.85rem', fontWeight: 700, color: lWins ? left.color : 'var(--text3)' }}>{lp?.score}</span>
                      </div>
                    </div>
                    {/* Middle */}
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text3)', textAlign: 'center', padding: '0 4px' }}>
                      {lWins ? '←' : rWins ? '→' : '='}
                    </div>
                    {/* Right */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', color: rWins ? right.color : 'var(--text2)', fontWeight: rWins ? 600 : 400, marginBottom: '6px', lineHeight: 1.5 }}>{rp?.stance}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.85rem', fontWeight: 700, color: rWins ? right.color : 'var(--text3)' }}>{rp?.score}</span>
                        <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${rp?.score}%`, background: right.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }} className="fade-in fade-in-d4">
            {[left, right].map((c, i) => {
              const avg = Math.round(c.policies.reduce((s, p) => s + p.score, 0) / c.policies.length);
              return (
                <div key={i} className="card" style={{ textAlign: 'center', borderColor: `${c.color}33` }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text3)', marginBottom: '6px' }}>Overall Platform Score</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>{avg}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: '4px' }}>{c.name}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
              onClick={() => navigate(`/ballot/${electionId}`)}>
              <div className="btn-shimmer" />Go Vote Now
            </button>
            <button className="btn btn-ghost" style={{ width: 'auto', padding: '12px 24px' }}
              onClick={() => navigate(`/results/${electionId}`)}>
              View Results
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Compare;