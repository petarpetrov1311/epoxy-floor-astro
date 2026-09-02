import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    image: '/images/projects/oborudvane2.jpg',
    title: 'Тераси и плоски покриви',
    description: 'Хидроизолационни и защитни системи за тераси, балкони и плоски покриви с устойчивост на атмосферни влияния.',
    href: '/nastilki/terasi-i-ploski-pokrivi',
  },
  {
    image: '/images/projects/kashta-za-gosti-1.jpg',
    title: 'Двор и открити части',
    description: 'Решения за дворове, алеи и открити площи, устойчиви на външни условия и ежедневно натоварване.',
    href: '/nastilki/dvor-i-otkriti-chasti',
  },
  {
    image: '/images/projects/parking.jpg',
    title: 'Игрища и спортни съоръжения',
    description: 'Настилки за спортни и обществени зони с добро сцепление, безопасност и възможност за маркировки.',
    href: '/nastilki/igrishta-i-sportni-saorazhenia',
  },
  {
    image: '/images/projects/about-us1.jpg',
    title: 'Хранително-вкусова промишленост',
    description: 'Месопреработка, млекопреработка, хлебарство и сладкарство, производство на напитки. Продуктите са в пълно съответствие с изискванията НАССР.',
    href: '/nastilki/hranitelno-vkusova',
  },
  {
    image: '/images/projects/oborudvane1.jpg',
    title: 'Производства и складове',
    description: 'За всякакъв вид производствена и складова дейност. Тежки, индустриални, химично и топлоустойчиви подове за всяка индустрия.',
    href: '/nastilki/proizvodstva-i-skladove',
  },
  {
    image: '/images/projects/parking.jpg',
    title: 'Паркинги и гаражи',
    description: 'Настилките лесно се почистват, не се хлъзгат и са устойчиви на масло и петролни продукти. Полагаме и маркировки в неограничена цветова гама.',
    href: '/nastilki/parking-i-garaji',
  },
  {
    image: '/images/projects/img-3147-1-scaled.jpeg',
    title: 'Мортел',
    description: 'Здрави и износоустойчиви подови системи за обекти с високи изисквания към механична устойчивост.',
    href: '/nastilki/mortel',
  },
  {
    image: '/images/projects/about-us1.jpg',
    title: 'Мандри и кланици',
    description: 'Безфугови и хигиенни настилки за мокри помещения, хранителна среда и интензивно почистване.',
    href: '/nastilki/mandri-i-klanici',
  },
  {
    image: '/images/projects/about-us2.jpg',
    title: 'Декоративни настилки',
    description: 'Подходящи за офиси, магазини, заведения, ресторанти, хотели, аптеки, домове, вили и телевизионни студия. Богата палитра от цветове.',
    href: '/nastilki/dekorativni',
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group"
    >
      <a href={service.href} className="md:hidden flex items-center gap-3 bg-white rounded-lg overflow-hidden shadow-sm border border-border p-3 hover:border-primary/50 transition-all duration-200">
        <img
          src={service.image}
          alt={service.title}
          className="w-20 h-20 object-cover rounded flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{service.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{service.description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
      </a>

      <div className="hidden md:block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-border h-full">
        <div className="relative h-52 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors duration-300" />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {service.description}
          </p>
          <a
            href={service.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
          >
            Повече информация
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-50px' });

  return (
    <section id="services" className="py-10 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 md:mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            ПОДОВИ НАСТИЛКИ С РАЗЛИЧНО ПРЕДНАЗНАЧЕНИЕ
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 md:mb-5" />
          <p className="text-muted-foreground text-sm md:text-lg leading-relaxed hidden md:block">
            EPOXY FLOORS предлага широка гама от подови настилки за различни производства,
            обществени сгради и домове. Продуктите се отличават с високо качество,
            устойчивост и разнообразие от цветове и материали.
          </p>
        </motion.div>

        <div className="md:hidden grid gap-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
