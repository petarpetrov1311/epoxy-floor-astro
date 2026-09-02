import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Building2, Ruler } from 'lucide-react';

const stats = [
  { value: 20, suffix: '+ години', label: 'Професионален опит', icon: Award },
  { value: 80000, suffix: '+', label: 'Положени кв. м.', icon: Ruler },
  { value: 1200, suffix: '+', label: 'Изпълнени обекти', icon: Building2 },
];

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      start += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="text-xl sm:text-3xl md:text-5xl font-bold text-primary">
      {count.toLocaleString('bg-BG')}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stats" className="bg-navy py-6 md:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-3 gap-1 text-center sm:gap-3 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative py-3 md:py-6"
              >
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-white/15 md:block" />
                )}
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-primary ring-1 ring-white/15 sm:h-10 sm:w-10 md:mb-4 md:h-12 md:w-12">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                <div className="mt-1 text-[11px] leading-tight text-white/70 font-medium sm:text-sm md:mt-2">{stat.label}</div>
                <div className="mt-2 w-7 h-0.5 bg-primary/60 mx-auto md:mt-3 md:w-10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
