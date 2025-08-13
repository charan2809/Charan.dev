# Sudharshan Interior Designs — Static Site

- Tech: HTML5, CSS3, Vanilla JS. No frameworks.
- Structure:
  - `/index.html`, `/contact.html`
  - `/css/styles.css`, `/js/app.js`
  - `/images`, `/icons`, `/fonts`
  - `sitemap.xml`, `robots.txt`, `favicon.svg`, `manifest.webmanifest`

Brand color
- Default: WhatsApp Green `#25D366`.
- To switch to Shopify Green `#95BF47`: edit `/css/styles.css` variables:
  - `--brand: #95BF47;`
  - `--brand-rgb: 149,191,71;`

Build/Performance
- Files are production-ready. For extra optimization:
  - Minify CSS: cssnano to `styles.min.css`; update HTML link if used.
  - Minify JS: terser to `app.min.js`; update HTML script if used.
  - Serve with HTTP caching and `Content-Type` headers (`text/html`, `text/css`, `application/javascript`, `image/svg+xml`).

Accessibility
- Keyboard navigation on menu, carousel, and modals.
- Focus styles enabled; respects `prefers-reduced-motion`.

SEO
- Meta tags present; JSON-LD for Organization and Service. Update URLs and contact info for production.

Deploy
- Any static host (Netlify, Vercel, GitHub Pages, S3+CloudFront, NGINX). Ensure HTTPS and enable compression.

Notes
- Replace placeholder images in `/images` with compressed assets keeping dimensions/aspect ratios to maintain CLS < 0.1.
- Map embed in `contact.html` is a placeholder; add an iframe or a static map screenshot if desired.
