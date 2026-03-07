import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Blogs from './components/Blogs';
import Patents from './components/Patents';
import Projects from './components/Projects';
import Hobbies from './components/Hobbies';
import CursorSpotlight from './components/CursorSpotlight';
import BackToTop from './components/BackToTop';

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-50">
      <CursorSpotlight />
      <BackToTop />
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-8">
        <section id="about">
          <MainSection />
        </section>
        <section id="experience" className="py-12 sm:py-16 lg:py-28">
          <Experience />
        </section>
        <section id="skills" className="py-12 sm:py-16 lg:py-28">
          <Skills />
        </section>
        <section id="blogs" className="py-12 sm:py-16 lg:py-28">
          <Blogs />
        </section>
        <section id="patents" className="py-12 sm:py-16 lg:py-28">
          <Patents />
        </section>
        <section id="projects" className="py-12 sm:py-16 lg:py-28">
          <Projects />
        </section>
        <section id="hobbies" className="py-12 sm:py-16 lg:py-28">
          <Hobbies />
        </section>
      </main>
    </div>
  );
}
