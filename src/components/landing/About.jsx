import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import PhotoThumbnailSlider from './PhotoThumbnailSlider';

const benefits = [
  'Кратки срокове на изпълнение',
  'Качествени настилки с висока гаранция',
  'Най-икономичната подова система за конкретния обект',
  'Безплатни консултации на всички етапи',
  'Поддръжка и бърз сервиз',
];

const sliderImages = [
  '/images/projects/about-us1.jpg',
  '/images/projects/about-us2.jpg',
  '/images/projects/oborudvane1.jpg',
  '/images/projects/oborudvane2.jpg',
  '/images/projects/parking.jpg',
  '/images/projects/img-3147-1-scaled.jpeg',
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-10 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="hidden md:block"
          >
            <div className="relative">
              <img
                src="/images/projects/about-us2.jpg"
                alt="Нашият екип"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-4 w-48 shadow-xl rounded-lg overflow-hidden border-4 border-white bg-white p-4">
                <img
                  src="/images/site/logo-navbar.png"
                  alt="Epoxy Floors Logo"
                  className="w-full h-28 object-contain"
                />
              </div>
            </div>
            <div className="pt-10">
              <PhotoThumbnailSlider images={sliderImages} altPrefix="Наш проект" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:pt-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Кои сме ние?</h2>
            <div className="w-14 h-1 bg-primary mb-6" />

            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Epoxy floors са иноваторите</strong> на пазара на индустриални и декоративни подови настилки. Стотиците хиляди квадратни метри, положени в различните сектори на индустрията и бита, са нашата визитна картичка.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              С опитен екип, мощна екипировка, нови технологии и ново мислене сме готови да помогнем във Вашите нови проекти. Залагаме на висококачествени материали от <strong className="text-foreground">Германия и Холандия</strong>, които гарантират висока степен на устойчивост и естетичен вид.
            </p>

            <h3 className="font-bold text-foreground mb-4">Какво ще получите от нас:</h3>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-block bg-primary text-white px-8 py-3.5 font-semibold rounded hover:bg-primary/90 transition-all duration-200"
            >
              Свържете се с нас
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
