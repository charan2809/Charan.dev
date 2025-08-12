import './index.css'
import { ThemeProvider } from './theme/ThemeProvider'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Products from './components/Products'
import CaseStudies from './components/CaseStudies'
import Clients from './components/Clients'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Products />
        <CaseStudies />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  )
}
