'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Writing', href: '#blogs' },
  { label: 'Work', href: '#projects' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleScroll = useCallback(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className="portfolio-nav fixed top-0 left-0 right-0 z-50"
      aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        <a href="#about" aria-label="Rajesh K, home" className="text-3xl font-[family-name:var(--font-editorial)]">
          RK
        </a>

        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="portfolio-nav-link"
              aria-current={activeSection === item.href ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          ref={menuButtonRef}
          className="md:hidden p-2 text-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="portfolio-mobile-menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        id="portfolio-mobile-menu"
        hidden={!menuOpen}
        className="portfolio-mobile-menu md:hidden"
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="portfolio-nav-link"
              aria-current={activeSection === item.href ? 'location' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
