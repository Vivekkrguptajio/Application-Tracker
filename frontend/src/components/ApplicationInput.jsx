import { PlusIcon } from './Icons';

export default function ApplicationInput({ link, setLink, onSave, saving }) {
  return (
    <div className="anim-fade-up delay-1">
      <div className="input-card">
        <input
          id="application-link-input"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
          placeholder="Paste your job application link here..."
          className="input-field"
        />
        <button
          id="save-application-btn"
          onClick={onSave}
          disabled={saving}
          className="btn-save"
        >
          <PlusIcon />
          {saving ? 'Saving...' : 'Save Application'}
        </button>
      </div>
    </div>
  );
}
