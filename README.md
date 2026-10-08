# Personal Portfolio

This portfolio follows the supplied reel's role-first introduction, profile card, and interactive periodic-table skills layout. Entry and scroll-reveal animations respect reduced-motion preferences; hovering, focusing, or selecting a skill updates its preview. It uses the résumé for personal details and listed skills, the supplied intro video in the hero, and the résumé PDF for download. No projects, work history, certifications, achievements, metrics, testimonials, or additional contact details have been invented.

The hero's custom voice button starts the bundled male voice narration from `public/hero/muzamil-intro.wav` together with the looping intro video. This avoids native video controls appearing on hover and allows the narration to work in embedded previews. Replace that WAV to change the spoken introduction.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to GitHub Pages

The `main` branch is deployed automatically by `.github/workflows/deploy.yml`.
For the `myportfolio` repository, the public site URL is
`https://muzamil628.github.io/myportfolio/`. In the repository settings, set
**Pages → Build and deployment → Source** to **GitHub Actions**. The workflow
builds a static export with the repository base path and publishes it to Pages.

## Sections

| Section | Content source | Notes |
| --- | --- | --- |
| Hero | résumé and intro video | Name, role, video introduction, and résumé download |
| About | résumé | Interactive flip card with summary and key capabilities |
| Skills | résumé | Filterable periodic-table layout for listed skills and expertise |
| Contact | résumé | WhatsApp contact and résumé download |

## Rebuild hero video

1. Place the intro video at `intro.mp4.mp4` in the project root or update the `SOURCE` path in `scripts/build-hero-assets.py`.
2. Run:

```bash
python scripts/build-hero-assets.py
```

The script uses `ffmpeg` and `numpy` to crop tightly around the subject, whiten the background, and create a seamless looping version for the hero.

## Credits

The site uses self-hosted local font files stored in `src/fonts`.

- Inter is used for display and body text.
- Instrument Serif is used for italic accent styling.
- JetBrains Mono is used for labels and small text.
