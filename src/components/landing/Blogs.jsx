import React from 'react';
import { ArrowRight, ChevronDown, Clock, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { blogPosts } from '../../data/blogs';
import { faqs } from '../../data/faqs';

export default function Blogs() {
  return (<>
  <section className="bg-navy pt-16 pb-14 md:pt-24 md:pb-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div
        className="max-w-3xl"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-primary">
          <MessageCircleQuestion className="h-4 w-4" />
          Полезна информация
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Често задавани въпроси
        </h1>
        <p className="mt-5 max-w-2xl text-white/70 leading-relaxed">
          Кратки и практични отговори за епоксидни настилки, поддръжка, срокове и избор на подходяща система.
        </p>
      </div>
    </div>
  </section>

  <section className="py-12 md:py-20">
    <div className="max-w-5xl mx-auto px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Блогове и съвети</h2>
          <p className="text-sm text-muted-foreground">Отворете въпрос, за да видите подробния отговор.</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={faq.question} name="floor-faq" open={index === 0} className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm open:border-primary/60 open:shadow-lg">
            <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left md:px-6 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary group-open:bg-primary group-open:text-white">{index + 1}</span>
                <span className="text-base font-bold text-foreground md:text-lg">{faq.question}</span>
              </span>
              <ChevronDown className="h-5 w-5 flex-shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border/70 px-5 pb-5 pt-4 md:px-6"><p className="pl-12 text-sm leading-relaxed text-muted-foreground md:text-base">{faq.answer}</p></div>
          </details>
        ))}
      </div>
    </div>
  </section>

  <section className="bg-muted/30 py-12 md:py-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div
        className="mb-8 max-w-3xl md:mb-12"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-foreground">Блог статии</h2>
        <div className="mt-4 h-1 w-16 bg-primary" />
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Практични теми за избор, изпълнение и поддръжка на подови настилки.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <article
            key={post.slug}
            className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <a href={post.url} className="block h-full">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm">
                  {post.category}
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {post.readTime} четене
                </div>
                <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                  Прочети повече
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>

  </>);
}
