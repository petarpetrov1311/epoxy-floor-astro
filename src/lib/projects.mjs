import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { floorRegistry } from './floor-content.mjs';

const directory = path.resolve('handoff/content/proekti');
const byId = new Map(floorRegistry.map((entry) => [entry.id, entry]));

const files = readdirSync(directory).filter((file) => file.endsWith('.md') && !file.startsWith('_'));
export const projects = files.map((file) => {
  const source = readFileSync(path.join(directory, file), 'utf8');
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Missing frontmatter in proekti/${file}`);
  const data = load(match[1]);
  const id = `proekti/${file.replace(/\.md$/, '')}`;
  const systems = (data.sistemi || []).map((reference) => {
    const entry = byId.get(reference);
    if (!entry) throw new Error(`${id}: unknown system ${reference}`);
    return { ...entry, label: entry.data.title, href: entry.url };
  });
  const applicationEntry = data.prilozhenie ? byId.get(data.prilozhenie) : null;
  if (data.prilozhenie && !applicationEntry) throw new Error(`${id}: unknown application ${data.prilozhenie}`);
  const photos = data.snimki || [];
  const hero = data.hero ? photos.find((photo) => photo.src === data.hero) : photos.find((photo) => photo.w >= photo.h);
  if (!hero) throw new Error(`${id}: no usable hero image`);
  for (const photo of photos) {
    if (!photo.src.startsWith('/media/proekti/')) throw new Error(`${id}: image must be in /media/proekti/: ${photo.src}`);
  }
  const systemNames = systems.map((entry) => {
    if (entry.id === 'nastilki/epoksidni') return 'Епоксидна настилка';
    if (entry.id === 'nastilki/mortel') return 'Мортелна настилка';
    if (entry.id === 'nastilki/pu-tsiment') return 'Полиуретан-циментова настилка';
    const system = entry.data;
    return system.title;
  });
  const systemLabel = systems.map((system) => system.data.keyword || system.label).join(' и ');
  const displaySystem = systemNames.join(' и ');
  const objectName = data.obekt || 'Обект';
  const title = data.title || `${displaySystem} в ${objectName}${data.grad ? ` — ${data.grad}` : ''}`;
  const titleCandidate = `${displaySystem} в ${objectName}${data.grad ? `, ${data.grad}` : ''}`;
  const seoTitle = data.seoTitle || (titleCandidate.length <= 44 ? `${titleCandidate} | EPOXY FLOORS` : titleCandidate);
  const firstResult = data.rezultat?.split(/(?<=[.!?])\s/u)[0] || '';
  const factsSentence = `${objectName.charAt(0).toLocaleUpperCase('bg-BG')}${objectName.slice(1)}${data.grad ? ` в ${data.grad}` : ''}: ${displaySystem.toLocaleLowerCase('bg-BG')}${data.plosht != null ? `, ${data.plosht} кв.м` : ''}${data.srok != null ? ` за ${data.srok} работни дни` : ''}.`;
  const description = data.description || [factsSentence, firstResult].filter(Boolean).join(' ');
  const keyword = data.keyword || `${systemLabel.toLocaleLowerCase('bg-BG')} ${objectName}`;
  const entry = {
    id,
    url: `/proekti/${data.slug}`,
    data: {
      ...data,
      title,
      seoTitle,
      description,
      keyword,
      _project: { hero, photos, sys: systems },
    },
    systems,
    application: applicationEntry ? { label: applicationEntry.data.title, href: applicationEntry.url } : null,
    hero,
  };
  return entry;
});

export const publishedProjects = projects.filter(({ data }) => !data.draft);
export const projectRedirects = projects.filter(({ data }) => data.oldUrl).map(({ data, url }) => ({ source: data.oldUrl, destination: url, statusCode: 301 }));
