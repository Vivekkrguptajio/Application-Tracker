import { useMemo } from 'react';

export default function ActivityHeatmap({ applications, selectedDate, onDateSelect }) {
  const { weeks, counts, maxCount } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 363);

    const days = [];
    for (let i = 0; i <= 363; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push(`${y}-${m}-${dd}`);
    }

    const counts = applications.reduce((acc, app) => {
      if (app.createdAt) {
        const d = app.createdAt.split('T')[0];
        acc[d] = (acc[d] || 0) + 1;
      }
      return acc;
    }, {});

    const maxCount = Math.max(1, ...Object.values(counts));

    const weeks = [];
    for (let i = 0; i < 52; i++) {
      weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    return { weeks, counts, maxCount };
  }, [applications]);

  function getCellStyle(dateStr) {
    const count = counts[dateStr] || 0;
    const isSelected = selectedDate === dateStr;

    if (isSelected) {
      return {
        backgroundColor: '#ffffff',
        borderColor: '#6366f1',
        boxShadow: '0 0 10px rgba(255,255,255,0.7)',
      };
    }
    if (count > 0) {
      const alpha = Math.min(1, 0.25 + (count / maxCount) * 0.75);
      return {
        backgroundColor: `rgba(99,102,241,${alpha})`,
        borderColor: `rgba(99,102,241,${Math.min(1, alpha + 0.15)})`,
      };
    }
    return {
      backgroundColor: 'rgba(30,41,59,0.4)',
      borderColor: 'rgba(51,65,85,0.3)',
    };
  }

  return (
    <div className="heatmap-card anim-fade-up delay-3">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Activity Heatmap</h3>
        <span style={{ fontSize: 12, color: '#64748b' }}>Last 52 weeks</span>
      </div>

      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((dateStr) => (
              <div
                key={dateStr}
                className="heatmap-cell"
                style={getCellStyle(dateStr)}
                title={`${counts[dateStr] || 0} applications on ${dateStr}`}
                onClick={() => onDateSelect(selectedDate === dateStr ? null : dateStr)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="heatmap-footer">
        <span>Last 12 months</span>
        <div className="heatmap-legend">
          <span>Less</span>
          {[
            'rgba(30,41,59,0.4)',
            'rgba(99,102,241,0.3)',
            'rgba(99,102,241,0.55)',
            'rgba(99,102,241,0.8)',
            '#6366f1',
          ].map((bg, i) => (
            <div
              key={i}
              className="heatmap-legend-swatch"
              style={{ background: bg, border: '1px solid rgba(99,102,241,0.2)' }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
