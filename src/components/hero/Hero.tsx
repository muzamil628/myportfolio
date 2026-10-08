'use client';

import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { scrollToTarget } from '@/lib/scroll';

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (reducedMotion || !entry.isIntersecting || entry.intersectionRatio < 0.35) {
          video.pause();
        } else {
          video.play().then(() => setPlaybackError(false)).catch(() => setPlaybackError(true));
        }
      },
      { threshold: [0, 0.35, 0.6, 1] }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const playIntroductionWithVoice = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio || !video) return;
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 1;
    video.currentTime = 0;
    video.muted = true;
    const videoPlayback = video.play();
    const voicePlayback = audio.play();
    Promise.all([videoPlayback, voicePlayback])
      .then(() => {
        setSoundOn(true);
        setPlaybackError(false);
      })
      .catch(() => {
        audio.pause();
        video.pause();
        setSoundOn(false);
        setPlaybackError(true);
      });
  };

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!soundOn) {
      playIntroductionWithVoice();
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setSoundOn(false);
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="hero-shell"
      aria-labelledby="hero-title"
    >
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-eyebrow hero-enter" style={{ animationDelay: '80ms' }}>{PROFILE.fullName}</p>
          <h1 id="hero-title">
            <span className="hero-title-mask">
              <span className="hero-title-line" style={{ animationDelay: '180ms' }}>Full Stack</span>
            </span>
            <span className="hero-title-mask">
              <span className="hero-title-line hero-title-accent" style={{ animationDelay: '300ms' }}>Web Developer</span>
            </span>
          </h1>
          <div className="hero-actions hero-enter" style={{ animationDelay: '260ms' }}>
            <button type="button" className="hero-button hero-button-dark" onClick={() => scrollToTarget('skills')}>
              Explore skills <span aria-hidden="true">↓</span>
            </button>
            <button type="button" className="hero-button hero-button-light" onClick={() => scrollToTarget('contact')}>
              Contact
            </button>
            <a className="hero-button hero-button-light" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/resume.pdf`} download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-bottomline hero-enter" style={{ animationDelay: '360ms' }}>
            <span>WhatsApp</span>
            <a href={`https://wa.me/${PROFILE.phone.replace(/\D/g, '')}`}>{PROFILE.phone}</a>
          </div>
        </div>

        <div className="hero-visual hero-enter" style={{ animationDelay: '200ms' }}>
          <div className={`hero-video-wrap ${soundOn ? 'is-speaking' : ''}`}>
            <video
              ref={videoRef}
              className="hero-video"
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay
              aria-label={`Video introduction of ${PROFILE.fullName}`}
            >
              <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/hero/hero.mp4`} type="video/mp4" />
              Your browser does not support the video element.
            </video>
            <audio
              ref={audioRef}
              aria-label={`Male voice introduction for ${PROFILE.fullName}`}
              preload="auto"
              onEnded={() => setSoundOn(false)}
              onError={() => {
                setSoundOn(false);
                setPlaybackError(true);
              }}
            >
              <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/hero/muzamil-intro.wav`} type="audio/wav" />
            </audio>
            <span className="video-kicker">Introduction · 01</span>
            <button
              type="button"
              className="sound-toggle"
              aria-label={soundOn ? 'Stop introduction voice' : 'Play introduction voice'}
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {soundOn ? (
                  <>
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M18 6a8.5 8.5 0 0 1 0 12" />
                  </>
                ) : (
                  <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />
                )}
              </svg>
              <span>{soundOn ? 'Stop voice' : 'Play intro voice'}</span>
            </button>
            {playbackError && (
              <p className="playback-error" role="status">
                Voice could not be played. Check your device volume and try again.
                <button type="button" onClick={playIntroductionWithVoice}>Try again</button>
              </p>
            )}
          </div>
          <span className="visual-caption" aria-hidden="true">{PROFILE.fullName} · {PROFILE.role}</span>
        </div>
      </div>

      <style jsx>{`
        .hero-shell .hero-enter {
          opacity: 0;
          animation: hero-arrive 850ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes hero-arrive {
          from {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.99);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .hero-shell .hero-copy .hero-eyebrow {
          opacity: 0;
          animation: eyebrow-in 650ms cubic-bezier(0.2, 0.8, 0.2, 1) 80ms both;
        }

        @keyframes eyebrow-in {
          from {
            opacity: 0;
            letter-spacing: 0.38em;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            letter-spacing: 0.2em;
            transform: translateY(0);
          }
        }

        .hero-title-mask {
          display: block;
          overflow: hidden;
          padding: 0.04em 0.1em 0.1em 0;
          margin: 0 -0.1em -0.1em 0;
        }

        .hero-shell .hero-title-line {
          display: block;
          opacity: 0;
          animation: title-line-in 780ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes title-line-in {
          from {
            opacity: 0;
            transform: translate3d(0, 108%, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .hero-shell {
          min-height: min(900px, 100svh);
          display: flex;
          align-items: center;
          padding: clamp(112px, 14vh, 160px) 0 clamp(76px, 9vh, 110px);
          scroll-margin-top: 80px;
        }

        .hero-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
          align-items: center;
          width: 100%;
          gap: clamp(28px, 5vw, 88px);
        }

        .hero-copy {
          position: relative;
          z-index: 1;
          padding: 24px 0 12px;
        }

        .hero-eyebrow {
          margin: 0 0 clamp(22px, 3vw, 36px);
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hero-bottomline a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hero-bottomline a:hover {
          color: var(--accent);
        }

        .hero-copy h1 {
          margin: 0;
          max-width: 9ch;
          font-size: clamp(3.65rem, 7.4vw, 7.8rem);
          font-weight: 650;
          letter-spacing: -0.095em;
          line-height: 0.81;
        }

        .hero-copy h1 .hero-title-accent {
          color: var(--accent);
          font-family: var(--font-instrument);
          font-style: italic;
          font-weight: 400;
          letter-spacing: -0.075em;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 30px;
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          font-size: 0.68rem;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.3s var(--ease), border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
        }

        .hero-button:hover {
          transform: translateY(-3px);
        }

        .hero-button-dark {
          border-color: var(--ink);
          background: var(--ink);
          color: var(--paper);
        }

        .hero-button-light {
          background: transparent;
          color: var(--ink);
        }

        .hero-button-light:hover {
          border-color: var(--ink);
        }

        .hero-bottomline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: clamp(48px, 8vh, 88px);
          padding-top: 13px;
          border-top: 1px solid var(--line);
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hero-visual {
          position: relative;
          width: 100%;
        }

        .hero-video-wrap {
          position: relative;
          aspect-ratio: 16 / 9;
          width: 100%;
          max-height: min(68svh, 690px);
          overflow: hidden;
          border: 1px solid rgba(25, 26, 55, 0.09);
          border-radius: clamp(20px, 3vw, 34px);
          background: #fff;
          box-shadow: 0 38px 100px rgba(42, 43, 92, 0.12);
        }

        .hero-visual.hero-enter {
          transform-origin: 65% 50%;
        }

        .hero-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          mix-blend-mode: multiply;
        }

        .video-kicker {
          position: absolute;
          top: 16px;
          left: 18px;
          padding: 9px 12px;
          border: 1px solid rgba(25, 26, 55, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--ink-2);
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }

        .sound-toggle {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 16px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: var(--accent);
          color: var(--paper);
          cursor: pointer;
          transition: transform 0.25s var(--ease);
          font: inherit;
          font-size: 0.72rem;
        }

        .sound-toggle:hover {
          transform: scale(1.06);
        }

        .sound-toggle svg {
          width: 20px;
          height: 20px;
          flex: none;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.6;
        }

        .playback-error {
          position: absolute;
          right: 16px;
          bottom: 74px;
          left: 16px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.94);
          color: var(--ink);
          font-size: 0.68rem;
          box-shadow: 0 12px 36px rgba(25, 26, 55, 0.12);
          backdrop-filter: blur(12px);
        }

        .playback-error button {
          flex: none;
          padding: 8px 11px;
          border: 0;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          font-size: 0.68rem;
        }

        .visual-caption {
          display: block;
          margin: 12px 4px 0;
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.59rem;
          letter-spacing: 0.11em;
          text-align: right;
          text-transform: uppercase;
        }

        @media (max-width: 800px) {
          .hero-shell {
            min-height: auto;
            padding-top: 128px;
            padding-bottom: 64px;
          }

          .hero-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .hero-copy {
            padding: 0;
          }

          .hero-eyebrow {
            margin-bottom: 26px;
          }

          .hero-copy h1 {
            max-width: 10ch;
            font-size: clamp(3.9rem, 15vw, 7.3rem);
          }

          .hero-bottomline {
            display: none;
          }

          .hero-video-wrap {
            max-height: unset;
            aspect-ratio: 16 / 9;
            border-radius: 24px;
          }
        }

        @media (max-width: 480px) {
          .hero-actions {
            gap: 7px;
          }

          .hero-button {
            min-height: 42px;
            padding: 0 13px;
            font-size: 0.66rem;
          }

        }
      `}</style>
    </section>
  );
}
