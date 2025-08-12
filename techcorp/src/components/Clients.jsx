import Section from './Section'

const logos = [
  'https://dummyimage.com/160x60/999/fff&text=ALPHA',
  'https://dummyimage.com/160x60/777/fff&text=BETA',
  'https://dummyimage.com/160x60/555/fff&text=GAMMA',
  'https://dummyimage.com/160x60/888/fff&text=OMEGA',
  'https://dummyimage.com/160x60/666/fff&text=SIGMA',
]

const quotes = [
  {
    quote: 'Techcorp delivered on time, on budget, and with engineering that we continue to scale on years later.',
    name: 'CTO, Global Bank'
  },
  {
    quote: 'A true partner—their taste in product and depth in security is rare to find together.',
    name: 'SVP Product, Healthcare Network'
  }
]

export default function Clients() {
  return (
    <Section id="clients" title="Clients & Testimonials" subtitle="Trusted by leaders across regulated industries and high-growth ventures.">
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }} aria-label="Client logos">
          {logos.map(src => (
            <img key={src} src={src} alt="Client logo" style={{ opacity: 0.8, filter: 'grayscale(100%)', height: 36 }} />
          ))}
        </div>
        <div className="divider" />
        <div className="grid grid-2">
          {quotes.map(q => (
            <blockquote key={q.name} style={{ margin: 0 }}>
              <p style={{ fontSize: 20, lineHeight: 1.6, color: 'var(--fg)' }}>&ldquo;{q.quote}&rdquo;</p>
              <cite className="subtle" style={{ display: 'block', marginTop: 10 }}>— {q.name}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </Section>
  )
}