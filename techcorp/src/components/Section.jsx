import { motion } from 'framer-motion'

export default function Section({ id, title, subtitle, children, ariaLabel }) {
  return (
    <section id={id} className="section" aria-label={ariaLabel || title}>
      <div className="container">
        {(title || subtitle) && (
          <div className="section-header">
            {title && <h2>{title}</h2>}
            {subtitle && <p className="subtle" style={{ maxWidth: 760 }}>{subtitle}</p>}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}