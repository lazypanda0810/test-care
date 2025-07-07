import React from 'react';
import './ScoreMeter.css';

export default function ScoreMeter({ score, label, goodIsHigh = true }) {
  // Clamp score between 0 and 100
  const safeScore = Math.max(0, Math.min(100, score));
  // Color: green if good, red if bad
  let color = '#4caf50';
  if (goodIsHigh) {
    if (safeScore < 40) color = '#e53935';
    else if (safeScore < 70) color = '#ffb300';
  } else {
    if (safeScore > 60) color = '#e53935';
    else if (safeScore > 30) color = '#ffb300';
  }
  return (
    <div className="score-meter">
      <div className="score-label">{label}</div>
      <div className="meter-outer">
        <div className="meter-inner" style={{ width: `${safeScore}%`, background: color }} />
        <div className="score-text" style={{ color }}>{safeScore}</div>
      </div>
      <div className="meter-desc" style={{ color }}>
        {goodIsHigh
          ? safeScore > 70 ? 'Great!' : safeScore > 40 ? 'Okay' : 'Needs Attention'
          : safeScore < 30 ? 'Great!' : safeScore < 60 ? 'Okay' : 'High Risk!'}
      </div>
    </div>
  );
}
