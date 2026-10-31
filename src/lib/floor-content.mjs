import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'js-yaml';

export const floorRegistry = ['nastilki', 'applications', 'pages', 'blog'].flatMap(collection =>
  readdirSync(`handoff/content/${collection}`).filter(file => file.endsWith('.md') && !file.startsWith('_')).map(file => {
    const raw = readFileSync(`handoff/content/${collection}/${file}`, 'utf8');
    const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    const data = load(match[1]);
    const name = file.replace(/\.md$/, '');
    data.slug ||= name;
    const url = collection === 'pages' ? (data.slug === 'home' ? '/' : `/${data.slug}`)
      : collection === 'blog' ? `/blog/${data.slug}` : `/nastilki/${data.slug}`;
    return { id: `${collection}/${name}`, data, url };
  })
);
export function serviceIdentity(page) {
  const collection = page.type === 'application' ? 'applications' : 'nastilki';
  const entry = floorRegistry.find(entry => entry.id.startsWith(collection + '/') && entry.data.slug === page.slug);
  if (!entry) throw new Error(`Unknown service page: ${page.slug}`);
  return entry;
}
export function floorIdentity(page) {
  const entry = floorRegistry.find(entry => entry.id.startsWith('nastilki/') && entry.data.slug === page.slug);
  if (!entry) throw new Error(`Unknown flooring page: ${page.slug}`);
  return entry;
}
export function floorRelated(ids = []) {
  return ids.map(id => floorRegistry.find(entry => entry.id === id)).filter(entry => entry?.url && !entry.data.noindex && !entry.data.draft);
}

const urls = new Map();
for (const entry of floorRegistry) {
 if (urls.has(entry.url)) throw new Error(`Duplicate content URL ${entry.url}: ${urls.get(entry.url)} and ${entry.id}`);
 urls.set(entry.url, entry.id);
 if (entry.data.type === 'application' && (!entry.data.keyBenefit || !entry.data.serviceType)) throw new Error(`Missing application fields: ${entry.id}`);
 for (const id of entry.data.related || []) if (/^(nastilki|applications|pages|blog)\//.test(id) && !floorRegistry.some(target => target.id === id)) throw new Error(`Unknown related target ${id} on ${entry.id}`);
}
