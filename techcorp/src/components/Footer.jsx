export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="section" role="contentinfo">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} aria-hidden="true" />
          <strong>Techcorp</strong>
        </div>
        <nav aria-label="Footer">
          <a href="#about" style={{ marginRight: 16 }}>About</a>
          <a href="#services" style={{ marginRight: 16 }}>Services</a>
          <a href="#products" style={{ marginRight: 16 }}>Solutions</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="subtle">© {year} Techcorp. All rights reserved.</span>
      </div>
    </footer>
  )
}