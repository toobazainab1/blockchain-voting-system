import React, { useState } from 'react';
import AdminNavbar, { AuroraBg } from '../components/AdminNavbar';
import Footer from '../components/Footer';

const ELECTIONS = [
  { id: '1', title: 'General Student Council Election 2026' },
  { id: '2', title: 'Faculty Representative Vote — Spring 2026' },
  { id: '3', title: 'Departmental Committee Election — F23' },
];

const INITIAL_CANDIDATES = [
  { id: 'c1', electionId: '1', electionTitle: 'General Student Council Election 2026', name: 'Ahmed Raza', party: 'Progress Alliance', avatarCls: 'avatar-v' },
  { id: 'c2', electionId: '1', electionTitle: 'General Student Council Election 2026', name: 'Sara Khan', party: 'Unity Front', avatarCls: 'avatar-c' },
  { id: 'c3', electionId: '1', electionTitle: 'General Student Council Election 2026', name: 'Bilal Ahmed', party: 'Independent', avatarCls: 'avatar-r' },
  { id: 'c4', electionId: '1', electionTitle: 'General Student Council Election 2026', name: 'Hina Malik', party: 'Future Forward', avatarCls: 'avatar-a' },
  { id: 'c5', electionId: '2', electionTitle: 'Faculty Representative Vote — Spring 2026', name: 'Dr. Usman Ali', party: 'Academic Excellence', avatarCls: 'avatar-v' },
  { id: 'c6', electionId: '2', electionTitle: 'Faculty Representative Vote — Spring 2026', name: 'Prof. Nadia', party: 'Student First', avatarCls: 'avatar-c' },
  { id: 'c7', electionId: '2', electionTitle: 'Faculty Representative Vote — Spring 2026', name: 'Kamran Shah', party: 'Reform Party', avatarCls: 'avatar-r' },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function AdminCandidates() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ electionId: '1', name: '', party: '', manifesto: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterElection, setFilterElection] = useState('all');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const AVATAR_CLASSES = ['avatar-v', 'avatar-c', 'avatar-r', 'avatar-a', 'avatar-g'];

  const handleAdd = async () => {
    setError('');
    if (!form.name || !form.party) { setError('Please fill in name and party.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    // TODO: call smart contract
    // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    // const tx = await contract.addCandidate(form.electionId, form.name, form.party);
    // await tx.wait();

    const election = ELECTIONS.find(e => e.id === form.electionId);
    const newCandidate = {
      id: 'c' + (candidates.length + 1),
      electionId: form.electionId,
      electionTitle: election?.title || '',
      name: form.name,
      party: form.party,
      avatarCls: AVATAR_CLASSES[candidates.length % AVATAR_CLASSES.length],
    };
    setCandidates(c => [...c, newCandidate]);
    setForm({ electionId: '1', name: '', party: '', manifesto: '' });
    setShowForm(false);
    setSuccess('Candidate added successfully to blockchain!');
    setTimeout(() => setSuccess(''), 3000);
    setLoading(false);
  };

  const filtered = filterElection === 'all' ? candidates : candidates.filter(c => c.electionId === filterElection);

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <AdminNavbar />
      <div className="page">
        <div className="wrap">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="fade-in">
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Admin</div>
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Candidates</h1>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(f => !f)}>
              <div className="btn-shimmer" />
              {showForm ? 'Cancel' : '+ Add Candidate'}
            </button>
          </div>

          {success && <div className="alert alert-success fade-in">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Add form */}
          {showForm && (
            <div className="card fade-in" style={{ marginBottom: '1.5rem', borderColor: 'rgba(124,92,252,0.25)' }}>
              <div className="section-title">New Candidate</div>
              <div className="field">
                <label className="field-label">Election</label>
                <select className="field-input field-input-no-icon" value={form.electionId} onChange={set('electionId')} style={{ appearance: 'none' }}>
                  {ELECTIONS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <input className="field-input" placeholder="Candidate full name" value={form.name} onChange={set('name')} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Party / Affiliation</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                    </span>
                    <input className="field-input" placeholder="Party or Independent" value={form.party} onChange={set('party')} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Manifesto (optional)</label>
                <textarea className="field-input field-input-no-icon" rows={3}
                  placeholder="Brief manifesto or platform description..."
                  value={form.manifesto} onChange={set('manifesto')}
                  style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
                {loading ? <><div className="spinner" />Adding to blockchain...</> : <><div className="btn-shimmer" />Add Candidate</>}
              </button>
            </div>
          )}

          {/* Filter */}
          <div className="category-tabs fade-in">
            <button className={`category-tab ${filterElection === 'all' ? 'active' : ''}`} onClick={() => setFilterElection('all')}>All</button>
            {ELECTIONS.map(e => (
              <button key={e.id} className={`category-tab ${filterElection === e.id ? 'active' : ''}`}
                onClick={() => setFilterElection(e.id)}>
                {e.title.split(' ').slice(0, 3).join(' ')}...
              </button>
            ))}
          </div>

          {/* Candidates grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {filtered.map(c => (
              <div key={c.id} className="card fade-in" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className={`avatar avatar-md ${c.avatarCls}`}>{getInitials(c.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{c.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--violet2)', fontWeight: 600, marginBottom: '4px' }}>{c.party}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', lineHeight: 1.5 }}>{c.electionTitle}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminCandidates;