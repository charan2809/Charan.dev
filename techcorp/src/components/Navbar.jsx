import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label="Techcorp Home" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} aria-hidden="true" />
          <span>Techcorp</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#products">Solutions</a>
          <a href="#cases">Case Studies</a>
          <a href="#clients">Clients</a>
          <a href="#contact">Contact</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}