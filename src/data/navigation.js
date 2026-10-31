// System labels and order come directly from the supplied Markdown.
const documents = import.meta.glob('../../handoff/content/nastilki/*.md', { eager: true });
export const systemLinks = Object.values(documents)
  .sort((a, b) => a.frontmatter.navOrder - b.frontmatter.navOrder)
  .map(({ frontmatter }) => ({ label: frontmatter.navLabel || frontmatter.title, href: `/nastilki/${frontmatter.slug}` }));
const applicationDocuments = import.meta.glob('../../handoff/content/applications/*.md', { eager: true });
export const applicationLinks = Object.values(applicationDocuments)
  .sort((a, b) => (a.frontmatter.navLabel || a.frontmatter.title).localeCompare(b.frontmatter.navLabel || b.frontmatter.title, 'bg'))
  .map(({ frontmatter }) => ({ label: frontmatter.navLabel || frontmatter.title, href: `/nastilki/${frontmatter.slug}` }));
export const serviceLinks = [...systemLinks, ...applicationLinks];
export const usefulLinks = [
  { label: 'Всички статии', href: '/blog' },
  { label: 'Сравнения', href: '/sravneniya' },
  { label: 'Технология и материали', href: '/tehnologia-i-materiali' },
];
