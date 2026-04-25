import { useState } from 'react';
import { LinkIcon, TrashIcon, EmptyIcon, RefreshIcon } from './Icons';

const STATUS_MAP = {
  APPLIED:   's-applied',
  INTERVIEW: 's-interview',
  OFFERED:   's-offered',
  REJECTED:  's-rejected',
};

/* ── Confirm Modal ── */
function ConfirmModal({ appId, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.15s ease-out',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0f172a, #111827)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 20,
        padding: '32px 36px',
        maxWidth: 400,
        width: '90%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        textAlign: 'center',
        animation: 'fadeInUp 0.2s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
          Delete Application?
        </h3>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 28 }}>
          This will permanently remove application <strong style={{ color: '#94a3b8' }}>#{appId}</strong> from your tracker.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px 0',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(71,85,105,0.5)',
              borderRadius: 12,
              color: '#94a3b8', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(51,65,85,0.9)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,41,59,0.8)'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px 0',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              border: 'none',
              borderRadius: 12,
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(239,68,68,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(239,68,68,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.35)'; }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Status Dropdown ── */
function StatusDropdown({ status, onChange }) {
  const current = status?.toUpperCase() || 'APPLIED';
  const cls = STATUS_MAP[current] || 's-applied';
  return (
    <div className="status-select-wrapper">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className={`status-select ${cls}`}
      >
        <option value="APPLIED"   style={{ background: '#0d1117', color: '#60a5fa' }}>APPLIED</option>
        <option value="INTERVIEW" style={{ background: '#0d1117', color: '#fbbf24' }}>INTERVIEW</option>
        <option value="OFFERED"   style={{ background: '#0d1117', color: '#34d399' }}>OFFERED</option>
        <option value="REJECTED"  style={{ background: '#0d1117', color: '#f87171' }}>REJECTED</option>
      </select>
      <span className="status-caret">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}

/* ── Application Row ── */
function ApplicationRow({ app, index, onDeleteRequest, onUpdateStatus }) {
  let datePart = '—', timePart = '—';
  if (app.createdAt) {
    const [d, t] = app.createdAt.split('T');
    datePart = d;
    timePart = t?.split('.')[0] || '—';
  }

  return (
    <tr className="anim-fade-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <td>
        <span className="id-badge">#{app.id}</span>
      </td>
      <td style={{ maxWidth: 360 }}>
        <a
          href={app.link.startsWith('http') ? app.link : `https://${app.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="app-link"
        >
          <LinkIcon />
          <span>{app.link}</span>
        </a>
      </td>
      <td>
        <StatusDropdown
          status={app.status}
          onChange={(s) => onUpdateStatus(app.id, s)}
        />
      </td>
      <td style={{ color: '#94a3b8' }}>{datePart}</td>
      <td style={{ color: '#64748b', fontFamily: 'monospace' }}>{timePart}</td>
      <td>
        <button
          onClick={() => onDeleteRequest(app.id)}
          className="btn-delete"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
}

/* ── Main ApplicationList ── */
export default function ApplicationList({
  applications, loading, refreshing,
  selectedDate, onClearDate, onRefresh,
  onDelete, onUpdateStatus,
}) {
  const [confirmId, setConfirmId] = useState(null);

  const handleDeleteRequest = (id) => setConfirmId(id);

  const handleConfirmDelete = () => {
    if (confirmId != null) {
      onDelete(confirmId);
      setConfirmId(null);
    }
  };

  const handleCancelDelete = () => setConfirmId(null);

  return (
    <div className="anim-fade-up delay-2">
      {/* Custom confirm modal */}
      {confirmId != null && (
        <ConfirmModal
          appId={confirmId}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Top bar */}
      <div className="list-topbar">
        <div className="list-title-group">
          <h2 className="list-title">
            {selectedDate ? `Applications on ${selectedDate}` : 'Saved Applications'}
          </h2>
          <span className="list-count">{applications.length}</span>
          {selectedDate && (
            <button onClick={onClearDate} className="btn-clear-filter">
              Clear ✕
            </button>
          )}
        </div>
        <button
          id="refresh-btn"
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-refresh"
        >
          <RefreshIcon spinning={refreshing} />
          Refresh
        </button>
      </div>

      {/* Table card */}
      <div className="table-card">
        {loading ? (
          <div className="state-center">
            <div className="spinner" />
            <p className="state-title">Loading applications…</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="state-center anim-fade-in">
            <div style={{ marginBottom: 20, opacity: 0.45 }}><EmptyIcon /></div>
            <p className="state-title">
              {selectedDate ? `No applications on ${selectedDate}` : 'No applications yet'}
            </p>
            <p className="state-sub">
              {selectedDate
                ? 'Try selecting another date from the heatmap.'
                : 'Start tracking your search — paste a job link above.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="app-table">
              <thead>
                <tr>
                  {['ID', 'Link', 'Status', 'Date', 'Time', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    index={i}
                    onDeleteRequest={handleDeleteRequest}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
