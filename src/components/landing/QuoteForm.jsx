import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  website: ''
};

export default function QuoteForm() {
  const [form, setForm] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  return (<>
{submitted ? (
    <div

      className="flex flex-col items-center justify-center py-16"
    >
      <CheckCircle className="mb-4 h-16 w-16 text-primary" />
      <h4 className="mb-2 text-xl font-bold text-foreground">Заявката е изпратена!</h4>
      <p className="text-center text-muted-foreground">
        Наш представител ще се свърже с Вас скоро.
      </p>
    </div>
  ) : (
    <form action="/api/quote" method="post" onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <noscript>За изпращане на заявката включете JavaScript или се свържете с нас на +359 898 512 776.</noscript>
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
        <label htmlFor="quote-name" className="mb-1.5 block text-sm font-medium text-foreground">
          Име, Фамилия <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="quote-name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
          placeholder="Иван Иванов"
        />
      </div>

      <div>
        <label htmlFor="quote-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="quote-email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
          placeholder="ivan@company.bg"
        />
      </div>

      <div>
        <label htmlFor="quote-phone" className="mb-1.5 block text-sm font-medium text-foreground">
          Телефон <span className="text-primary">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          id="quote-phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
          placeholder="+359 888 123 456"
        />
      </div>

      <div>
        <label htmlFor="quote-company" className="mb-1.5 block text-sm font-medium text-foreground">Дружество</label>
        <input
          type="text"
          name="company"
          id="quote-company"
          value={form.company}
          onChange={handleChange}
          className="w-full rounded border border-border px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
          placeholder="Фирма ООД"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="quote-message" className="mb-1.5 block text-sm font-medium text-foreground">
          Опишете Вашия обект <span className="text-primary">*</span>
        </label>
        <textarea
          name="message"
          id="quote-message"
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
          <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
</>);
}
