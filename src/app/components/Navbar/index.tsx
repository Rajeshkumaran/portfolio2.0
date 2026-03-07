'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
          ? 'backdrop-blur-lg bg-black/60 border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#about" className="text-lg font-bold gradient-text font-[family-name:var(--font-inter)]">
          RK
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors font-[family-name:var(--font-inter)] relative ${
                activeSection === item.href
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
              {activeSection === item.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-0.5 bg-zinc-300"
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-zinc-300"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-zinc-300"
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
            className="md:hidden backdrop-blur-lg bg-black/80 border-b border-white/[0.06] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`transition-colors text-base font-[family-name:var(--font-inter)] ${
                    activeSection === item.href
                      ? 'text-violet-400'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
