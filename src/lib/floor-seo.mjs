// SEO слой v2: meta + JSON-LD (@graph) + проверки.
// Източници: src/content/seo/site.yaml (глобални данни) и frontmatter на всяка страница
// (seoTitle, description, keyword, keywords, related) — попълнени от scripts/seo-map.mjs.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { PRICING, PRICES_CONFIRMED, pricesFor, priceSpec, priceSentence } from './floor-pricing.mjs';
import { mediaFor, photo } from './floor-media.mjs';

const SEO_DIR = path.resolve(process.cwd(), 'handoff/data');
export const SITE_CFG = load(readFileSync(path.join(SEO_DIR, 'site.yaml'), 'utf8'));
export const REDIRECTS = load(readFileSync(path.join(SEO_DIR, 'redirects.yaml'), 'utf8')).redirects;
// Домейнът не е твърдо зададен: SITE_URL при билда (staging, друг хост) → иначе `site` от site.yaml (продукция).
export const SITE = String(process.env.SITE_URL || SITE_CFG.site).replace(/\/$/, '');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const inPublic = (src) => !!src && existsSync(path.join(PUBLIC_DIR, src));
const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

const clean = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === null || (Array.isArray(v) && !v.length) ? undefined : v)));

export function orgNode() {
  const o = SITE_CFG.organization;
  return clean({
    '@type': o.type, '@id': ORG_ID, name: o.name, alternateName: o.alternateName, slogan: o.slogan,
    description: o.description, url: SITE, logo: inPublic(o.logo) ? SITE + o.logo : null, image: inPublic(o.image) ? SITE + o.image : null, telephone: o.telephone, email: o.email,
    foundingDate: o.foundingDate, openingHours: o.openingHours, sameAs: o.sameAs,
    address: { '@type': 'PostalAddress', ...o.address },
    geo: o.geo, areaServed: { '@type': 'Country', name: o.areaServed }, knowsAbout: o.knowsAbout,
  });
}
const websiteNode = () => ({ '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE_CFG.brand, url: SITE, inLanguage: 'bg-BG', publisher: { '@id': ORG_ID } });

// price: true → цената пред отговора; в schema само при потвърдени цени (както Offer)
const faqNode = (faqs, pageId) => faqs?.length ? {
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => {
    const price = f.price && PRICES_CONFIRMED ? priceSentence(pageId) : null;
    return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: price ? `${price} ${f.a}` : f.a } };
  }),
} : null;

const crumbNode = (url, items) => ({
  '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + item })),
});

const short = (t) => String(t).split(' | ')[0];

/**
 * og:image — снимка за споделяне. Източник (първият съществуващ файл в public/):
 * ogImage във frontmatter (ръчен избор, клиентът може да го смени) → hero от media.json → първата снимка от галерията
 * → при блог: hero на първата свързана страница (related) → ogImage по подразбиране от site.yaml.
 * scripts/build-og.mjs прави от източника JPG 1200×630 в public/og/<key>.jpg; ако го няма — ползва се източникът.
 */
export function ogFor(kind, d, urlPath, pageId, hero) {
  const key = urlPath === '/' ? 'home' : urlPath.replace(/^\//, '').replace(/\//g, '-');
  const m = pageId ? mediaFor(pageId) : { gallery: [] };
  const rel = kind === 'blog' ? (d.related || []).map((id) => mediaFor(id).hero).find(Boolean) : null;
  // от галерията — първата снимка, която не е детайл/текстура (те не стават за превю)
  const pick = m.gallery.find((p) => !/tekstura|detayl/.test(p.file)) || m.gallery[0];
  const cands = [d.ogImage && { src: d.ogImage, alt: d.ogImageAlt || photo(path.basename(d.ogImage))?.alt }, hero, pick, rel, { src: SITE_CFG.ogImage, alt: null }];
  const source = cands.find((c) => c && inPublic(c.src)) || null;
  const file = `/og/${key}.jpg`;
  const generated = inPublic(file);
  return {
    key, source: source?.src || null, file,
    image: generated ? file : source?.src || null, generated,
    width: generated ? 1200 : source?.w, height: generated ? 630 : source?.h,
    alt: source?.alt || short(d.seoTitle || d.title || SITE_CFG.brand),
  };
}

/**
 * @param {'home'|'nastilka'|'application'|'page'|'blog'|'project'|'hub'} kind
 * @param {object} d frontmatter
 * @param {string} urlPath напр. /nastilki/epoksidni-nastilki
 * @param {{body?: string, all?: any[]}} ctx тялото на страницата и всички страници (за канибализация)
 */
export function buildSeo(kind, d, urlPath, ctx = {}) {
  const url = SITE + (urlPath === '/' ? '/' : urlPath);
  const title = d.seoTitle || d.title;
  const h1 = d.title;
  const pageType = d.slug === 'za-nas' ? 'AboutPage' : kind === 'hub' ? 'CollectionPage' : 'WebPage';
  const graph = [orgNode(), websiteNode()];
  // hero от media.json има предимство пред пътищата във frontmatter (те още не съществуват)
  const hero = kind === 'project' ? d._project.hero : ctx.hero || mediaFor(ctx.pageId).hero;

  let crumbs = [['Начало', '/']];
  if (kind === 'nastilka' || kind === 'application') crumbs.push(['Настилки', '/nastilki'], [short(h1), urlPath]);
  else if (kind === 'blog') crumbs.push(['Блог', '/blog'], [short(h1), urlPath]);
  else if (kind === 'project') crumbs.push(['Проекти', '/proekti'], [short(h1 || 'Казус'), urlPath]);
  else if (kind !== 'home') crumbs.push([short(h1), urlPath]);

  graph.push(clean({
    '@type': pageType, '@id': `${url}#webpage`, url, name: title, description: d.description, inLanguage: 'bg-BG',
    isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORG_ID },
    breadcrumb: kind === 'home' ? null : { '@id': `${url}#breadcrumb` },
    primaryImageOfPage: hero ? { '@type': 'ImageObject', url: SITE + hero.src, width: hero.w, height: hero.h, caption: hero.alt } : null,
  }));
  if (kind !== 'home') graph.push(crumbNode(url, crumbs));

  // Цените влизат в schema само при status: confirmed в pricing.yaml
  const prices = PRICES_CONFIRMED ? pricesFor(ctx.pageId) : [];
  const offers = prices.length ? { '@type': 'Offer', priceCurrency: PRICING.currency, priceSpecification: prices.map(priceSpec), seller: { '@id': ORG_ID } } : null;
  if (kind === 'nastilka' || kind === 'application') {
    graph.push(clean({
      '@type': 'Service', '@id': `${url}#service`, name: short(h1), description: d.description, url,
      serviceType: d.serviceType || d.keyword, provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: SITE_CFG.organization.areaServed },
      mainEntityOfPage: { '@id': `${url}#webpage` }, offers,
    }));
  }
  if (kind === 'page' && d.schemaType === 'Service' && prices.length) {
    graph.push(clean({
      '@type': 'Service', '@id': `${url}#service`, name: short(h1), url, provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: SITE_CFG.organization.areaServed },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Ориентировъчни цени', itemListElement: prices.map((p) => ({
        '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.name }, priceCurrency: PRICING.currency, priceSpecification: priceSpec(p),
      })) },
    }));
  }
  const og = ogFor(kind, d, urlPath, ctx.pageId, hero);
  if (kind === 'blog') {
    graph.push(clean({
      '@type': 'BlogPosting', '@id': `${url}#article`, headline: h1, description: d.description, url,
      datePublished: d.pubDate ? new Date(d.pubDate).toISOString().slice(0, 10) : null,
      dateModified: (d.updatedDate || d.pubDate) ? new Date(d.updatedDate || d.pubDate).toISOString().slice(0, 10) : null,
      author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID }, inLanguage: 'bg-BG',
      image: og.image ? SITE + og.image : null, keywords: [d.keyword, ...(d.tags || [])].filter(Boolean).join(', '),
      mainEntityOfPage: { '@id': `${url}#webpage` },
    }));
  }
  if (kind === 'project') {
    // Казус = Article за конкретен обект; about → Service на системата (същия @id като на страницата ѝ)
    const x = d._project;
    graph.push(clean({
      '@type': 'Article', '@id': `${url}#article`, headline: h1, description: d.description, url, inLanguage: 'bg-BG',
      author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID },
      // datePublished = публикуването на казуса (pubDate), не годината на обекта; годината → temporalCoverage
      datePublished: d.pubDate ? new Date(d.pubDate).toISOString().slice(0, 10) : null,
      temporalCoverage: d.godina ? String(d.godina) : null,
      image: x.photos.map((p) => ({ '@type': 'ImageObject', url: SITE + p.src, width: p.w, height: p.h, caption: p.alt })),
      about: x.sys.map((s) => ({ '@id': `${SITE}${s.url}#service` })),
      contentLocation: d.grad ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: d.grad, addressCountry: 'BG' } } : null,
      mainEntityOfPage: { '@id': `${url}#webpage` },
    }));
  }
  graph.push(faqNode(d.faqs, ctx.pageId));

  const seo = {
    title, h1, description: d.description || '', url, canonical: url,
    robots: d.noindex ? 'noindex, follow' : 'index, follow',
    keyword: d.keyword, keywords: d.keywords || [],
    og: { title, description: d.description || '', image: og.image, imageWidth: og.width, imageHeight: og.height, imageAlt: og.alt, imageSource: og.source, imageGenerated: og.generated, key: og.key, type: kind === 'blog' ? 'article' : 'website', locale: SITE_CFG.locale, site_name: SITE_CFG.brand },
    ld: [{ '@context': 'https://schema.org', '@graph': graph.filter(Boolean) }],
    sources: { title: d.seoTitle ? 'frontmatter seoTitle (SEO карта v2)' : 'frontmatter title' },
  };
  return seo;
}


