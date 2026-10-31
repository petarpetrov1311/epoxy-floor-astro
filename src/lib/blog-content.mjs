import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { floorRegistry } from './floor-content.mjs';
import { mediaFor, photo } from './floor-media.mjs';

export const blogCategories = { guide: 'Ръководства', comparison: 'Сравнения', case: 'Казуси', maintenance: 'Поддръжка' };
export const dateISO = value => new Date(value).toISOString().slice(0,10);
export const dateLabel = value => new Intl.DateTimeFormat('bg-BG', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
export function blogImage(entry) {
  if (entry.data.heroImage) {
    const image = photo(path.basename(entry.data.heroImage));
    if (image && existsSync('public' + image.src)) return image;
  }
  return (entry.data.related || []).map(id => mediaFor(id).hero).find(image => image && existsSync('public' + image.src)) || null;
}
export const blogEntries = floorRegistry.filter(entry => entry.id.startsWith('blog/')).map(entry => {
  const body = readFileSync(`handoff/content/${entry.id}.md`, 'utf8').replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*/, '');
  for (const field of ['title','seoTitle','description','keyword','pubDate','category']) if (!entry.data[field]) throw new Error(`${entry.id}: missing ${field}`);
  if (!blogCategories[entry.data.category]) throw new Error(`${entry.id}: unknown category`);
  if (Number.isNaN(new Date(entry.data.pubDate).getTime())) throw new Error(`${entry.id}: invalid publication date`);
  return { ...entry, body, image: blogImage(entry), readTime: `${Math.max(1,Math.ceil(body.split(/\s+/u).length / 200))} мин`, category: blogCategories[entry.data.category] };
});
export const publishedBlogEntries = blogEntries.filter(entry => !entry.data.draft && !entry.data.noindex).sort((a,b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
