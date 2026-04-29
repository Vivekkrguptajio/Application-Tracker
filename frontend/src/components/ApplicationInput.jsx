import { useState, useEffect, useRef } from 'react';
import { PlusIcon } from './Icons';

export default function ApplicationInput({ link, setLink, onSave, saving, baseUrl }) {
  const [aiDetectedName, setAiDetectedName] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [manualName, setManualName] = useState('');

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!link || !link.trim() || !baseUrl) {
      setAiDetectedName(null);
      setIsAiLoading(false);
      setIsEditingManually(false);
      return;
    }

    setAiDetectedName(null);
    setIsEditingManually(false);

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
            setManualName(data.company);
          } else {
            setAiDetectedName('Unknown');
            setManualName('');
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
    const finalName = isEditingManually ? manualName : aiDetectedName;
    if (!finalName || finalName === 'Unknown' || finalName.trim() === '') {
        return;
    }
    onSave(finalName);
    setIsEditingManually(false);
    setAiDetectedName(null);
  };

  const isSaveDisabled = saving || isAiLoading || (!isEditingManually && (aiDetectedName === 'Unknown' || !aiDetectedName)) || (isEditingManually && !manualName.trim());

  return (
    <div className="anim-fade-up delay-1">
      <div className="input-card" style={{ flexDirection: 'column', padding: '24px', gap: '16px' }}>
        <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
          <input
            id="application-link-input"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isSaveDisabled && handleSave()}
            placeholder="Paste your job application link here..."
            className="input-field"
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            id="save-application-btn"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="btn-save"
            style={{ 
              opacity: isSaveDisabled ? 0.5 : 1,
              cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
              height: '48px'
            }}
          >
            <PlusIcon />
            {saving ? 'Saving...' : isAiLoading ? 'AI Detecting...' : 'Save Application'}
          </button>
        </div>
      </div>

      {/* AI preview / Manual Edit badge */}
      {(isAiLoading || aiDetectedName) && link.trim() && (
        <div
          className="company-preview anim-fade-in"
          style={{ 
            '--badge-color': (aiDetectedName === 'Unknown' && !isEditingManually) ? '#ef4444' : '#6366f1',
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
            marginTop: '12px'
          }}
        >
          <span className="company-preview__emoji">
            {isAiLoading ? '✨' : (aiDetectedName === 'Unknown' && !isEditingManually) ? '❓' : '🏢'}
          </span>
          
          {!isEditingManually ? (
            <>
              <span className="company-preview__label">
                {isAiLoading ? 'AI Thinking...' : 'Detected:'}
              </span>
              <span className="company-preview__name">
                {isAiLoading ? 'Searching...' : aiDetectedName}
              </span>
              {!isAiLoading && (
                <button 
                  onClick={() => { setIsEditingManually(true); setManualName(aiDetectedName === 'Unknown' ? '' : aiDetectedName); }}
                  className="btn-manual-edit"
                  style={{ marginLeft: 8 }}
                >
                  Edit Manually
                </button>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="company-preview__label">Company Name:</span>
              <input 
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Enter company name..."
                className="manual-input-field"
                autoFocus
              />
              <button 
                onClick={() => setIsEditingManually(false)}
                className="btn-cancel-edit"
              >
                Cancel
              </button>
            </div>
          )}
          
          {isAiLoading && <div className="spinner-mini" />}
        </div>
      )}
    </div>
  );
}
