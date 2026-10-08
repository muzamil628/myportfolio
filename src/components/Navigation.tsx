'use client';

import { useEffect, useState } from 'react';
import { NAV, PROFILE } from '@/lib/data';
import { useScrollProgress } from '@/lib/hooks';
import { scrollToTarget } from '@/lib/scroll';

export function Navigation({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();
  const activeIndex = Math.max(0, NAV.findIndex((item) => item.href === `#${active}`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="scroll-progress-wrap" aria-hidden="true">
        <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="brand-wrap">
          <button
            type="button"
            className={`brand-mark ${scrolled ? 'is-solid' : ''}`}
            aria-label="Scroll to the top"
            onClick={() => scrollToTarget('top')}
          >
            MA
          </button>
          <span className={`name-lockup ${scrolled ? 'is-hidden' : ''}`}>{PROFILE.fullName}</span>
        </div>

        <nav className="nav-shell" aria-label="Main navigation">
          <div className="nav-indicator" style={{ left: `${(activeIndex * 100) / NAV.length}%`, width: `${100 / NAV.length}%` }} />
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === `#${active}` ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                const target = item.href.replace('#', '');
                scrollToTarget(target);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          {NAV.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`mobile-link ${item.href === `#${active}` ? 'active' : ''}`}
              style={{ transitionDelay: `${index * 80}ms` }}
              onClick={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                scrollToTarget(item.href.replace('#', ''));
              }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scroll-progress-wrap {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          z-index: 50;
          pointer-events: none;
          background: rgba(13, 13, 13, 0.06);
        }

        .scroll-progress {
          height: 100%;
          background: var(--ink);
          transform-origin: left center;
          transition: transform 0.2s ease;
        }

        .topbar {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: min(calc(100% - 24px), 1320px);
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid transparent;
          animation: nav-arrive 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: background 0.35s var(--ease), border-color 0.35s var(--ease), box-shadow 0.35s var(--ease), backdrop-filter 0.35s var(--ease);
        }

        @keyframes nav-arrive {
          from {
            opacity: 0;
            transform: translate(-50%, -12px);
          }

          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .topbar.is-scrolled {
          background: rgba(255, 255, 255, 0.6);
          border-color: rgba(13, 13, 13, 0.08);
          backdrop-filter: blur(18px);
          box-shadow: 0 12px 40px rgba(13, 13, 13, 0.08);
        }

        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(13, 13, 13, 0.7);
          background: transparent;
          color: var(--ink);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          font-family: var(--font-mono);
          transition: transform 0.35s var(--ease), background 0.35s var(--ease), color 0.35s var(--ease);
        }

        .brand-mark:hover {
          transform: rotate(360deg);
          background: var(--ink);
          color: var(--paper);
        }

        .brand-mark.is-solid {
          background: var(--ink);
          color: var(--paper);
        }

        .name-lockup {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 1;
          transition: opacity 0.25s ease;
          white-space: nowrap;
        }

        .name-lockup.is-hidden {
          opacity: 0;
        }

        .nav-shell {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          padding: 6px;
          border: 1px solid rgba(13, 13, 13, 0.05);
          min-width: min(62vw, 440px);
        }

        .nav-indicator {
          position: absolute;
          top: 6px;
          left: 6px;
          height: calc(100% - 12px);
          border-radius: 999px;
          background: var(--ink);
          transition: left 0.35s ease, width 0.35s ease;
          z-index: 0;
        }

        .nav-shell a {
          position: relative;
          z-index: 1;
          text-decoration: none;
          color: var(--ink-2);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.8rem 0.95rem;
          border-radius: 999px;
          transition: color 0.3s var(--ease);
        }

        .nav-shell a.active {
          color: var(--paper);
        }

        .menu-button {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 860px) {
          .topbar {
            top: 12px;
            padding: 10px 12px 10px 10px;
          }

          .nav-shell {
            display: none;
          }

          .menu-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            border: 1px solid rgba(13, 13, 13, 0.08);
            background: rgba(255, 255, 255, 0.75);
            color: var(--ink);
            height: 42px;
            padding: 0 16px;
            font-size: 0.72rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .mobile-menu {
            position: fixed;
            inset: 0;
            display: block;
            background: rgba(244, 242, 238, 0.96);
            opacity: 0;
            visibility: hidden;
            clip-path: inset(0 0 100% 0);
            transition: clip-path 0.45s var(--ease), opacity 0.3s ease, visibility 0.3s ease;
            z-index: 30;
          }

          .mobile-menu.open {
            opacity: 1;
            visibility: visible;
            clip-path: inset(0 0 0 0);
          }

          .mobile-menu-inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100vh;
            padding: 100px 24px 32px;
            gap: 14px;
          }

          .mobile-link {
            display: flex;
            align-items: center;
            gap: 16px;
            text-decoration: none;
            color: var(--ink);
            font-size: clamp(1.9rem, 7vw, 3.6rem);
            letter-spacing: -0.05em;
            line-height: 1;
            font-weight: 600;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.35s ease, transform 0.35s ease;
          }

          .mobile-menu.open .mobile-link {
            opacity: 1;
            transform: translateY(0);
          }

          .mobile-link span {
            font-size: 0.8rem;
            letter-spacing: 0.16em;
            color: var(--mute);
            font-family: var(--font-mono);
            text-transform: uppercase;
          }
        }
      `}</style>
    </>
  );
}
