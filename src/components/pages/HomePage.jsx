import About from '../landing/About';
import Contact from '../landing/Contact';
import EpoxyInfo from '../landing/EpoxyInfo';
import Footer from '../landing/Footer';
import Hero from '../landing/Hero';
import Navbar from '../landing/Navbar';
import Portfolio from '../landing/Portfolio';
import Services from '../landing/Services';
import Stats from '../landing/Stats';
import WhyChooseUs from '../landing/WhyChooseUs';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <EpoxyInfo />
      <Portfolio />
      <About />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </div>
  );
}
