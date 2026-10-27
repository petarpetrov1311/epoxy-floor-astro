import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact({ children }) {
  return (
    <section id="contact" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Заявете оферта</h2>
            <div className="mx-auto mb-5 h-1 w-16 bg-primary" />
            <p className="mx-auto max-w-xl text-muted-foreground">
              Пишете ни и наш служител ще се свърже с Вас, за да Ви изготви персонална
              оферта, съобразена с Вашите изисквания.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 text-lg font-bold text-foreground">Контакти</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Телефон</p>
                    <a href="tel:+359898512776" className="font-semibold text-foreground transition-colors hover:text-primary">
                      +359 898 512 776
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                    <a href="mailto:epoxy_fl@abv.bg" className="font-semibold text-foreground transition-colors hover:text-primary">
                      epoxy_fl@abv.bg
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Местоположение</p>
                    <p className="font-semibold text-foreground">България</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-52 overflow-hidden rounded-lg border border-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187452.6168660093!2d23.186118850000002!3d42.6976665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8682cb317bf5%3A0x400a01269bf5e60!2sSofia%2C%20Bulgaria!5e0!3m2!1sen!2sus!4v1697558700000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Карта"
              />
            </div>
          </div>

          <div
            className="lg:col-span-2"
          >
            <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-foreground">Заявка за оферта</h3>

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
