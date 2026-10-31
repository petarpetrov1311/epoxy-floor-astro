// Снимки по страници от src/data/media.json (npm run media; правила в ../src/content/media/routing.yaml).
// pageId е колекция/файл, както в pricing.yaml: nastilki/epoksidni, pages/home.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const FILE = path.resolve(process.cwd(), 'handoff/data/media.json');
const MEDIA = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { photos: [], pages: {}, clusters: [] };
const BY_FILE = Object.fromEntries(MEDIA.photos.map((p) => [p.file, p]));

export const photo = (file) => BY_FILE[file] || null;

export const cluster = (id) => (MEDIA.clusters.find((c) => c.id === id)?.files || []).map(photo).filter(Boolean);

/** @returns {{hero: object|null, gallery: object[], note: string|null, confirm: boolean}} */
export function mediaFor(pageId) {
  const m = MEDIA.pages[pageId];
  if (!m) return { hero: null, gallery: [], note: null, confirm: false };
  return { hero: photo(m.hero), gallery: m.gallery.map(photo).filter(Boolean), note: m.note, confirm: !!m.confirm };
}
