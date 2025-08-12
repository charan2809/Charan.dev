import Section from './Section'

export default function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Let’s explore how we can partner. We typically respond within one business day.">
      <form className="grid grid-2" onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
        <div className="card">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required style={inputStyle} />
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" required style={inputStyle} />
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" style={inputStyle} />
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">Request a consultation</button>
          </div>
        </div>
        <aside>
          <div className="card">
            <h3>Our Offices</h3>
            <p>New York • London • Singapore</p>
            <div className="divider" />
            <h3>Reach us</h3>
            <p><a href="mailto:contact@techcorp.example">contact@techcorp.example</a></p>
          </div>
        </aside>
      </form>
    </Section>
  )
}

const inputStyle = {
  width: '100%',
  margin: '8px 0 16px',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  background: 'var(--bg-elev)',
  color: 'var(--fg)'
}