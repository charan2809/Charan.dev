# Premium Front‑End Agency Portfolio

A minimal, corporate‑grade portfolio site featuring dark/light mode, smooth scroll reveals, service cards, portfolio with filters + modal, case study carousel, testimonial slider, blog cards, and validated contact form.

## Quick start

- Open `index.html` in a browser, or serve locally:
  - Python: `python3 -m http.server 5173` then open `http://localhost:5173`
  - Node (serve): `npx serve -l 5173` then open `http://localhost:5173`

## Customize

- Brand:
  - Edit name in `index.html` (`.brand-text`).
  - Colors in `styles.css` (`--primary`, `--bg`, `--text`).
  - Typography via Google Fonts link in `index.html` (Poppins).
- Hero illustration: Replace `.animated-illustration` with your licensed Freepik/Storyset SVG/embed.
- Services/Projects/Case Studies/Testimonials/Blog: Update cards in `index.html`.
- Portfolio modal data comes from `data-*` attributes on `.project-card`.
- Contact form is client‑side only; wire it to your backend or a form service.

## Accessibility & performance

- Motion respects `prefers-reduced-motion`.
- Semantic landmarks, aria labels, focus management for modal.
- Lightweight CSS/JS; intersection observers for reveals and active nav.
