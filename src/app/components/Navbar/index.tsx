'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Writing', href: '#blogs' },
  { label: 'Work', href: '#projects' },
  { label: 'Journey', href: '/journey/' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isJourney = pathname === '/journey' || pathname.startsWith('/journey/');

  const handleScroll = useCallback(() => {
    const sections = navItems.filter((item) => item.href.startsWith('#')).map((item) => item.href.slice(1));
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
    if (isJourney) return;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isJourney]);

  const hrefFor = (href: string) => isJourney && href.startsWith('#') ? `/${href}` : href;
  const currentFor = (href: string): 'page' | 'location' | undefined => {
    if (href === '/journey/') return isJourney ? 'page' : undefined;
    return !isJourney && activeSection === href ? 'location' : undefined;
  };

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
        <Link href={hrefFor('#about')} aria-label="Rajesh K, home" className="text-3xl font-[family-name:var(--font-editorial)]">
          RK
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={hrefFor(item.href)}
              className="portfolio-nav-link"
              aria-current={currentFor(item.href)}
            >
              {item.label}
            </Link>
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
            <Link
              key={item.href}
              href={hrefFor(item.href)}
              className="portfolio-nav-link"
              aria-current={currentFor(item.href)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
