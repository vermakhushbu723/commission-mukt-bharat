import MembersTicker from '../components/home/MembersTicker'
import Hero from '../components/home/Hero'
import SloganMarquee from '../components/home/SloganMarquee'
import Vision from '../components/home/Vision'
import Manifesto from '../components/home/Manifesto'
import Faq from '../components/home/Faq'
import Articles from '../components/home/Articles'
import Join from '../components/home/Join'
import Revolutionaries from '../components/home/Revolutionaries'
import Contact from '../components/home/Contact'

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink relative">
      <MembersTicker />
      <Hero />
      <SloganMarquee />
      <Vision />
      <Manifesto />
      <Faq />
      <Articles />
      <Join />
      <Revolutionaries />
      <Contact />
    </main>
  )
}
