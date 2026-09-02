import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PhotoThumbnailSlider({ images = [], className = 'mt-4 md:mt-6', thumbnailClassName = 'h-20 w-full object-cover md:h-28', altPrefix = 'Project image' }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const count = images.length;
  const go = (direction) => setActive((index) => (index + direction + count) % count);

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowLeft') setLightbox((index) => (index - 1 + count) % count);
      if (event.key === 'ArrowRight') setLightbox((index) => (index + 1) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, lightbox]);

  if (!count) return null;

  return <>
    <div className={className}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
        <div className="grid flex-1 grid-cols-3 gap-3">
          {[-1, 0, 1].map((offset) => {
            const index = (active + offset + count) % count;
            return <button type="button" key={`${index}-${offset}`} onClick={() => setLightbox(index)} className="overflow-hidden rounded-md border border-border transition hover:border-primary/60"><img src={images[index]} alt={`${altPrefix} ${index + 1}`} className={thumbnailClassName} loading="lazy" /></button>;
          })}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="mt-3 flex justify-center gap-2">{images.map((_, index) => <button type="button" key={index} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} className={`h-2 rounded-full transition-all ${index === active ? 'w-4 bg-primary' : 'w-2 bg-border'}`} />)}</div>
    </div>
    <AnimatePresence>{lightbox !== null && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
      <button type="button" onClick={() => setLightbox(null)} aria-label="Close" className="absolute right-4 top-4 text-white"><X className="h-8 w-8" /></button>
      <button type="button" onClick={(event) => { event.stopPropagation(); setLightbox((index) => (index - 1 + count) % count); }} aria-label="Previous image" className="absolute left-4 text-white"><ChevronLeft className="h-10 w-10" /></button>
      <img src={images[lightbox]} alt={`${altPrefix} ${lightbox + 1}`} className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} />
      <button type="button" onClick={(event) => { event.stopPropagation(); setLightbox((index) => (index + 1) % count); }} aria-label="Next image" className="absolute right-4 text-white"><ChevronRight className="h-10 w-10" /></button>
    </motion.div>}</AnimatePresence>
  </>;
}
