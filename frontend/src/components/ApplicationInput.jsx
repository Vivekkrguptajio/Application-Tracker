import { useState, useEffect, useRef } from 'react';
import { PlusIcon } from './Icons';

export default function ApplicationInput({ link, setLink, onSave, saving, baseUrl }) {
  const [aiDetectedName, setAiDetectedName] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!link || !link.trim() || !baseUrl) {
      setAiDetectedName(null);
      setIsAiLoading(false);
      return;
    }

    setAiDetectedName(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      setIsAiLoading(true);
      try {
        const res = await fetch(`${baseUrl}/detect-company`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: link.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.company && data.company !== 'Unknown') {
            setAiDetectedName(data.company);
          } else {
            setAiDetectedName('Unknown');
          }
        }
      } catch (err) {
        console.error("AI Detection failed:", err);
        setAiDetectedName('Unknown');
      } finally {
        setIsAiLoading(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [link, baseUrl]);

  const handleSave = () => {
    if (isAiLoading || !aiDetectedName || aiDetectedName === 'Unknown') {
        // If AI failed or still loading, don't allow "Unknown" to be saved easily
        // But if user really wants to save, we could let them? 
        // No, let's keep it strict as requested.
        return;
    }
    onSave(aiDetectedName);
  };

  // Button is only active if AI has found a valid name
  const isSaveDisabled = saving || isAiLoading || !aiDetectedName || aiDetectedName === 'Unknown';

  return (
    <div className="anim-fade-up delay-1">
      <div className="input-card">
        <input
          id="application-link-input"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isSaveDisabled && handleSave()}
          placeholder="Paste your job application link here..."
          className="input-field"
        />
        <button
          id="save-application-btn"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="btn-save"
          style={{ 
            opacity: isSaveDisabled ? 0.5 : 1,
            cursor: isSaveDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          <PlusIcon />
          {saving ? 'Saving...' : isAiLoading ? 'AI Detecting...' : 'Save Application'}
        </button>
      </div>

      {/* AI preview badge */}
      {(isAiLoading || aiDetectedName) && link.trim() && (
        <div
          className="company-preview anim-fade-in"
          style={{ '--badge-color': aiDetectedName === 'Unknown' ? '#ef4444' : '#6366f1' }}
        >
          <span className="company-preview__emoji">{aiDetectedName === 'Unknown' ? '❌' : '✨'}</span>
          <span className="company-preview__label">
            {isAiLoading ? 'AI Thinking...' : aiDetectedName === 'Unknown' ? 'AI Error:' : 'AI Detected:'}
          </span>
          <span className="company-preview__name" style={{ color: aiDetectedName === 'Unknown' ? '#ef4444' : '#6366f1' }}>
            {isAiLoading ? 'Searching...' : aiDetectedName}
          </span>
          {isAiLoading && <div className="spinner-mini" style={{ marginLeft: 8 }} />}
        </div>
      )}
    </div>
  );
}
