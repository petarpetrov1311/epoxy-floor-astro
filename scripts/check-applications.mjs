import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { floorRegistry, floorRelated } from '../src/lib/floor-content.mjs';
import { mediaFor } from '../src/lib/floor-media.mjs';
import { SITE } from '../src/lib/floor-seo.mjs';
import { PRICES_CONFIRMED } from '../src/lib/floor-pricing.mjs';
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const home = readFileSync('dist/index.html','utf8');
const applications = floorRegistry.filter(entry => entry.data.type === 'application');
assert.equal(applications.length, 8);
for (const entry of applications) {
 const html = readFileSync(`dist${entry.url}/index.html`,'utf8');
 const media = mediaFor(entry.id);
 const body = readFileSync(`handoff/content/${entry.id}.md`,'utf8').split(/^---\s*$/m).slice(2).join('');
 assert(!html.includes('<astro-island'), `${entry.id}: content must not hydrate React`);
 assert.equal((html.match(/<h1\b/g)||[]).length, 1);
 assert(html.includes(escape(entry.data.keyBenefit)), `${entry.id}: authored benefit`);
 assert(!html.includes('class="floor-features"') && !html.includes('class="floor-applications"'), `${entry.id}: no invented system fields`);
 for(const [,heading] of body.matchAll(/^#{2,3} (.+)$/gm)) assert(html.includes(escape(heading.trim())), `${entry.id}: missing Markdown heading`);
 for(const faq of entry.data.faqs || []) assert(html.includes(escape(faq.q)) && html.includes(escape(faq.a)), `${entry.id}: missing FAQ text`);
 assert.equal((html.match(/<details class="home-faq"/g)||[]).length, entry.data.faqs?.length || 0);
 assert(html.includes(`href="/kontakti?prilozhenie=${entry.id.split('/')[1]}#forma"`));
 assert(html.includes(`rel="canonical" href="${SITE}${entry.url}"`));
 assert(home.includes(`href="${entry.url}"`), `${entry.id}: homepage navbar link`);
 const header = html.match(/<header class="floor-hero"[\s\S]*?<\/header>/)[0];
 assert.equal(header.includes('<img'), !!media.hero);
 if(media.hero) assert(header.includes(media.hero.src));
 assert.equal(media.gallery.length, 8);
 for(const photo of media.gallery) {
  assert(html.includes(photo.src) && html.includes(photo.thumb) && html.includes(escape(photo.alt)));
  assert(existsSync('public'+photo.src) && existsSync('public'+photo.thumb));
 }
 const related = floorRelated(entry.data.related);
 assert.equal(html.includes('id="related"'), related.length > 0);
 for(const target of related) assert(html.includes(`href="${target.url}"`) && existsSync(`dist${target.url}/index.html`));
 const nodes = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.equal(nodes.find(node => node['@type'] === 'Service').serviceType, entry.data.serviceType);
 assert.equal(nodes.find(node => node['@type'] === 'FAQPage').mainEntity.length, entry.data.faqs.length);
 if(!PRICES_CONFIRMED) assert(!nodes.some(node => node.offers) && !html.includes('Ориентировъчни цени'));
 if(entry.id === 'applications/igrishta') assert(!html.includes('aria-label="На тази страница"'));
 if(entry.id === 'applications/proizvodstva-i-skladove') assert(html.includes('aria-label="На тази страница"'));
}
const redirects = JSON.parse(readFileSync('vercel.json','utf8')).redirects;
for(const [source,destination] of Object.entries({'terasi-i-hidroizolacii':'terasi-i-ploski-pokrivi','parking-i-garaji':'parkingi-i-garazhi','mandri-i-klanici':'mandri-i-klanitsi','igrishta-i-sportni-saorazhenia':'igrishta-i-sportni-saorazheniya'})) {
 assert(redirects.some(rule => rule.source === '/nastilki/'+source && rule.destination === '/nastilki/'+destination && rule.statusCode === 301));
 assert(!existsSync(`dist/nastilki/${source}/index.html`), 'Redirected legacy URL must not publish duplicate content');
}
const contact = readFileSync('dist/kontakti/index.html','utf8');
assert(contact.includes('name="prilozhenie"'));
for(const app of applications) assert(contact.includes(`value="${app.id.split('/')[1]}"`));
console.log('Application checks passed for all 8 pages: content, benefits, gallery, FAQ, related links, schema, navigation and 301 configuration.');
