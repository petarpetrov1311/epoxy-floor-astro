import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { galleryProjects } from '../src/data/gallery.js';
import { services } from '../src/data/services.js';
import { faqs } from '../src/data/faqs.js';

// Run after the production build. These checks inspect HTML before any JS runs.
const read = path => readFileSync(join('dist', path), 'utf8');
const home = read('index.html');
const islands = [...home.matchAll(/<astro-island\b[^>]*component-url="([^"]+)"/g)].map(match => match[1]);
assert.equal(islands.length, 3, 'Only portfolio, photo slider and quote form should hydrate');
for (const name of ['Portfolio', 'PhotoThumbnailSlider', 'QuoteForm']) {
  assert(islands.some(url => url.includes(name)), `${name} island is missing`);
}
for (const value of ['20', '80\u00a0000', '1200']) {
  const stats = home.match(/<section id="stats"[\s\S]*?<\/section>/)?.[0];
  assert(stats?.includes(value), `Final statistic ${value} must exist before hydration`);
}
for (const project of galleryProjects) assert(home.includes(project.title), `Missing project: ${project.title}`);
assert(home.includes('name="message"'), 'Quote form must be prerendered');
assert(home.includes('alt="Наш проект 1"'), 'Nested photo island must be prerendered');
assert(!home.includes('style="opacity:0'), 'Initial content must not be hidden by animation');
const sectionIds = [...home.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(sectionIds, ['hero', 'stats', 'textures', 'services', 'projects', 'about', 'why-choose-us', 'contact']);
for (const image of ['logo-navbar.png', 'logo-hero-footer.png']) {
  assert(home.includes(image), `Missing original logo: ${image}`);
  assert(readFileSync(join('dist/images/site', image)).length > 0);
}
for (const [slug, service] of Object.entries(services)) {
  const html = read(`nastilki/${slug}/index.html`);
  assert(html.includes(service.description), `Missing original description for ${slug}`);
  assert(html.includes(service.description2), `Missing secondary description for ${slug}`);
  for (const image of service.gallery) assert(html.includes(image), `Missing gallery image for ${slug}`);
  assert(!html.includes('visibility:hidden'), `Gallery hidden before hydration for ${slug}`);
}
for (const faq of faqs) {
  const html = read('blogove/index.html');
  assert(html.includes(faq.question) && html.includes(faq.answer), 'FAQ must render without JavaScript');
}

function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}
let pages = 0;
for (const path of htmlFiles('dist')) {
  const html = readFileSync(path, 'utf8');
  assert(!html.includes('\u0000') && !html.includes('\ufffd'), `Corrupted text in ${path}`);
  assert(!/<astro-island[^>]*component-url="[^"]*(Navbar|Footer|HomePage|ServicePageLayout)/.test(html), `Whole-page/static component hydration in ${path}`);
  assert(!html.includes('style="opacity:0'), `Hidden initial content in ${path}`);
  if (path.includes('blogove') || path.includes('galeria')) {
    assert(!html.includes('<astro-island'), `Unexpected React hydration in ${path}`);
  }
  pages++;
}
console.log(`Static HTML checks passed for ${pages} pages; homepage has three isolated React islands.`);
