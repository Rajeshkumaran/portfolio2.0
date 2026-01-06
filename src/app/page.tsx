import Divider from './components/Divider';
import MainSection from './components/MainSection';
import Skills from './components/Skills';
import Blogs from './components/Blogs';
import Patents from './components/Patents';
import Projects from './components/Projects';

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)]">
      <main className="px-6 lg:px-10 text-white">
        <MainSection />
        <Divider className="lg:hidden" />
        <Skills />
        <Divider />
        <Blogs />
        <Divider />
        <Patents />
        <Divider />
        <Projects />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
