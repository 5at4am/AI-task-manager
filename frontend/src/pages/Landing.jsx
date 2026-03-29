import LandingNavbar from '../components/layout/LandingNavbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import HowItWorks from '../components/sections/HowItWorks';
import FeaturesShowcase from '../components/sections/FeaturesShowcase';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-void-900">
      <LandingNavbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <FeaturesShowcase />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
