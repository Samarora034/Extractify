'use client';

/**
 * Shimmer — skeleton loading placeholder with animated shimmer pass.
 */
export default function Shimmer({ className = '', style = {} }) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{ borderRadius: 12, ...style }}
    />
  );
}
