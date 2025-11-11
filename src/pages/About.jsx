import Header from '../components/Header';
import AboutHero from '../components/AboutHero';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#212631] text-white">
      <Header />
      
      <main>
        <AboutHero />
      </main>
      
      <Footer />
    </div>
  );
}