import Section from './Section'
import { FiLock, FiCloud, FiBarChart2, FiLayers } from 'react-icons/fi'

const services = [
  { icon: FiLock, title: 'Security & Compliance', desc: 'Zero-trust architecture, SOC2/ISO27001, privacy by design.' },
  { icon: FiCloud, title: 'Cloud Platforms', desc: 'Multi-cloud, edge, and global-scale infrastructure.' },
  { icon: FiLayers, title: 'Product Engineering', desc: 'From concept to launch—APIs, frontends, and data systems.' },
  { icon: FiBarChart2, title: 'Data & AI', desc: 'Analytics platforms, ML pipelines, and AI productization.' },
]

export default function Services() {
  return (
    <Section id="services" title="Services" subtitle="Full-stack capabilities for mission-critical software.">
      <div className="grid grid-3">
        {services.map(({ icon: Icon, title, desc }) => (
          <div className="card" key={title}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'grid', placeItems: 'center' }}>
                <Icon color="#fff" />
              </div>
              <h3 style={{ margin: 0 }}>{title}</h3>
            </div>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}