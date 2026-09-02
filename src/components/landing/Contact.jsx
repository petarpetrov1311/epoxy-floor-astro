import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  website: ''
};

export default function Contact() {
  const [form, setForm] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Unable to send the quote request right now.');
      }

      setSubmitted(true);
      setForm(initialFormState);
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      setSubmitError(error.message || 'Unable to send the quote request right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={ref} className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Заявете оферта</h2>
            <div className="mx-auto mb-5 h-1 w-16 bg-primary" />
            <p className="mx-auto max-w-xl text-muted-foreground">
              Пишете ни и наш служител ще се свърже с Вас, за да Ви изготви персонална
              оферта, съобразена с Вашите изисквания.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-foreground">Заявка за оферта</h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <CheckCircle className="mb-4 h-16 w-16 text-primary" />
                  <h4 className="mb-2 text-xl font-bold text-foreground">Заявката е изпратена!</h4>
                  <p className="text-center text-muted-foreground">
                    Наш представител ще се свърже с Вас скоро.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                  <div className="hidden">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      autoComplete="off"
                      tabIndex="-1"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Име, Фамилия <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
                      placeholder="ivan@company.bg"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Телефон <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
                      placeholder="+359 888 123 456"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Дружество</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
                      placeholder="Фирма ООД"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Опишете Вашия обект <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full resize-none rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
                      placeholder="Площ, местоположение, вид на обекта..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    {submitError && (
                      <p className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded bg-primary py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          Изпрати заявка
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
