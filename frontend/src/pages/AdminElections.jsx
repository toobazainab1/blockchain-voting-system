import React, { useState } from 'react';
import AdminNavbar, { AuroraBg } from '../components/AdminNavbar';
import Footer from '../components/Footer';

const INITIAL_ELECTIONS = [
  { id: '1', title: 'General Student Council Election 2026', category: 'Student Council', status: 'open', candidates: 4, totalVotes: 830, startDate: '07 May 2026', endDate: '13 May 2026' },
  { id: '2', title: 'Faculty Representative Vote — Spring 2026', category: 'Faculty', status: 'open', candidates: 3, totalVotes: 210, startDate: '05 May 2026', endDate: '15 May 2026' },
  { id: '3', title: 'Departmental Committee Election — F23', category: 'Department', status: 'closed', candidates: 5, totalVotes: 320, startDate: '01 Apr 2026', endDate: '05 Apr 2026' },
];

function AdminElections() {
  const [elections, setElections] = useState(INITIAL_ELECTIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Student Council', startDate: '', endDate: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    setError('');
    if (!form.title || !form.startDate || !form.endDate) { setError('Please fill in all fields.'); return; }
    if (new Date(form.endDate) <= new Date(form.startDate)) { setError('End date must be after start date.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    // TODO: call smart contract
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await provider.getSigner();
    // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    // const startTimestamp = Math.floor(new Date(form.startDate).getTime() / 1000);
    // const endTimestamp = Math.floor(new Date(form.endDate).getTime() / 1000);
    // const tx = await contract.createElection(form.title, form.category, startTimestamp, endTimestamp);
    // await tx.wait();

    const newElection = {
      id: String(elections.length + 1),
      title: form.title,
      category: form.category,
      status: 'pending',
      candidates: 0,
      totalVotes: 0,
      startDate: new Date(form.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: new Date(form.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setElections(e => [...e, newElection]);
    setForm({ title: '', category: 'Student Council', startDate: '', endDate: '' });
    setShowForm(false);
    setSuccess('Election created successfully on blockchain!');
    setTimeout(() => setSuccess(''), 3000);
    setLoading(false);
  };

  const handleClose = (id) => {
    setElections(e => e.map(el => el.id === id ? { ...el, status: 'closed' } : el));
    setSuccess('Election closed successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <AdminNavbar />
      <div className="page">
        <div className="wrap">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="fade-in">
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Admin</div>
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Elections</h1>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(f => !f)}>
              <div className="btn-shimmer" />
              {showForm ? 'Cancel' : '+ Create Election'}
            </button>
          </div>

          {success && <div className="alert alert-success fade-in">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Create form */}
          {showForm && (
            <div className="card fade-in" style={{ marginBottom: '1.5rem', borderColor: 'rgba(124,92,252,0.25)' }}>
              <div className="section-title">New Election</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label className="field-label">Election Title</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </span>
                    <input className="field-input" placeholder="e.g. Student Council Election 2026" value={form.title} onChange={set('title')} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Category</label>
                  <select className="field-input field-input-no-icon" value={form.category} onChange={set('category')} style={{ appearance: 'none' }}>
                    <option>Student Council</option>
                    <option>Faculty</option>
                    <option>Department</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Start Date</label>
                  <input className="field-input field-input-no-icon" type="datetime-local" value={form.startDate} onChange={set('startDate')} />
                </div>
                <div className="field">
                  <label className="field-label">End Date</label>
                  <input className="field-input field-input-no-icon" type="datetime-local" value={form.endDate} onChange={set('endDate')} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                {loading ? <><div className="spinner" />Creating on blockchain...</> : <><div className="btn-shimmer" />Create Election</>}
              </button>
            </div>
          )}

          {/* Elections list */}
          <div className="section-title fade-in">All Elections</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {elections.map(e => (
              <div key={e.id} className="card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className={`badge ${e.status === 'open' ? 'badge-live' : e.status === 'pending' ? 'badge-pending' : 'badge-closed'}`}>
                      {e.status === 'open' && <span className="badge-dot" />}
                      {e.status === 'open' ? 'Live' : e.status === 'pending' ? 'Pending' : 'Closed'}
                    </span>
                    <span className="badge" style={{ background: 'var(--surface)', color: 'var(--text3)', border: '1px solid var(--border)', fontSize: '0.68rem' }}>{e.category}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{e.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                    {e.startDate} → {e.endDate} · {e.candidates} candidates · {e.totalVotes.toLocaleString()} votes
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {e.status === 'open' && (
                    <button className="btn btn-danger btn-xs" onClick={() => handleClose(e.id)}>Close Election</button>
                  )}
                  <button className="btn btn-ghost btn-xs" onClick={() => window.open(`/results/${e.id}`, '_blank')}>View Results</button>
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

export default AdminElections;