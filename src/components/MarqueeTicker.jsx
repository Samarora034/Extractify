'use client';
import { useRef } from 'react';

const ITEMS = [
  'SGLang Engine',
  'AI Extraction',
  'Structured Data',
  'Real-time Analysis',
  'JSON Output',
  'Schema Validation',
  'Multi-model Support',
  'Batch Processing',
];

export default function MarqueeTicker({ items = ITEMS, speed = 22 }) {
  // Duplicate for seamless loop
  const track = [...items, ...items];

  return (
    <div className="marquee-outer" aria-hidden="true">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
