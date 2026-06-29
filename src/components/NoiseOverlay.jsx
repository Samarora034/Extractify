'use client';

/**
 * NoiseOverlay — persistent SVG noise film grain overlay.
 * Uses an inline SVG feTurbulence filter so no external assets are needed.
 */
export default function NoiseOverlay() {
  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        className="noise-overlay"
        aria-hidden="true"
        style={{
          filter: 'url(#noise-filter)',
          opacity: 0.04,
        }}
      />
    </>
  );
}
