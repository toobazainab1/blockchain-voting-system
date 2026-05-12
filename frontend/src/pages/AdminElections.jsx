import React, { useState, useEffect } from 'react';
import AdminNavbar, { AuroraBg } from '../components/AdminNavbar';
import Footer from '../components/Footer';
import contractData from '../contracts/BlockVote.json';

const CONTRACT_ADDRESS = contractData.address;
const ABI = contractData.abi;
const API = 'http://localhost:5000/api';

function AdminElections() {
  const token = localStorage.getItem('adminToken');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // Candidate rows inside the form
  const [form, setForm] = useState({
    title: '', category: 'Student Council',
    description: '', startDate: '', endDate: '',
  });
  const [candidates, setCandidates] = useState([
    { name: '', party: '', manifesto: '' },
    { name: '', party: '', manifesto: '' },
  ]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!window.ethereum) { setError('MetaMask not found. Install it to record elections on blockchain.'); return; }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setSuccess('Wallet connected: ' + accounts[0].slice(0, 10) + '...');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Wallet connection rejected.');
    }
  };

  // Load elections from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/elections`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setElections(data.elections);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []); // eslint-disable-line

  const addCandidateRow = () => setCandidates(c => [...c, { name: '', party: '', manifesto: '' }]);
  const removeCandidateRow = i => setCandidates(c => c.filter((_, idx) => idx !== i));
  const updateCandidate = (i, k, v) => setCandidates(c => c.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  const handleCreate = async () => {
    setError('');
    if (!form.title || !form.startDate || !form.endDate || !form.description) {
      setError('Please fill in all election fields.'); return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError('End date must be after start date.'); return;
    }
    const validCandidates = candidates.filter(c => c.name.trim() && c.party.trim());
    if (validCandidates.length < 2) {
      setError('Please add at least 2 candidates with name and party.'); return;
    }
    setFormLoading(true);
    try {
      // 1. Create election in MongoDB
      const eRes = await fetch(`${API}/elections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      const eData = await eRes.json();
      if (!eData.success) throw new Error(eData.message);
      const electionId = eData.election._id;

      // 2. Also create on blockchain if wallet connected
      if (window.ethereum && walletAddress) {
        try {
          const { ethers } = await import('ethers');
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          const startTs = Math.floor(new Date(form.startDate).getTime() / 1000);
          const endTs = Math.floor(new Date(form.endDate).getTime() / 1000);
          const tx = await contract.createElection(form.title, form.category, startTs, endTs);
          await tx.wait();
        } catch (bcErr) {
          console.warn('Blockchain election creation failed:', bcErr.message);
        }
      }

      // 3. Add candidates to MongoDB
      const avatarOptions = ['avatar-v', 'avatar-c', 'avatar-r', 'avatar-a', 'avatar-b'];
      for (let i = 0; i < validCandidates.length; i++) {
        const c = validCandidates[i];
        await fetch(`${API}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            electionId,
            name: c.name,
            party: c.party,
            manifesto: c.manifesto || '',
            avatarCls: avatarOptions[i % avatarOptions.length],
          }),
        });
      }

      // 4. Refresh list
      const refreshRes = await fetch(`${API}/elections`, { headers: { Authorization: `Bearer ${token}` } });
      const refreshData = await refreshRes.json();
      if (refreshData.success) setElections(refreshData.elections);

      setForm({ title: '', category: 'Student Council', description: '', startDate: '', endDate: '' });
      setCandidates([{ name: '', party: '', manifesto: '' }, { name: '', party: '', manifesto: '' }]);
      setShowForm(false);
      setSuccess(`Election "${form.title}" created with ${validCandidates.length} candidates!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create election.');
    }
    setFormLoading(false);
  };

  const handleClose = async (id) => {
    try {
      const res = await fetch(`${API}/elections/${id}/close`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setElections(e => e.map(el => el._id === id ? { ...el, status: 'closed' } : el));
        setSuccess('Election closed successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this election and all its candidates?')) return;
    try {
      await fetch(`${API}/elections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(e => e.filter(el => el._id !== id));
      setSuccess('Election deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <AdminNavbar />
      <div className="page">
        <div className="wrap">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }} className="fade-in">
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Admin</div>
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Elections</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Wallet connect button */}
              <button className={`btn btn-sm ${walletAddress ? 'btn-ghost' : 'btn-secondary'}`} onClick={connectWallet}
                style={{ borderColor: walletAddress ? 'var(--emerald)' : undefined, color: walletAddress ? 'var(--emerald)' : undefined }}>
                {walletAddress
                  ? <>🟢 {walletAddress.slice(0, 8)}...</>
                  : <>🔗 Connect Wallet</>}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowForm(f => !f)}>
                <div className="btn-shimmer" />{showForm ? 'Cancel' : '+ Create Election'}
              </button>
            </div>
          </div>

          {success && <div className="alert alert-success fade-in">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Create form */}
          {showForm && (
            <div className="card fade-in" style={{ marginBottom: '1.5rem', borderColor: 'rgba(124,92,252,0.25)' }}>
              <div className="section-title" style={{ marginBottom: '1rem' }}>New Election</div>

              {/* Election fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label className="field-label">Election Title</label>
                  <div className="field-wrap">
                    <span className="field-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></span>
                    <input className="field-input" placeholder="e.g. Student Council Election 2026" value={form.title} onChange={set('title')} />
                  </div>
                </div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label className="field-label">Description</label>
                  <div className="field-wrap">
                    <span className="field-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg></span>
                    <input className="field-input" placeholder="Brief description of the election" value={form.description} onChange={set('description')} />
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
                <div className="field" />
                <div className="field">
                  <label className="field-label">Start Date & Time</label>
                  <input className="field-input field-input-no-icon" type="datetime-local" value={form.startDate} onChange={set('startDate')} />
                </div>
                <div className="field">
                  <label className="field-label">End Date & Time</label>
                  <input className="field-input field-input-no-icon" type="datetime-local" value={form.endDate} onChange={set('endDate')} />
                </div>
              </div>

              {/* Candidates section */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 700 }}>
                    Candidates
                  </div>
                  <button className="btn btn-ghost btn-xs" onClick={addCandidateRow}>+ Add Candidate</button>
                </div>
                {candidates.map((c, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'end' }}>
                    <div className="field" style={{ margin: 0 }}>
                      {i === 0 && <label className="field-label">Full Name</label>}
                      <input className="field-input field-input-no-icon" placeholder="Candidate name"
                        value={c.name} onChange={e => updateCandidate(i, 'name', e.target.value)} />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      {i === 0 && <label className="field-label">Party</label>}
                      <input className="field-input field-input-no-icon" placeholder="Party name"
                        value={c.party} onChange={e => updateCandidate(i, 'party', e.target.value)} />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      {i === 0 && <label className="field-label">Manifesto (optional)</label>}
                      <input className="field-input field-input-no-icon" placeholder="Brief manifesto..."
                        value={c.manifesto} onChange={e => updateCandidate(i, 'manifesto', e.target.value)} />
                    </div>
                    <button onClick={() => removeCandidateRow(i)} disabled={candidates.length <= 2}
                      style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--rose)', borderRadius: 'var(--r-sm)', padding: '8px 10px', cursor: candidates.length <= 2 ? 'not-allowed' : 'pointer', opacity: candidates.length <= 2 ? 0.4 : 1, marginBottom: '1px' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" onClick={handleCreate} disabled={formLoading}>
                {formLoading
                  ? <><div className="spinner" />Creating election...</>
                  : <><div className="btn-shimmer" />Create Election + Add Candidates</>}
              </button>
            </div>
          )}

          {/* Elections list */}
          <div className="section-title fade-in">All Elections ({elections.length})</div>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />Loading elections...
            </div>
          ) : elections.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
              No elections yet. Create your first election above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {elections.map(e => (
                <div key={e._id} className="card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge ${e.status === 'open' ? 'badge-live' : 'badge-closed'}`}>
                        {e.status === 'open' && <span className="badge-dot" />}
                        {e.status === 'open' ? 'Live' : 'Closed'}
                      </span>
                      <span className="badge" style={{ background: 'var(--surface)', color: 'var(--text3)', border: '1px solid var(--border)', fontSize: '0.68rem' }}>{e.category}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{e.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                      {new Date(e.startDate).toLocaleDateString()} → {new Date(e.endDate).toLocaleDateString()} · {e.votedCount || 0} votes
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {e.status === 'open' && (
                      <button className="btn btn-danger btn-xs" onClick={() => handleClose(e._id)}>Close</button>
                    )}
                    <button className="btn btn-ghost btn-xs" onClick={() => window.open(`/results/${e._id}`, '_blank')}>Results</button>
                    <button className="btn btn-ghost btn-xs" onClick={() => handleDelete(e._id)}
                      style={{ color: 'var(--rose)', borderColor: 'rgba(244,63,94,0.3)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminElections;