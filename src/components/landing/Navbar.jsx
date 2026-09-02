import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';

const serviceLinks = [
  { label: 'Тераси и плоски покриви', href: '/nastilki/terasi-i-ploski-pokrivi' },
  { label: 'Двор и открити части', href: '/nastilki/dvor-i-otkriti-chasti' },
  { label: 'Игрища и спортни съоръжения', href: '/nastilki/igrishta-i-sportni-saorazhenia' },
  { label: 'Хранително-вкусова промишленост', href: '/nastilki/hranitelno-vkusova' },
  { label: 'Производства и складове', href: '/nastilki/proizvodstva-i-skladove' },
  { label: 'Паркинги и гаражи', href: '/nastilki/parking-i-garaji' },
  { label: 'Мортел', href: '/nastilki/mortel' },
  { label: 'Мандри и кланици', href: '/nastilki/mandri-i-klanici' },
  { label: 'Декоративни настилки', href: '/nastilki/dekorativni' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDarkSection, setOverDarkSection] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 60;
      const darkSectionIds = ['hero', 'stats', 'why-choose-us'];
      const nextOverDarkSection = darkSectionIds.some((id) => {
        const section = document.getElementById(id);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        return rect.top < 80 && rect.bottom > 80;
      });

      setScrolled(nextScrolled);
      setOverDarkSection(Boolean(nextScrolled && nextOverDarkSection));
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeMobileMenuOnScroll = () => {
      setIsOpen(false);
      setMobileServicesOpen(false);
    };

    window.addEventListener('scroll', closeMobileMenuOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeMobileMenuOnScroll);
  }, [isOpen]);

  const menuOpen = isOpen || dropdownOpen;
  const navSurfaceClass = menuOpen
    ? 'bg-white shadow-lg backdrop-blur-sm'
    : overDarkSection
    ? 'bg-black/20 backdrop-blur-md shadow-none'
    : scrolled
      ? 'shadow-lg bg-white/98 backdrop-blur-sm'
      : 'bg-white';
  const navTextClass = !menuOpen && overDarkSection
    ? 'text-white drop-shadow-sm hover:text-primary'
    : 'text-foreground hover:text-primary';
  const menuButtonClass = !menuOpen && overDarkSection ? 'text-white drop-shadow-sm' : 'text-foreground';

  return (
    <>
      {/* Top info bar */}
      <div className="bg-navy text-white text-xs py-2 px-6 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a href="tel:+359898512776" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="w-3 h-3" />
            +359 898 512 776
          </a>
          <a href="mailto:epoxy_fl@abv.bg" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="w-3 h-3" />
            epoxy_fl@abv.bg
          </a>
        </div>
        <span className="text-white/60">Индустриални и декоративни подови настилки</span>
      </div>

      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${navSurfaceClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <a href="/#hero" className="flex items-center gap-3">
              <img
                src="/images/site/logo-navbar.png"
                    alt="Epoxy Floors Logo"
                    className="h-14 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">EF</span>
                </div>
                <div>
                  <div className="font-bold text-foreground leading-tight text-sm">EPOXY FLOORS</div>
                  <div className="text-[10px] text-muted-foreground">Индустриални и декоративни настилки</div>
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/#hero" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Начало</a>

              {/* Настилки dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${navTextClass}`}
                >
                  Настилки
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white border border-border rounded-lg shadow-xl z-50 py-2"
                    >
                      {serviceLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/#projects" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Проекти</a>
              <a href="/galeria" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Галерия</a>
              <a href="/blogove" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Блогове</a>
              <a href="/#about" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>За нас</a>
              <a href="/#contact" className={`text-sm font-medium transition-colors duration-200 ${navTextClass}`}>Контакти</a>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="bg-primary text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-primary/90 transition-all duration-200 shadow-sm"
              >
                Заяви Оферта
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 ${menuButtonClass}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="absolute left-0 right-0 top-full md:hidden bg-white border-t border-border shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <a href="/#hero" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">Начало</a>

                {/* Mobile services dropdown */}
                <div>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex items-center justify-between w-full py-2 text-foreground hover:text-primary font-medium transition-colors"
                  >
                    Настилки
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileServicesOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-primary/30">
                      {serviceLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => { setIsOpen(false); setMobileServicesOpen(false); }}
                          className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a href="/#projects" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">Проекти</a>
                <a href="/galeria" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">Галерия</a>
                <a href="/blogove" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">Блогове</a>
                <a href="/#about" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">За нас</a>
                <a href="/#contact" onClick={() => setIsOpen(false)} className="block py-2 text-foreground hover:text-primary font-medium transition-colors">Контакти</a>

                <a
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-primary text-white px-6 py-3 text-sm font-semibold rounded mt-2"
                >
                  Заяви Оферта
                </a>
                <div className="pt-3 border-t border-border space-y-2">
                  <a href="tel:+359898512776" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    +359 898 512 776
                  </a>
                  <a href="mailto:epoxy_fl@abv.bg" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    epoxy_fl@abv.bg
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
