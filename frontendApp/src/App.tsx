import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import FeatureGrid from './components/FeatureGrid'
import PersonaSections from './components/PersonaSections'
import TrustSection from './components/TrustSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <HeroCarousel />
        <FeatureGrid />
        <PersonaSections />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

export default App
