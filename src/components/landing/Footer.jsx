import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { existsSync } from 'node:fs';
import { serviceLinks } from '../../data/navigation';


const navLinks = [
  { label: 'Начало', href: '/#hero' },
  { label: 'Настилки', href: '/nastilki' },
  { label: 'За нас', href: '/za-nas' },
  { label: 'Блог', href: '/blog' },
  { label: 'Проекти', href: '/proekti' },
  { label: 'Цени', href: '/tsena-nastilki' },
  { label: 'Сравнения', href: '/sravneniya' },
  { label: 'Технология и материали', href: '/tehnologia-i-materiali' },
  { label: 'Контакти', href: '/kontakti' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            {existsSync('public/images/site/logo-hero-footer.png') ? <img
              src="/images/site/logo-hero-footer.png"
              alt="Epoxy Floors"
              className="h-14 w-auto object-contain mb-5"
            /> : <div className="text-xl font-bold mb-5">EPOXY FLOORS</div>}
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Иноваторите на пазара на индустриални и декоративни подови настилки. 
              Висококачествени материали от Германия и Холандия. Гаранция 5 години по договор.
            </p>
            <div className="space-y-2">
              <a href="tel:+359898512776" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +359 898 512 776
              </a>
              <a href="mailto:epoxy_fl@abv.bg" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                epoxy_fl@abv.bg
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-5 text-white">Настилки</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-5 text-white">Навигация</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EPOXY FLOORS. Всички права запазени.
          </p>
          <p className="text-xs text-white/40">
            Индустриални и декоративни подови настилки
          </p>
        </div>
      </div>
    </footer>
  );
}

