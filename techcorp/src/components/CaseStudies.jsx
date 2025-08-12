import Section from './Section'

const studies = [
  { client: 'Global Bank', summary: 'Modernized core payments; reduced settlement time from T+2 to near-real-time.', kpi: '−72% ops incidents' },
  { client: 'Healthcare Network', summary: 'Unified patient portal across 40 hospitals with HIPAA-first design.', kpi: '+38% patient engagement' },
  { client: 'Logistics Leader', summary: 'Supply chain visibility platform across 120 countries.', kpi: '99.99% SLA' },
]

export default function CaseStudies() {
  return (
    <Section id="cases" title="Case Studies" subtitle="Outcomes, not outputs. Select transformations delivered with discretion.">
      <div className="grid grid-3">
        {studies.map(s => (
          <article className="card" key={s.client}>
            <h3 style={{ marginBottom: 8 }}>{s.client}</h3>
            <p>{s.summary}</p>
            <div className="divider" />
            <p><strong>{s.kpi}</strong></p>
          </article>
        ))}
      </div>
    </Section>
  )
}