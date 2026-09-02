import Footer from '../landing/Footer';
import Navbar from '../landing/Navbar';
import ServicePageLayout from '../landing/ServicePageLayout';

export default function ServicePage({ service }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <Navbar />
      <ServicePageLayout {...service} />
      <Footer />
    </div>
  );
}
