import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/projects/oborudvane1.jpg',
    category: 'Производства и складове',
    title: 'ПОДОВИ НАСТИЛКИ ЗА ИНДУСТРИЯТА',
    description: 'Изграждаме подови настилки за производствени помещения, халета, складове от лека, тежка и химическа промишленост.',
  },
  {
    image: '/images/projects/parking.jpg',
    category: 'Паркинги и гаражи',
    title: 'ПАРКИНГИ И ГАРАЖИ',
    description: 'Настилките лесно се почистват, не се хлъзгат и са устойчиви на масло и петролни продукти.',
  },
  {
    image: '/images/projects/about-us1.jpg',
    category: 'Декоративни настилки',
    title: 'ДЕКОРАТИВНИ ЕПОКСИДНИ НАСТИЛКИ',
    description: 'Подходящи за офиси, магазини, заведения, ресторанти, хотели, домове и много други.',
  },
  {
    image: '/images/projects/oborudvane2.jpg',
    category: 'Тераси и плоски покриви',
    title: 'ХИДРОИЗОЛАЦИИ',
    description: 'Гумирана хидроизолационна система за открити площи. Устойчива на големи амплитудни различия.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  };

  return (
    <section id="hero" className="relative h-[60vh] md:h-[85vh] min-h-[400px] overflow-hidden bg-navy">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/65" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute left-5 right-5 top-[22%] z-10 md:hidden">
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="max-w-[20rem] text-[1.55rem] font-bold leading-[1.12] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            {slides[current].title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Logo — hidden on mobile */}
              <div className="mb-4 hidden md:block">
                <img
                  src="/images/site/logo-hero-footer.png"
                  alt="Epoxy Floors"
                  className="h-28 w-auto object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>

              <div className="hidden md:inline-block bg-primary/90 text-white text-xs font-semibold px-4 py-1.5 rounded mb-4 tracking-wide uppercase">
                {slides[current].category}
              </div>

              <h1 className="hidden md:block text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                {slides[current].title}
              </h1>

              <p className="hidden md:block text-white/80 text-lg mb-8 leading-relaxed max-w-xl">
                {slides[current].description}
              </p>

              <div className="flex flex-wrap gap-2.5 md:gap-3">
                <a
                  href="#contact"
                  className="bg-primary text-white px-4 py-2 md:px-8 md:py-3.5 text-sm md:text-base font-semibold rounded hover:bg-primary/80 transition-all duration-200 flex items-center gap-2"
                >
                  Заявете Оферта
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
                <a
                  href="#services"
                  className="border-2 border-white/60 text-white px-4 py-2 md:px-8 md:py-3.5 text-sm md:text-base font-semibold rounded hover:border-primary hover:text-primary transition-all duration-200"
                >
                  Видове Настилки
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-[54%] -translate-y-1/2 w-9 h-9 md:left-4 md:top-1/2 md:w-11 md:h-11 bg-white/20 hover:bg-primary/80 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-[54%] -translate-y-1/2 w-9 h-9 md:right-4 md:top-1/2 md:w-11 md:h-11 bg-white/20 hover:bg-primary/80 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
