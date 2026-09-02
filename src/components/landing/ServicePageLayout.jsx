import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import PhotoThumbnailSlider from './PhotoThumbnailSlider';

function MobileServiceGallery({ title, image, gallery = [] }) {
  const images = gallery.length ? gallery : [image];
  const viewportRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((index) => Math.max(index - 1, 0));
  const next = () => setCurrent((index) => Math.min(index + 1, images.length - 1));

  useEffect(() => {
    if (!viewportRef.current) return undefined;

    const measure = () => {
      setSlideWidth(Math.min(viewportRef.current.offsetWidth * 0.72, 280));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="mb-8 lg:hidden">
      <img src={image} alt={title} className="h-64 w-full rounded-lg object-cover shadow-lg" />
      <h2 className="mt-6 text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 h-1 w-12 bg-primary" />

      <div className="mt-6">
        <div ref={viewportRef} className="relative overflow-hidden rounded-lg bg-muted shadow-sm">
          <motion.div
            className="flex gap-3 p-2"
            animate={{ x: -(slideWidth + 12) * current }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: slideWidth > 0 ? images.length * slideWidth + (images.length - 1) * 12 + 16 : 'auto' }}
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                className={`flex-shrink-0 overflow-hidden rounded-md border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  current === index ? 'border-primary shadow-md' : 'border-white/80'
                }`}
                style={{ width: slideWidth || 220 }}
                aria-label={`Снимка ${index + 1}`}
              >
                <img
                  src={src}
                  alt={`${title} ${index + 1}`}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </motion.div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                disabled={current === 0}
                aria-label="Предишна снимка"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow transition-colors hover:bg-primary hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={current === images.length - 1}
                aria-label="Следваща снимка"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow transition-colors hover:bg-primary hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Снимка ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  current === index ? 'w-5 bg-primary' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicePageLayout({ title, image, description, points = [], gallery, image2, description2 }) {
  return (
    <main className="min-h-screen">
      <div className="relative h-72 md:h-96 overflow-hidden bg-navy">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold text-white"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <a href="/#services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Обратно към всички настилки
        </a>

        <MobileServiceGallery title={title} image={image} gallery={gallery} />

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <img src={image} alt={title} className="w-full rounded-lg shadow-lg object-cover h-80" />
            {gallery && gallery.length > 0 && (
              <PhotoThumbnailSlider
                images={gallery}
                className="mt-4 md:mt-6"
                altPrefix={title}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
            <div className="w-12 h-1 bg-primary mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>

            <h3 className="font-bold text-foreground mb-4">Предимства:</h3>
            <ul className="space-y-3 mb-10">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <a
              href="/#contact"
              className="inline-block bg-primary text-white px-8 py-3.5 font-semibold rounded hover:bg-primary/90 transition-all duration-200"
            >
              Заявете оферта
            </a>
          </motion.div>
        </div>

        {image2 && description2 && (
          <div className="grid lg:grid-cols-2 gap-14 items-start mt-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-1 bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed">{description2}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={image2} alt={title} className="w-full rounded-lg shadow-lg object-cover h-80" />
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
