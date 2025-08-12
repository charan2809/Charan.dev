import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const corporateVideo = 'https://cdn.coverr.co/videos/coverr-sunlit-office-people-walking-2189/1080p.mp4'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6])

  return (
    <section id="top" className="hero" ref={ref} aria-label="Hero">
      <video autoPlay muted loop playsInline aria-hidden>
        <source src={corporateVideo} type="video/mp4" />
      </video>
      <div className="container hero-content">
        <motion.div style={{ y, opacity }}>
          <h1 className="hero-headline">Engineering trust for the next era of enterprise</h1>
          <p className="hero-sub">Techcorp partners with Fortune 500 leaders and venture-backed startups to deliver secure, scalable, and elegant platforms—turning vision into value.</p>
          <div className="hero-ctas">
            <a href="#services" className="btn btn-primary">Discover Techcorp</a>
            <a href="#contact" className="btn" aria-label="Contact Techcorp">Contact Us</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}