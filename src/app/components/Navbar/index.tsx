'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link'; // TODO: Re-enable with Videos link

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Writing', href: '#blogs' },
  { label: 'Work', href: '#projects' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-white/60 backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(31,38,80,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#about" className="text-lg font-bold gradient-text font-[family-name:var(--font-inter)]">
          RK
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 glass-chip !rounded-full px-1.5 py-1.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-glass relative px-4 py-1.5 text-sm font-[family-name:var(--font-inter)] ${
                activeSection === item.href
                  ? 'text-rose-800'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {activeSection === item.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/45 backdrop-blur-md backdrop-saturate-150 border border-white/80 shadow-[0_2px_8px_rgba(17,24,60,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
          {/* TODO: Re-enable when videos page goes live
          <Link
            href="/videos"
            className="nav-glass relative px-4 py-1.5 text-sm font-medium text-rose-700 hover:text-rose-800 flex items-center gap-1.5 font-[family-name:var(--font-inter)]"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Videos
          </Link>
          */}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-0.5 bg-zinc-700"
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-zinc-700"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-zinc-700"
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-white/80 border-b border-white/50 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`transition-colors text-base font-[family-name:var(--font-inter)] ${
                    activeSection === item.href
                      ? 'text-rose-600'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {/* TODO: Re-enable when videos page goes live
              <Link
                href="/videos"
                className="flex items-center gap-2 text-base text-rose-700 font-medium font-[family-name:var(--font-inter)]"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Videos
              </Link>
              */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
