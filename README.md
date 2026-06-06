# The Cockroach Janta Party — React rebuild

A faithful React rebuild of the TCJP landing page (originally a Next.js site),
recreated from the saved HTML with the same UI, type system, palette, and
cinematic hero animations.

## Stack

- **React 19** + the **React Compiler** (`babel-plugin-react-compiler`)
- **Vite 8** (`@vitejs/plugin-react`)
- **Tailwind CSS v4** (`@tailwindcss/vite`) with a custom `@theme`
- Google Fonts: Bowlby One (display), Oswald (condensed), Inter (body),
  Noto Serif Devanagari

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

## Structure

```
src/
  index.css                 # Tailwind import, @theme tokens, base styles, keyframe animations
  App.jsx                   # page composition
  data/                     # content-only modules (members, manifesto, faqs, nav, ...)
  components/
    ui/                     # reusable primitives (Emblem, Marquee, MemberAvatar,
                            #   IndianFlag, SpeakerPodium, silhouettes, icons, placeholders)
    layout/                 # AnnouncementBar, Header, Footer, NewsletterForm
    home/                   # Hero, Vision, Manifesto, Faq, Articles, Join, Contact, ...
    SwarmChatButton.jsx
```

## Notes on the rebuild

- **Design tokens** (`--color-paper`, `--color-ink`, `--color-gold`, `--font-display`, …)
  live in the Tailwind `@theme`, so utilities like `bg-paper`, `text-gold-ink`,
  and `font-display` are generated automatically.
- The original shipped three **photographs** and two background **SVGs**
  (`parliament.svg`, `crowd.svg`) that weren't available offline. These are
  recreated as on-brand SVG/CSS components (`ParliamentSilhouette`,
  `CrowdSilhouette`, and the three `placeholders.jsx` poster stand-ins).
- Member avatars use the original's **initials-chip fallback** (gold / ink
  variants) so nothing depends on external image URLs.
- The hero's external CSS animations (`scene-zoom`, `parallax-drift`,
  floodlights, smoke, lens flares, flag-wave, particles, marquees, …) are
  reconstructed as keyframes in `index.css` and respect
  `prefers-reduced-motion`.
- A few interactions were made real: the **eligibility checklist**, the
  **newsletter form** (client-side validation + honeypot), the **mobile menu**,
  the **language selector**, and the **Swarm Chat** popover.
- Links to other pages of the original site (e.g. `/articles`, `/gallery`) are
  kept as hrefs; in-page CTAs (`#join`, `#manifesto`, `#contact`, …) smooth-scroll.
