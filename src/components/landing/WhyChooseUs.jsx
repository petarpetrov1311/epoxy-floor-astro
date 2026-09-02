import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Droplets, Zap, Palette, Star, Clock } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: 'Устойчивост на интензивно използване',
    text: 'Подовите настилки са предназначени за интензивно натоварване и са устойчиви на механично въздействие, износване и удари.',
  },
  {
    icon: Droplets,
    title: 'Лесно почистване',
    text: 'Структурата на материалите позволява да се използва вода и силни препарати за по-бързо и лесно почистване.',
  },
  {
    icon: Zap,
    title: 'Устойчиви на химикали',
    text: 'Настилките са устойчиви на агресивни почистващи средства и позволяват миене с водоструйки и пароструйки.',
  },
  {
    icon: Star,
    title: 'Антиплъзгащ ефект',
    text: 'Покритията предотвратяват хлъзгането и осигуряват стабилно преминаване и намаляване на травматизма.',
  },
  {
    icon: Palette,
    title: 'Богат избор на цветове',
    text: 'Предоставяме богат избор на цветове. Материалите позволяват използването на няколко цвята в сложни форми и надписи.',
  },
  {
    icon: Clock,
    title: 'Гаранция 5–10 години',
    text: 'Висококачествените немски материали и тяхното правилно полагане дават основание да предлагаме гаранционен период 5–10 години.',
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-choose-us" className="py-10 md:py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Защо EPOXY Floors?</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 md:mb-5" />
          <p className="text-white/70 max-w-xl mx-auto text-sm md:text-lg">
            Нашето мото: <em className="text-primary font-semibold">„ДА СТЪПВАШ СТАБИЛНО"</em>
          </p>
        </motion.div>

        {/* Mobile: compact list */}
        <div className="flex flex-col gap-3 md:hidden">
          {reasons.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-semibold text-sm">{item.title}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: full cards */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-7 bg-white/5 border border-white/10 rounded-lg hover:border-primary/50 hover:bg-white/8 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-white font-bold mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
