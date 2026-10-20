import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Blogs from './components/Blogs';
import Patents from './components/Patents';
import Projects from './components/Projects';
import Hobbies from './components/Hobbies';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import './portfolio.css';

export default function Home() {
  return (
    <div className="portfolio min-h-screen">
      <a href="#main-content" className="portfolio-skip-link">Skip to content</a>
      <BackToTop />
      <Navbar />
      <main id="main-content">
        <section id="about">
          <MainSection />
        </section>
        <section id="experience" className="portfolio-section">
          <Experience />
        </section>
        <section id="skills" className="portfolio-section">
          <Skills />
        </section>
        <section id="blogs" className="portfolio-section">
          <Blogs />
        </section>
        <section id="patents" className="portfolio-section">
          <Patents />
        </section>
        <section id="projects" className="portfolio-section">
          <Projects />
        </section>
        <section id="hobbies" className="portfolio-section">
          <Hobbies />
        </section>
      </main>
      <Footer />
    </div>
  );
}
