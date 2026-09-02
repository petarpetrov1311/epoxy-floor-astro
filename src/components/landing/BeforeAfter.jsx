import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const comparisons = [
  {
    before: '/images/before-after/before-1.png',
    after: '/images/before-after/after-1.png',
    caption: 'Garage Floor Renovation',
    description: 'From cracked concrete to high-gloss obsidian finish',
  },
  {
    before: '/images/before-after/before-2.png',
    after: '/images/before-after/after-2.png',
    caption: 'Commercial Space Transformation',
    description: 'Industrial warehouse to premium metallic bronze floor',
  },
  {
    before: '/images/before-after/before-3.png',
    after: '/images/before-after/after-3.png',
    caption: 'Residential Basement Upgrade',
    description: 'Plain concrete transformed into decorative marble epoxy',
  },
];

function ComparisonSlider({ item, index }) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  // Teaser animation on first view
  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      const timeout = setTimeout(() => {
        let start = 50;
        const target = 35;
        const step = () => {
          start -= 0.5;
          if (start <= target) {
            // Bounce back
            const bounceBack = () => {
              start += 0.5;
              if (start >= 50) {
                setPosition(50);
                return;
              }
              setPosition(start);
              requestAnimationFrame(bounceBack);
            };
            bounceBack();
            return;
          }
          setPosition(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, 500 + index * 300);
      return () => clearTimeout(timeout);
    }
  }, [inView, index]);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }, [isDragging, updatePosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div
        ref={containerRef}
        className="relative w-full aspect-video overflow-hidden cursor-col-resize select-none border border-border"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* After (full background) */}
        <img
          src={item.after}
          alt={`After: ${item.caption}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={item.before}
            alt={`Before: ${item.caption}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          {/* Grip handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
              <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-foreground z-10">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-primary-foreground z-10">
          After
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-foreground">{item.caption}</h3>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function BeforeAfter() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section className="py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Transformations</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6">
            The Proof Is in the Surface
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Drag the slider to reveal dramatic before and after transformations. 
            Every surface tells a story of precision engineering.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-16">
          {comparisons.map((item, i) => (
            <ComparisonSlider key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}