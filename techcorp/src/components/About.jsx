import Section from './Section'

export default function About() {
  return (
    <Section id="about" title="About Us" subtitle="We are a technology partner trusted by leaders across finance, healthcare, and global supply chains. Our craft blends rigorous engineering with refined product taste.">
      <div className="grid grid-2" style={{ alignItems: 'center' }}>
        <div>
          <div className="card">
            <h3>Our Philosophy</h3>
            <p>Excellence compounds. We invest in foundational architecture, security by design, and impeccable execution so your products scale with confidence.</p>
            <div className="divider" />
            <h3>Numbers that matter</h3>
            <p><strong>99.99%</strong> uptime across critical workloads • <strong>200M+</strong> daily API calls • deployments to <strong>60+</strong> regions.</p>
          </div>
        </div>
        <figure>
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop" alt="Executive meeting room with city skyline" style={{ borderRadius: '24px', border: '1px solid var(--border)' }} />
          <figcaption className="subtle" style={{ marginTop: 10 }}>Precision, discretion, and momentum.</figcaption>
        </figure>
      </div>
    </Section>
  )
}