'use client';

import { useEffect, useState } from 'react';
import { CAPABILITIES, PROFILE, SKILL_GROUPS } from '@/lib/data';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/hero/Hero';

const SKILL_MARKS: Record<string, string> = {
  HTML5: '5',
  CSS3: '3',
  'JavaScript (ES6+)': 'JS',
  'React.js': 'R',
  'Tailwind CSS': '≋',
  Bootstrap: 'B',
  'Node.js': 'node',
  'Express.js': 'ex',
  Python: 'Py',
  PHP: 'php',
  MongoDB: 'M',
  MySQL: 'SQL',
  PostgreSQL: 'pg',
  Git: 'git',
  GitHub: 'GH',
  'VS Code': '<>',
  Postman: 'P',
  NPM: 'npm',
  'RESTful API Development': '{ }',
  'Full-Stack Architecture': 'FS',
  'Responsive Web Design': 'R',
};

export function App() {
  const [active, setActive] = useState('about');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [skillCategory, setSkillCategory] = useState('All skills');
  const [selectedSkill, setSelectedSkill] = useState(SKILL_GROUPS[0].items[0]);
  const [previewSkill, setPreviewSkill] = useState<string | null>(null);
  const allSkills = SKILL_GROUPS.flatMap((group) =>
    group.items.map((skill) => ({ name: skill, category: group.title }))
  );
  const visibleSkills =
    skillCategory === 'All skills'
      ? allSkills
      : allSkills.filter((skill) => skill.category === skillCategory);
  const featuredSkill =
    visibleSkills.find((skill) => skill.name === previewSkill) ??
    visibleSkills.find((skill) => skill.name === selectedSkill) ??
    visibleSkills[0] ??
    allSkills[0];

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.rv');
    const showAll = () => elements.forEach((element) => element.classList.add('is-in'));

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">Skip to content</a>
      <Navigation active={active} />

      <main>
        <div className="page-shell">
          <Hero />

          <section id="about" className="content-section about-section">
            <div className="section-heading rv">
              <p className="section-index">01 — About</p>
              <h2>
                A little <em>about me.</em>
              </h2>
            </div>

            <div className="about-layout rv" style={{ transitionDelay: '120ms' }}>
              <div className={`identity-card ${cardFlipped ? 'is-flipped' : ''}`}>
                <div className="identity-card-inner">
                  <article
                    className="identity-face identity-front"
                    aria-label="Profile card front"
                    aria-hidden={cardFlipped}
                  >
                    <div className="card-topline">
                      <span>PROFILE</span>
                      <span>MA</span>
                    </div>
                    <div className="identity-monogram" aria-hidden="true">MA</div>
                    <div>
                      <h3>{PROFILE.fullName}</h3>
                      <p>{PROFILE.role}</p>
                    </div>
                    <button
                      className="flip-control"
                      type="button"
                      tabIndex={cardFlipped ? -1 : 0}
                      aria-pressed={cardFlipped}
                      onClick={() => setCardFlipped(true)}
                    >
                      Turn card <span aria-hidden="true">↗</span>
                    </button>
                  </article>

                  <article
                    className="identity-face identity-back"
                    aria-label="Profile summary and contact details"
                    aria-hidden={!cardFlipped}
                  >
                    <div className="card-topline">
                      <span>PROFILE</span>
                      <span>01</span>
                    </div>
                    <p className="identity-summary">{PROFILE.summary}</p>
                    <div className="identity-contact">
                      <a href={`https://wa.me/${PROFILE.phone.replace(/\D/g, '')}`}>
                        {PROFILE.phone}
                      </a>
                    </div>
                    <button
                      className="flip-control"
                      type="button"
                      tabIndex={cardFlipped ? 0 : -1}
                      aria-pressed={cardFlipped}
                      onClick={() => setCardFlipped(false)}
                    >
                      Turn back <span aria-hidden="true">↙</span>
                    </button>
                  </article>
                </div>
              </div>

              <div className="capability-list">
                <p className="micro-label">Key capabilities</p>
                <ul>
                  {CAPABILITIES.map((capability, index) => (
                    <li key={capability}>
                      <span className="capability-number">{String(index + 1).padStart(2, '0')}</span>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="skills" className="content-section skills-section">
            <div className="section-heading rv">
              <p className="section-index">02 — Skills</p>
              <h2>
                The things I <em>work with.</em>
              </h2>
            </div>

            <div className="skills-explorer rv" aria-label="Technical skills from the résumé" style={{ transitionDelay: '120ms' }}>
              <div className="skill-filters" aria-label="Filter skills by category">
                {['All skills', ...SKILL_GROUPS.map((group) => group.title)].map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={skillCategory === category ? 'is-active' : ''}
                    aria-pressed={skillCategory === category}
                    onClick={() => setSkillCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="skills-layout">
                <div className="skills-periodic-grid">
                  {visibleSkills.map((skill) => (
                    <button
                      type="button"
                      className={`skill-cell ${featuredSkill.name === skill.name ? 'is-selected' : ''}`}
                      key={skill.name}
                      aria-pressed={selectedSkill === skill.name}
                      onClick={() => setSelectedSkill(skill.name)}
                      onMouseEnter={() => setPreviewSkill(skill.name)}
                      onMouseLeave={() => setPreviewSkill(null)}
                      onFocus={() => setPreviewSkill(skill.name)}
                      onBlur={() => setPreviewSkill(null)}
                    >
                      <span className="skill-number">{String(allSkills.findIndex((item) => item.name === skill.name) + 1).padStart(2, '0')}</span>
                      <span className="skill-symbol" aria-hidden="true">{SKILL_MARKS[skill.name] ?? skill.name.slice(0, 2)}</span>
                      <span className="skill-name">{skill.name}</span>
                    </button>
                  ))}
                </div>

                <aside className="skill-feature" key={featuredSkill.name} aria-live="polite">
                  <p className="micro-label">{featuredSkill.category}</p>
                  <span className="skill-feature-logo" aria-hidden="true" data-skill={featuredSkill.name}>
                    {SKILL_MARKS[featuredSkill.name] ?? featuredSkill.name.slice(0, 2)}
                  </span>
                  <h3>{featuredSkill.name}</h3>
                  <span className="skill-feature-index">
                    {String(allSkills.findIndex((item) => item.name === featuredSkill.name) + 1).padStart(2, '0')}
                    <span> / {String(allSkills.length).padStart(2, '0')}</span>
                  </span>
                </aside>
              </div>
            </div>
          </section>

          <section id="contact" className="content-section contact-section">
            <div className="section-heading">
              <p className="section-index">03 — Contact</p>
              <h2>
                Muzamil <em>Arshad.</em>
              </h2>
            </div>
            <div className="contact-panel">
              <div>
                <p className="micro-label">WhatsApp</p>
                <a href={`https://wa.me/${PROFILE.phone.replace(/\D/g, '')}`}>
                  {PROFILE.phone}
                </a>
              </div>
              <a className="resume-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/resume.pdf`} download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <span>{PROFILE.fullName}</span>
        <a href="#top">Back to top ↑</a>
      </footer>

      <style jsx>{`
        .site-shell {
          min-height: 100vh;
          overflow: clip;
          background: var(--paper);
          color: var(--ink);
        }

        .skip-link {
          position: fixed;
          top: 8px;
          left: 8px;
          z-index: 60;
          padding: 10px 14px;
          transform: translateY(-160%);
          border-radius: 999px;
          background: var(--ink);
          color: var(--paper);
          font-size: 0.8rem;
          text-decoration: none;
        }

        .skip-link:focus {
          transform: translateY(0);
        }

        .page-shell {
          width: min(1440px, calc(100% - (var(--gutter) * 2)));
          margin: 0 auto;
        }

        .content-section {
          padding: clamp(96px, 13vw, 176px) 0;
          scroll-margin-top: 90px;
        }

        .section-heading {
          margin-bottom: clamp(28px, 5vw, 64px);
        }

        .section-index,
        .micro-label {
          margin: 0 0 18px;
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .section-heading h2 {
          max-width: 1000px;
          font-size: clamp(3rem, 8.4vw, 8.25rem);
          font-weight: 600;
          letter-spacing: -0.085em;
          line-height: 0.89;
        }

        .section-heading h2 em {
          color: var(--mute);
          font-family: var(--font-instrument);
          font-weight: 400;
          letter-spacing: -0.065em;
        }

        .about-layout {
          display: grid;
          grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
          align-items: stretch;
          gap: clamp(24px, 6vw, 96px);
        }

        .identity-card {
          min-height: 420px;
          perspective: 1200px;
        }

        .identity-card-inner {
          position: relative;
          min-height: inherit;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s var(--ease);
        }

        .identity-card.is-flipped .identity-card-inner {
          transform: rotateY(180deg);
        }

        .identity-face {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(24px, 4vw, 42px);
          border: 1px solid var(--line);
          border-radius: 28px;
          background: var(--card);
          backface-visibility: hidden;
          box-shadow: 0 28px 80px rgba(42, 43, 92, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.7);
        }

        .identity-front {
          background:
            radial-gradient(circle at 88% 15%, rgba(105, 105, 194, 0.16), transparent 28%),
            var(--card);
        }

        .identity-back {
          transform: rotateY(180deg);
          background: #f0eff8;
        }

        .card-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.16em;
        }

        .identity-monogram {
          display: grid;
          width: 100px;
          aspect-ratio: 1;
          place-items: center;
          border: 1px solid rgba(76, 77, 157, 0.25);
          border-radius: 50%;
          background: rgba(111, 112, 192, 0.08);
          color: var(--accent);
          font-size: 2.2rem;
          font-weight: 500;
          letter-spacing: -0.1em;
        }

        .identity-front h3 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 600;
          letter-spacing: -0.07em;
          line-height: 1;
        }

        .identity-front > div:nth-last-of-type(1) p {
          margin: 10px 0 0;
          color: var(--mute);
          font-size: 1rem;
        }

        .flip-control {
          align-self: flex-start;
          padding: 11px 16px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: transparent;
          color: var(--ink);
          cursor: pointer;
          font-size: 0.74rem;
          transition: color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }

        .flip-control:hover {
          background: var(--accent);
          color: var(--card);
          transform: translateY(-2px);
        }

        .flip-control span {
          margin-left: 14px;
        }

        .identity-summary {
          max-width: 42ch;
          color: var(--ink-2);
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          line-height: 1.65;
        }

        .identity-contact {
          display: grid;
          gap: 8px;
          color: var(--mute);
          font-size: 0.82rem;
          overflow-wrap: anywhere;
        }

        .identity-contact a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .identity-contact a:hover {
          color: var(--accent);
        }

        .capability-list {
          align-self: center;
        }

        .capability-list .micro-label {
          margin-bottom: 12px;
        }

        .capability-list ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .capability-list li {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 16px;
          padding: 18px 0;
          border-top: 1px solid var(--line);
          color: var(--ink-2);
          font-size: clamp(0.92rem, 1.25vw, 1.1rem);
          line-height: 1.55;
        }

        .capability-number {
          color: var(--faint);
          font-family: var(--font-mono);
          font-size: 0.66rem;
          padding-top: 3px;
        }

        .skills-section {
          padding-top: clamp(64px, 9vw, 110px);
        }

        .skills-explorer {
          display: grid;
          gap: 22px;
        }

        .skill-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-filters button {
          min-height: 38px;
          padding: 0 16px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          color: var(--ink-2);
          cursor: pointer;
          font-size: 0.72rem;
          transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .skill-filters button:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
        }

        .skill-filters button.is-active {
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
        }

        .skills-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(220px, 0.32fr);
          gap: 12px;
        }

        .skills-periodic-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-auto-rows: minmax(112px, auto);
          gap: 7px;
        }

        .skill-cell {
          display: grid;
          grid-template-rows: auto 1fr auto;
          justify-items: start;
          min-width: 0;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: #fbfbfd;
          color: var(--ink);
          text-align: left;
          cursor: pointer;
          transition: transform 0.35s var(--ease), background 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .skill-cell:nth-child(5n + 2),
        .skill-cell:nth-child(5n + 4) {
          background: #efeff7;
        }

        .skill-cell:hover,
        .skill-cell.is-selected {
          transform: translateY(-3px);
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
          box-shadow: 0 12px 30px rgba(76, 77, 157, 0.2);
        }

        .skill-number {
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.58rem;
          transition: color 0.35s ease;
        }

        .skill-cell:hover .skill-number,
        .skill-cell.is-selected .skill-number {
          color: rgba(255, 255, 255, 0.68);
        }

        .skill-symbol {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          align-self: center;
          justify-self: center;
          border-radius: 13px;
          background: rgba(85, 86, 168, 0.1);
          color: var(--accent);
          font-size: clamp(1rem, 1.8vw, 1.45rem);
          font-weight: 700;
          letter-spacing: -0.08em;
          line-height: 1;
          transition: color 0.35s ease, background 0.35s ease, transform 0.35s var(--ease);
        }

        .skill-cell:hover .skill-symbol,
        .skill-cell.is-selected .skill-symbol {
          transform: scale(1.08) rotate(-4deg);
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
        }

        .skill-name {
          color: var(--ink-2);
          font-size: clamp(0.62rem, 0.9vw, 0.76rem);
          line-height: 1.2;
          overflow-wrap: anywhere;
          transition: color 0.35s ease;
        }

        .skill-cell:hover .skill-name,
        .skill-cell.is-selected .skill-name {
          color: rgba(255, 255, 255, 0.7);
        }

        .skill-feature {
          position: relative;
          display: flex;
          min-height: 100%;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          overflow: hidden;
          padding: clamp(22px, 3vw, 34px);
          border-radius: 20px;
          background: #222347;
          color: #fff;
          isolation: isolate;
          animation: skill-preview-in 0.38s var(--ease) both;
        }

        .skill-feature::after {
          position: absolute;
          top: -65px;
          right: -65px;
          width: 190px;
          aspect-ratio: 1;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 50%;
          content: '';
          box-shadow: 0 0 0 24px rgba(255, 255, 255, 0.035), 0 0 0 50px rgba(255, 255, 255, 0.025);
          pointer-events: none;
        }

        .skill-feature .micro-label {
          position: relative;
          z-index: 1;
          margin-bottom: auto;
          color: rgba(255, 255, 255, 0.62);
        }

        .skill-feature-logo {
          position: relative;
          z-index: 1;
          display: grid;
          width: clamp(88px, 11vw, 132px);
          aspect-ratio: 1;
          place-items: center;
          margin: 42px 0 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.06));
          color: #d4d5ff;
          box-shadow: 0 20px 50px rgba(10, 10, 31, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.16);
          font-size: clamp(2rem, 4vw, 3.7rem);
          font-weight: 700;
          letter-spacing: -0.1em;
          line-height: 1;
          text-align: center;
          text-transform: none;
          animation: skill-logo-in 0.45s var(--ease) both;
        }

        .skill-feature-logo[data-skill='Node.js'],
        .skill-feature-logo[data-skill='Express.js'],
        .skill-feature-logo[data-skill='Git'],
        .skill-feature-logo[data-skill='NPM'] {
          font-size: clamp(1.45rem, 2.8vw, 2.4rem);
          letter-spacing: -0.09em;
        }

        .skill-feature-logo[data-skill='RESTful API Development'],
        .skill-feature-logo[data-skill='Full-Stack Architecture'] {
          font-size: clamp(1.5rem, 3vw, 2.6rem);
        }

        .skill-feature-logo[data-skill='JavaScript (ES6+)'] {
          border-radius: 16px;
          background: #f0db4f;
          color: #252525;
        }

        .skill-feature-logo[data-skill='HTML5'] {
          border-radius: 24px 24px 34px 34px;
          background: #e65d35;
          color: #fff;
        }

        .skill-feature-logo[data-skill='CSS3'] {
          border-radius: 24px 24px 34px 34px;
          background: #3478c6;
          color: #fff;
        }

        .skill-feature-logo[data-skill='React.js'] {
          border-radius: 50%;
          background: transparent;
          color: #61dafb;
          font-size: clamp(4.4rem, 7vw, 6.2rem);
          font-weight: 400;
          letter-spacing: 0;
        }

        .skill-feature-logo[data-skill='Python'] {
          background: linear-gradient(135deg, #3975a8 0 50%, #ffd64a 50%);
          color: #fff;
        }

        .skill-feature-logo[data-skill='PHP'] {
          border-radius: 50%;
          background: #7377ad;
          color: #fff;
          font-size: clamp(1.8rem, 3.3vw, 2.8rem);
          font-style: italic;
          letter-spacing: -0.1em;
        }

        .skill-feature-logo[data-skill='MongoDB'] {
          border-radius: 50% 50% 50% 8px;
          background: #168c59;
          color: #fff;
        }

        .skill-feature-logo[data-skill='PostgreSQL'] {
          border-radius: 50% 50% 18px 18px;
          background: #366791;
          color: #fff;
        }

        .skill-feature-logo[data-skill='Git'],
        .skill-feature-logo[data-skill='GitHub'] {
          border-radius: 50%;
          background: #252525;
          color: #fff;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          letter-spacing: -0.06em;
        }

        .skill-feature-logo[data-skill='Tailwind CSS'] {
          border-radius: 20px;
          background: #0ea5e9;
          color: #fff;
          font-size: clamp(3.5rem, 6vw, 5rem);
        }

        .skill-feature-logo[data-skill='Bootstrap'] {
          border-radius: 24px;
          background: #712cf9;
          color: #fff;
          font-family: var(--font-mono);
        }

        .skill-feature-logo[data-skill='VS Code'] {
          border-radius: 24px;
          background: #0877c9;
          color: #fff;
          font-family: var(--font-mono);
        }

        .skill-feature-logo[data-skill='Postman'] {
          border-radius: 50%;
          background: #ff6c37;
          color: #fff;
        }

        .skill-feature-logo[data-skill='MySQL'] {
          border-radius: 50% 50% 28% 28%;
          background: #00758f;
          color: #fff;
        }

        .skill-feature-logo[data-skill='NPM'] {
          border-radius: 8px;
          background: #cb3837;
          color: #fff;
        }

        .skill-feature-logo[data-skill='Responsive Web Design'] {
          border-radius: 28px;
          background: #7478bd;
          color: #fff;
        }

        .skill-feature-symbol {
          position: relative;
          z-index: 1;
        }

        .skill-feature h3 {
          position: relative;
          z-index: 1;
          max-width: 12ch;
          font-size: clamp(1.35rem, 2.4vw, 2.1rem);
          font-weight: 550;
          line-height: 1;
        }

        .skill-feature-index {
          margin-top: 24px;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.68rem;
        }

        .skill-feature-index span {
          color: rgba(255, 255, 255, 0.5);
        }

        .contact-section {
          padding-bottom: clamp(88px, 12vw, 150px);
        }

        .contact-panel {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 28px;
          padding: clamp(24px, 4vw, 44px);
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--card);
          box-shadow: 0 24px 70px rgba(42, 43, 92, 0.06);
        }

        .contact-panel .micro-label {
          margin-bottom: 8px;
          font-size: 0.62rem;
        }

        .contact-panel a:not(.resume-link) {
          color: var(--ink);
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          text-decoration: none;
          overflow-wrap: anywhere;
        }

        .contact-panel a:not(.resume-link):hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .resume-link {
          display: inline-flex;
          align-items: center;
          gap: 22px;
          padding: 15px 19px;
          border-radius: 999px;
          background: var(--accent);
          color: var(--paper);
          font-size: 0.75rem;
          text-decoration: none;
          transition: transform 0.25s var(--ease);
        }

        .resume-link:hover {
          transform: translateY(-3px);
        }

        .site-footer {
          display: flex;
          justify-content: space-between;
          width: min(1440px, calc(100% - (var(--gutter) * 2)));
          margin: 0 auto;
          padding: 24px 0 36px;
          border-top: 1px solid var(--line);
          color: var(--mute);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .site-footer a {
          text-decoration: none;
        }

        @keyframes skill-preview-in {
          from {
            opacity: 0.65;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes skill-logo-in {
          from {
            opacity: 0;
            transform: scale(0.82) rotate(-8deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @media (max-width: 1000px) {
          .skills-layout {
            grid-template-columns: minmax(0, 1fr) minmax(190px, 0.34fr);
          }

          .skills-periodic-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .content-section {
            padding: 92px 0;
          }

          .about-layout {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          .identity-card {
            min-height: 380px;
          }

          .skills-layout {
            grid-template-columns: 1fr;
          }

          .skill-feature {
            min-height: 220px;
          }

          .skills-periodic-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .skill-cell {
            min-height: 100px;
            padding: 11px;
            border-radius: 14px;
          }

          .contact-panel {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 22px;
          }

          .site-footer {
            gap: 12px;
            font-size: 0.58rem;
          }
        }
      `}</style>
    </div>
  );
}
