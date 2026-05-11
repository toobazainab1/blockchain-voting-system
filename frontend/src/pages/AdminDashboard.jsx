import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar, { AuroraBg } from '../components/AdminNavbar';
import Footer from '../components/Footer';

const STATS = [
  { label: 'Total Elections', value: '3', sub: '2 active', iconCls: 'stat-icon-violet',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { label: 'Total Candidates', value: '7', sub: 'across all elections', iconCls: 'stat-icon-cyan',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { label: 'Total Votes Cast', value: '1,040', sub: 'on blockchain', iconCls: 'stat-icon-emerald',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
  { label: 'Avg Integrity', value: '99.3%', sub: 'all elections', iconCls: 'stat-icon-rose',
    Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
];

const RECENT = [
  { action: 'Election Created', detail: 'General Student Council Election 2026', time: '2 days ago', type: 'create' },
  { action: 'Candidate Added', detail: 'Ahmed Raza → Student Council Election', time: '2 days ago', type: 'add' },
  { action: 'Election Opened', detail: 'Faculty Representative Vote', time: '1 day ago', type: 'open' },
  { action: 'Results Published', detail: 'Departmental Committee Election', time: '3 days ago', type: 'results' },
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBg />
      <AdminNavbar />
      <div className="page">
        <div className="wrap">

          <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--violet2)', marginBottom: '4px' }}>Admin Dashboard</div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', fontWeight: 800 }}>Election Management</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '4px' }}>Manage elections, candidates, and view real-time blockchain results.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }} className="fade-in fade-in-d1">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.iconCls}`}><s.Icon /></div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="fade-in fade-in-d2">

            {/* Quick actions */}
            <div className="card">
              <div className="section-title">Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Create New Election', desc: 'Set up a new election with candidates', color: 'btn-primary', to: '/admin/elections' },
                  { label: 'Add Candidates', desc: 'Add candidates to existing elections', color: 'btn-ghost', to: '/admin/candidates' },
                  { label: 'View Results', desc: 'See live blockchain vote counts', color: 'btn-ghost', to: '/admin/results' },
                ].map(a => (
                  <button key={a.label} className={`btn ${a.color}`} onClick={() => navigate(a.to)}
                    style={{ justifyContent: 'flex-start', gap: '12px' }}>
                    {a.color === 'btn-primary' && <div className="btn-shimmer" />}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{a.label}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, fontFamily: 'var(--font-body)' }}>{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="card">
              <div className="section-title">Recent Activity</div>
              {RECENT.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < RECENT.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: r.type === 'create' ? 'rgba(124,92,252,0.15)' : r.type === 'open' ? 'rgba(16,185,129,0.12)' : r.type === 'results' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14,
                      color: r.type === 'create' ? 'var(--violet2)' : r.type === 'open' ? 'var(--emerald)' : r.type === 'results' ? 'var(--blue)' : 'var(--amber)' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{r.action}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '2px' }}>{r.detail}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract info */}
          <div className="card fade-in fade-in-d3" style={{ marginTop: '1.5rem', borderColor: 'rgba(124,92,252,0.2)', background: 'rgba(124,92,252,0.04)' }}>
            <div className="section-title">Blockchain Contract</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
              {[
                { k: 'Network', v: 'Hardhat Local' },
                { k: 'Contract Address', v: '0xe7f172...bb3F0512' },
                { k: 'Status', v: 'Active' },
                { k: 'Total Transactions', v: '1,040+' },
              ].map(r => (
                <div key={r.k} className="receipt-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span className="receipt-key">{r.k}</span>
                  <span className="receipt-val" style={{ fontSize: '0.85rem' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;