'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/dashboard',            label: 'Dashboard' },
  { href: '/dashboard/extract',    label: 'Extract'   },
  { href: '/dashboard/history',    label: 'History'   },
  { href: '/dashboard/analytics',  label: 'Analytics' },
  { href: '/dashboard/settings',   label: 'Settings'  },
];

/* ── Arrow SVG ─────────────────────────────────────────────── */
function ArrowDiag({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20 20 4m0 0v14M20 4H6" />
    </svg>
  );
}

function ArrowRight({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
    </svg>
  );
}

/* ── Menu Nav Link ──────────────────────────────────────────── */
function MenuNavLink({ href, label, active, onClick, index }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`menu-nav-link ${active ? 'active' : ''}`}
      data-cursor
    >
      <div className="menu-nav-link-bg" />
      <div className="menu-nav-link-inner" style={{ transitionDelay: `${0.12 + index * 0.06}s` }}>
        <div className="menu-link-text-wrap">
          <span className="menu-link-text">{label}</span>
          <span className="menu-link-text-clone">{label}</span>
        </div>
        <span className="menu-link-arrow">
          <ArrowDiag size={28} />
        </span>
      </div>
    </Link>
  );
}

/* ── Main Header ────────────────────────────────────────────── */
export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const headerRef = useRef(null);

  /* Scroll detection for header background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Keyboard close */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen(v => !v), []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail('');
    // TODO: connect to newsletter API
  };

  return (
    <>
      {/* ── Header Bar ───────────────────────────────────── */}
      <header
        ref={headerRef}
        className={`site-header ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="header-bg" />
        <div className="header-inner">

          {/* Logo */}
          <Link href="/dashboard" className="header-logo" data-cursor>
            <span>EXTRACTIFY</span>
          </Link>

          {/* Right controls */}
          <div className="header-right">
            {/* "Let's talk" CTA */}
            {session?.user?.email && (
              <button
                className="header-talk-btn"
                data-cursor
                onClick={() => signOut({ callbackUrl: '/login' })}
                title="Sign out"
              >
                <span>{session.user.email.split('@')[0]}</span>
                <span className="btn-arrow">
                  <ArrowRight size={14} />
                </span>
              </button>
            )}

            {/* Menu toggle */}
            <button
              className={`header-menu-btn ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              data-cursor
            >
              <div className="menu-btn-dots">
                <span className="menu-btn-dot" />
                <span className="menu-btn-dot" />
              </div>
              <div className="menu-btn-label">
                <span className="menu-btn-label-text">Menu</span>
                <span className="menu-btn-label-close">Close</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Fullscreen Menu Overlay ───────────────────────── */}
      <nav className={`menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu-overlay-inner">

          {/* Nav links */}
          <div className="menu-nav">
            {NAV_LINKS.map((link, i) => (
              <MenuNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
                onClick={() => setMenuOpen(false)}
                index={i}
              />
            ))}
          </div>

          {/* Bottom row */}
          <div className="menu-bottom">
            {/* Newsletter */}
            <div className="menu-newsletter">
              <h3>Stay in the loop</h3>
              <form className="menu-newsletter-input" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" data-cursor aria-label="Subscribe">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill="#000" fillRule="evenodd" d="M2.11 8.75a.75.75 0 0 1 0-1.5h9.14l-3.3-3.3a.75.75 0 0 1 1.06-1.06l4.6 4.6.39.39-.39.39-4.6 4.6a.75.75 0 0 1-1.06-1.06l3.3-3.3H2.11Z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>

            {/* User info */}
            {session?.user && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--gray-mid)', letterSpacing: '0.05em' }}>
                  {session.user.email}
                </p>
                <button
                  data-cursor
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--gray-mid)',
                    background: 'none',
                    border: 'none',
                    cursor: 'none',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-mid)'}
                >
                  Logout →
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
