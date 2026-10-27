import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const VISIBLE = 3;
const GAP = 12;
const BUFFER = 1;
const RENDERED = VISIBLE + BUFFER * 2;

export default function PhotoThumbnailSlider({
  images = [],
  className = 'mt-4 md:mt-6',
  thumbnailClassName = 'w-full h-20 md:h-28 object-cover',
  altPrefix = 'Project image',
}) {
  const containerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [startIdx, setStartIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const xMV = useMotionValue(0);
  const imageCount = images.length;

  const restX = useCallback((iw) => -(iw + GAP) * BUFFER, []);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const measure = () => {
      const width = containerRef.current.offsetWidth;
      const nextItemWidth = (width - GAP * (VISIBLE - 1)) / VISIBLE;
      setItemWidth(nextItemWidth);
      xMV.set(restX(nextItemWidth));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [xMV, restX]);

  const goDir = useCallback(
    async (dir) => {
      if (locked || itemWidth <= 0 || imageCount <= 1) return;
      setLocked(true);

      const step = itemWidth + GAP;
      const from = restX(itemWidth);
      const to = from - dir * step;

      await animate(xMV, to, {
        duration: 0.42,
        ease: [0.25, 0.46, 0.45, 0.94],
      });

      xMV.set(from);
      setStartIdx((s) => (s + dir + imageCount) % imageCount);
      setLocked(false);
    },
    [imageCount, itemWidth, locked, restX, xMV],
  );

  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((i) => (i + 1) % imageCount);
      if (event.key === 'ArrowLeft') setLightbox((i) => (i - 1 + imageCount) % imageCount);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imageCount, lightbox]);

  if (!images.length) return null;

  const renderedIndices = Array.from(
    { length: RENDERED },
    (_, i) => (startIdx + i - BUFFER + imageCount * 100) % imageCount,
  );
  const trackWidth = itemWidth > 0 ? RENDERED * itemWidth + (RENDERED - 1) * GAP : 0;

  return (
    <>
      <div className={className}>
        <div className="md:hidden overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 px-1">
            {images.map((src, imgIdx) => (
              <button
                key={src}
                onClick={() => setLightbox(imgIdx)}
                aria-label={`Open image ${imgIdx + 1}`}
                className="w-28 flex-shrink-0 overflow-hidden rounded-md border border-border bg-white shadow-sm transition-all duration-200 hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={src}
                  alt={`${altPrefix} ${imgIdx + 1}`}
                  className="h-20 w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => goDir(-1)}
            disabled={locked || imageCount <= 1}
            aria-label="Previous image"
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-border shadow-sm hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={containerRef}
            className="flex-1 overflow-hidden rounded-lg"
          >
            <motion.div
              style={{
                display: 'flex',
                gap: GAP,
                x: itemWidth > 0 ? xMV : undefined,
                transform: itemWidth > 0 ? undefined : 'translateX(calc(-100% / 3 - 4px))',
                width: trackWidth > 0 ? trackWidth : 'auto',
              }}
            >
              {renderedIndices.map((imgIdx, pos) => (
                <button
                  key={pos}
                  onClick={() => setLightbox(imgIdx)}
                  aria-label={`Open image ${imgIdx + 1}`}
                  style={{ width: itemWidth > 0 ? itemWidth : 'calc((100% - 24px) / 3)', flexShrink: 0 }}
                  className="rounded-md overflow-hidden border border-border hover:border-primary/60 hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={images[imgIdx]}
                    alt={`${altPrefix} ${imgIdx + 1}`}
                    className={thumbnailClassName}
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </motion.div>
          </div>

          <button
            onClick={() => goDir(1)}
            disabled={locked || imageCount <= 1}
            aria-label="Next image"
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-border shadow-sm hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden md:flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (locked || i === startIdx) return;
                xMV.set(restX(itemWidth));
                setStartIdx(i);
              }}
              aria-label={`Show image ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === startIdx ? 'bg-primary w-4' : 'bg-border w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((i) => (i - 1 + imageCount) % imageCount);
              }}
              aria-label="Previous image"
              className="absolute left-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[lightbox]}
              alt={`${altPrefix} ${lightbox + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />

            <button
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((i) => (i + 1) % imageCount);
              }}
              aria-label="Next image"
              className="absolute right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightbox + 1} / {imageCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
