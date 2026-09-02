import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const textures = [
  ['Епоксидна настилка', '/images/textures/epoxy-texture-1.avif'],
  ['Полиуретан-цимент', '/images/textures/epoxy-texture-2.avif'],
  ['Настилка от кварцов пясък', '/images/textures/epoxy-texture-3.avif'],
  ['Каменен килим', '/images/textures/epoxy-texture-4.avif'],
  ['Хидроизолации', '/images/textures/epoxy-texture-5.avif'],
  ['Texture 6', '/images/textures/epoxy-texture-6.avif'],
];

export default function EpoxyTextures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState(0);

  return (
    <section className="overflow-hidden bg-white py-10 md:py-18">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-4xl">Текстури на епоксидни подове</h2>
          <div className="mx-auto mb-4 h-1 w-16 bg-primary md:mb-5" />
          <p className="text-sm leading-relaxed text-muted-foreground md:text-lg">Разгледайте примерни повърхности и цветови комбинации за декоративни и индустриални настилки.</p>
        </motion.div>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-x-10 md:gap-y-10">
          {textures.map(([name, image], index) => {
            const active = selected === index;
            return <motion.button key={name} type="button" onClick={() => setSelected(index)} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: index * 0.05 }} className="group flex flex-col items-center gap-3 focus:outline-none" aria-pressed={active}>
              <span className={`relative block aspect-square w-full max-w-[180px] rounded-full p-1 transition-all duration-300 ${active ? 'bg-primary shadow-[0_18px_38px_rgba(245,166,35,0.28)]' : 'bg-white shadow-[0_14px_34px_rgba(15,23,42,0.16)] group-hover:shadow-[0_18px_42px_rgba(15,23,42,0.22)]'}`}>
                <span className="relative block h-full w-full overflow-hidden rounded-full border border-white/80 transition-transform duration-300 group-hover:scale-[1.04]"><img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" /><span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_22%,rgba(255,255,255,0.42),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%,rgba(0,0,0,0.18))]" /></span>
              </span>
              <span className={`text-sm font-semibold transition-colors duration-200 ${active ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>{name}</span>
            </motion.button>;
          })}
        </div>
      </div>
    </section>
  );
}
