import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { floorRegistry, floorRelated } from '../src/lib/floor-content.mjs';
import { mediaFor } from '../src/lib/floor-media.mjs';
import { SITE } from '../src/lib/floor-seo.mjs';
import { PRICES_CONFIRMED } from '../src/lib/floor-pricing.mjs';

const html = url => readFileSync(`dist${url}/index.html`, 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const entry of floorRegistry.filter(entry => entry.id.startsWith('nastilki/'))) {
 const document = html(entry.url);
 const media = mediaFor(entry.id);
 assert(!document.includes('<astro-island'), `${entry.id}: no client rendering`);
 assert(document.includes(`rel="canonical" href="${SITE}${entry.url}"`), `${entry.id}: canonical uses Markdown slug`);
 const json = document.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
 assert(json, `${entry.id}: structured data is present`);
 const nodes = JSON.parse(json[1])['@graph'];
 const faq = nodes.find(node => node['@type'] === 'FAQPage');
 assert.equal(faq?.mainEntity.length || 0, entry.data.faqs?.length || 0);
 assert(nodes.some(node => node['@type'] === 'Service'));
 if (!PRICES_CONFIRMED) assert(!document.includes('Ориентировъчни цени') && !nodes.some(node => node.offers), `${entry.id}: pending prices stay private`);
 for (const answer of entry.data.faqs || []) assert(document.includes(escape(answer.a)), `${entry.id}: complete FAQ answer`);
 const header = document.match(/<header class="floor-hero"[\s\S]*?<\/header>/)[0];
 assert.equal(header.includes('<img'), !!media.hero, `${entry.id}: hero is optional and uses assigned media`);
 if (media.hero) assert(header.includes(media.hero.src) && header.includes(escape(media.hero.alt)));
 assert.equal(document.includes('id="galeria"'), media.gallery.length > 0, `${entry.id}: gallery is conditional`);
 for (const photo of media.gallery) {
  assert(document.includes(photo.src) && document.includes(photo.thumb), `${entry.id}: assigned gallery photo`);
  assert(document.includes(escape(photo.alt)), `${entry.id}: gallery alt text`);
  assert(existsSync('public' + photo.src) && existsSync('public' + photo.thumb));
 }
 const related = floorRelated(entry.data.related);
 for (const link of related) {
  assert(document.includes(`href="${link.url}"`), `${entry.id}: related link ${link.id}`);
  assert(existsSync(`dist${link.url}/index.html`), `${entry.id}: related target exists`);
 }
 assert(document.includes(`href="/kontakti?sistema=${entry.id.split('/')[1]}#forma"`));
 assert(document.includes('href="tel:+359898512776"'));
 const og = document.match(/property="og:image" content="([^"]+)"/);
 assert(og && document.includes('property="og:image:width" content="1200"'));
 assert(existsSync('public' + new URL(og[1]).pathname));
 if (entry.id === 'nastilki/dekorativni') {
  const toc = document.match(/<nav aria-label="На тази страница"[\s\S]*?<\/nav>/)[0];
  for (const title of ['Металик епокси', 'Каменен килим', 'Епокси в различни']) assert(toc.includes(title));
 }
}
console.log('Floor template checks passed: assigned media, related targets, FAQs, metadata, pending prices and no hydration.');
