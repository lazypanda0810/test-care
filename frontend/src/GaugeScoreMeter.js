import React, { useEffect, useRef } from 'react';
import './GaugeScoreMeter.css';
import { FaInfoCircle } from 'react-icons/fa';

// Helper to get color based on score (0-100)
function getGradientColor(score) {
  if (score < 40) return '#e53935'; // red
  if (score < 70) return '#ffb300'; // orange
  return '#43a047'; // green
}

export default function GaugeScoreMeter({ score = 0, label = '', subLabel = '', tooltip = '', goodIsHigh = true }) {
  const radius = 100;
  const stroke = 20;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const angle = (normalizedScore / 100) * 180;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - normalizedScore / 100);
  const color = getGradientColor(goodIsHigh ? normalizedScore : 100 - normalizedScore);
  const emoji = goodIsHigh
    ? (score >= 80 ? '😃' : score >= 60 ? '🙂' : score >= 40 ? '😐' : '😟')
    : (score >= 80 ? '😟' : score >= 60 ? '😐' : score >= 40 ? '🙂' : '😃');

  const arcRef = useRef();

  useEffect(() => {
    if (arcRef.current) {
      arcRef.current.style.strokeDashoffset = circumference;
      setTimeout(() => {
        arcRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.7,0,.3,1)';
        arcRef.current.style.strokeDashoffset = offset;
      }, 100);
    }
  }, [score, circumference, offset]);

  return (
    <div className="gauge-meter-root gauge-meter-card">
      <svg width={radius * 2 + stroke} height={radius + stroke} viewBox={`0 0 ${radius * 2 + stroke} ${radius + stroke}`} style={{width: '100%', maxWidth: 320, height: 'auto'}}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e53935" />
            <stop offset="50%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#43a047" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={`M${stroke / 2},${radius + stroke / 2} A${radius},${radius} 0 0,1 ${radius * 2 + stroke / 2},${radius + stroke / 2}`}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={stroke}
        />
        {/* Foreground arc */}
        <path
          ref={arcRef}
          d={`M${stroke / 2},${radius + stroke / 2} A${radius},${radius} 0 0,1 ${radius * 2 + stroke / 2},${radius + stroke / 2}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="gauge-meter-label">
        <span className="gauge-meter-score" style={{ color }}>{score}% {emoji}</span>
        <div className="gauge-meter-desc">{label}
          {tooltip && (
            <span className="gauge-meter-tooltip">
              <FaInfoCircle title={tooltip} style={{marginLeft: 6, fontSize: 16, verticalAlign: 'middle', color: '#888'}} />
            </span>
          )}
        </div>
        {subLabel && <div className="gauge-meter-sublabel">{subLabel}</div>}
      </div>
    </div>
  );
}
