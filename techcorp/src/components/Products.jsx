import Section from './Section'

const products = [
  {
    name: 'Aegis Identity',
    blurb: 'Unified identity, policy, and secrets with fine-grained governance.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800&auto=format&fit=crop'
  },
  {
    name: 'Atlas Data Mesh',
    blurb: 'Federated data mesh with lineage, contracts, and observability.',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1800&auto=format&fit=crop'
  },
  {
    name: 'Helios Edge',
    blurb: 'Ultra-low latency edge runtime and orchestration for modern apps.',
    image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1800&auto=format&fit=crop'
  }
]

export default function Products() {
  return (
    <Section id="products" title="Products & Solutions" subtitle="Opinionated platforms that reduce time-to-value and increase reliability.">
      <div className="grid grid-3">
        {products.map(p => (
          <article className="card" key={p.name}>
            <img src={p.image} alt="" style={{ borderRadius: 18, border: '1px solid var(--border)', marginBottom: 14 }} />
            <h3>{p.name}</h3>
            <p>{p.blurb}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}