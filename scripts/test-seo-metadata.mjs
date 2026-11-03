import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { load } from 'js-yaml';
import { publishedProjects } from '../src/lib/projects.mjs';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'handoff', 'content');
const SITE_CFG = load(readFileSync(path.join(ROOT, 'handoff', 'data', 'site.yaml'), 'utf8'));
const SITE = String(process.env.SITE_URL || SITE_CFG.site).replace(/\/$/, '');
const failures = [];
const pages = [];
const startedAt = new Date();
const timerStart = performance.now();

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : [];
  });
}

function readFrontmatter(file) {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path.relative(ROOT, file)}: missing YAML frontmatter`);
  return load(match[1]) || {};
}

function decode(value) {
  const names = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, key) => {
    if (key[0] === '#') {
      const number = key[1].toLowerCase() === 'x' ? Number.parseInt(key.slice(2), 16) : Number.parseInt(key.slice(1), 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
    }
    return names[key.toLowerCase()] ?? entity;
  });
}

// Parse start tags and quoted/unquoted attributes from the built document.
function parseHtml(html) {
  const tags = [];
  for (const match of html.matchAll(/<(title|meta|link)\b([^>]*)>/gi)) {
    const [, name, raw] = match;
    const attrs = {};
    for (const attr of raw.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const content = name.toLowerCase() === 'title'
      ? decode(html.slice(match.index + match[0].length, html.indexOf('</title>', match.index)).replace(/<[^>]*>/g, '').trim())
      : attrs.content || '';
    tags.push({ name: name.toLowerCase(), attrs, content });
  }
  return tags;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, SITE);
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.href;
  } catch { return value; }
}

function htmlPath(route) {
  return route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

function addPage(file, data, route, kind, legacy = false) {
  pages.push({ file, data, route, kind, legacy });
}

// Active content collections: route rules mirror getStaticPaths() and floorRegistry.
for (const collection of ['pages', 'nastilki', 'applications', 'blog']) {
  for (const file of markdownFiles(path.join(CONTENT, collection))) {
    if (path.basename(file).startsWith('_')) continue; // Documented in exclusions above; not published entries.
    const data = readFrontmatter(file);
    if (collection === 'blog' && data.draft) continue; // getStaticPaths explicitly excludes drafts.
    const slug = data.slug || path.basename(file, '.md');
    const route = collection === 'pages'
      ? (slug === 'home' ? '/' : `/${slug}`)
      : collection === 'blog' ? `/blog/${slug}` : `/nastilki/${slug}`;
    addPage(file, data, route, collection);
  }
}
for (const project of publishedProjects) {
  const file = path.join(CONTENT, project.id + '.md');
  addPage(file, project.data, project.url, 'project');
}

// Retained Markdown routes use BlogLayout's title/description fallback and have no buildSeo metadata.
for (const file of markdownFiles(path.join(ROOT, 'src', 'pages', 'blogove'))) {
  const data = readFrontmatter(file);
  addPage(file, data, `/blogove/${path.basename(file, '.md')}`, 'legacy-blog', true);
}

const optional = value => value !== undefined && value !== null && String(value).trim() !== '';
const specs = (page) => {
  const { data, route, kind, legacy } = page;
  const description = data.description || (legacy ? data.excerpt : undefined);
  const title = data.seoTitle || data.title || data.seo?.title;
  const list = [
    { key: 'Title', selector: tag => tag.name === 'title', expected: title, unique: true },
    { key: 'Description', selector: tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === 'description', expected: description, unique: true },
  ];
  // SEO buildSeo() is intentionally attached to article and service templates only.
  if (['blog', 'nastilki', 'applications', 'project'].includes(kind)) {
    const canonical = `${SITE}${route === '/' ? '/' : route}`;
    const key = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
    const generated = `/og/${key}.jpg`;
    const configuredImage = data.ogImage;
    const configuredImageExists = configuredImage && existsSync(path.join(ROOT, 'public', configuredImage.replace(/^\//, '')));
    const fallbackImage = SITE_CFG.ogImage;
    const expectedImage = kind === 'project'
      ? new URL(data._project.hero.src, canonical).href
      : existsSync(path.join(DIST, generated.slice(1)))
      ? new URL(generated, canonical).href
      : configuredImageExists ? new URL(configuredImage, canonical).href
        : new URL(fallbackImage, canonical).href;
    const robots = data.noindex ? 'noindex, follow' : 'index, follow';
    list.push(
      { key: 'Canonical', selector: tag => tag.name === 'link' && tag.attrs.rel?.toLowerCase() === 'canonical', expected: canonical, url: true, absolute: true, unique: true },
      { key: 'Robots', selector: tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === 'robots', expected: robots, unique: true },
      { key: 'OG Title', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:title', expected: title, unique: true },
      { key: 'OG Description', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:description', expected: description, unique: true },
      { key: 'OG Type', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:type', expected: kind === 'blog' ? 'article' : 'website', unique: true },
      { key: 'OG URL', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:url', expected: canonical, url: true, absolute: true, unique: true },
      { key: 'OG Site Name', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:site_name', expected: SITE_CFG.brand, unique: true },
      { key: 'OG Locale', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:locale', expected: SITE_CFG.locale, unique: true },
      { key: 'OG Image', selector: tag => tag.name === 'meta' && tag.attrs.property?.toLowerCase() === 'og:image', expected: expectedImage, url: true, absolute: true, unique: true },
    );
    // This site currently configures no Twitter card fields, so none are required.
    const twitter = data.twitter || SITE_CFG.twitter;
    for (const [field, key] of [['card', 'Twitter Card'], ['title', 'Twitter Title'], ['description', 'Twitter Description'], ['image', 'Twitter Image']]) {
      if (!optional(twitter?.[field])) continue;
      list.push({ key, selector: tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === `twitter:${field}`, expected: twitter[field], unique: true });
    }
  }
  return list.filter(spec => optional(spec.expected) || ['Title', 'Description'].includes(spec.key));
};

const unresolved = /(?:undefined|null|\[\[?[^\]]+\]?\]|\{\{[^}]+\}\}|<%[\s\S]*?%>)/i;
for (const page of pages) {
  const record = { ...page, outcomes: [] };
  const output = htmlPath(page.route);
  const url = page.route;
  if (!existsSync(output)) {
    failures.push({ url, property: 'Generated HTML', expected: path.relative(ROOT, output), actual: 'missing', reason: 'Mapped Markdown page has no generated HTML file.' });
    record.outcomes.push({ key: 'Generated HTML', pass: false });
    pages[pages.indexOf(page)] = record;
    continue;
  }
  const tags = parseHtml(readFileSync(output, 'utf8'));
  for (const spec of specs(page)) {
    const matches = tags.filter(spec.selector);
    let reason = '';
    let actual = matches[0]?.name === 'link' ? matches[0]?.attrs.href ?? '' : matches[0]?.content ?? '';
    if (!matches.length) reason = 'Expected metadata tag is missing.';
    else if (spec.unique && matches.length !== 1) reason = `Expected one tag; found ${matches.length}.`;
    else if (!optional(spec.expected)) reason = 'Markdown frontmatter does not define an expected value.';
    else if (!optional(actual)) reason = 'Metadata attribute is empty.';
    else if (unresolved.test(actual)) reason = 'Metadata contains an unresolved placeholder or nullish value.';
    else if (spec.absolute && !/^https?:\/\//i.test(actual)) reason = 'URL metadata must use an absolute HTTP(S) URL.';
    else if (spec.url ? normalizeUrl(actual) !== normalizeUrl(spec.expected) : actual !== String(spec.expected)) reason = 'Rendered value does not match Markdown or global SEO configuration.';
    const pass = !reason;
    record.outcomes.push({ key: spec.key, pass });
    if (!pass) failures.push({ url, property: spec.key, expected: String(spec.expected), actual: actual || '(missing)', reason });
  }
  const titleCount = tags.filter(tag => tag.name === 'title').length;
  if (titleCount !== 1 && !specs(page).some(spec => spec.key === 'Title')) {
    failures.push({ url, property: 'Title', expected: 'one title element', actual: `${titleCount} title elements`, reason: 'Title element must be unique.' });
  }
  pages[pages.indexOf(page)] = record;
}

const discoveredFiles = [
  ...markdownFiles(CONTENT),
  ...markdownFiles(path.join(ROOT, 'src', 'pages')),
];
const testedFiles = new Set(pages.map(page => path.resolve(page.file)));
const skippedPages = discoveredFiles.filter(file => !testedFiles.has(path.resolve(file))).map(file => {
  const relative = path.relative(ROOT, file).replaceAll('\\', '/');
  let reason = 'No SEO route mapping is defined for this Markdown file.';
  if (relative.startsWith('handoff/content/proekti/')) reason = 'Underscore-prefixed project templates are excluded from publishing.';
  else if (relative.startsWith('handoff/content/onboarding/')) reason = 'Internal onboarding material is not published as a website page.';
  else if (path.basename(file).startsWith('_')) reason = 'Underscore-prefixed content templates are excluded by the site convention.';
  return { source: relative, reason };
});
const passedPages = pages.filter(page => page.outcomes.length && page.outcomes.every(outcome => outcome.pass)).length;
const failedPages = new Set(failures.map(failure => failure.url)).size;
const totalChecks = pages.reduce((sum, page) => sum + page.outcomes.length, 0);
const failedChecks = failures.length;
const passedChecks = totalChecks - failedChecks;
const status = failures.length ? 'FAILED' : 'PASSED';
const durationMs = Math.round((performance.now() - timerStart) * 100) / 100;
const finishedAt = new Date();
const report = {
  title: 'SEO Metadata Validation',
  status,
  generatedAt: finishedAt.toISOString(),
  startedAt: startedAt.toISOString(),
  durationMs,
  summary: {
    markdownFilesDiscovered: discoveredFiles.length,
    pagesTested: pages.length,
    passedPages,
    failedPages,
    skippedPages: skippedPages.length,
    totalMetadataChecks: totalChecks,
    passedMetadataChecks: passedChecks,
    failedMetadataChecks: failedChecks,
  },
  pages: pages.map(page => ({
    url: page.route,
    source: path.relative(ROOT, page.file).replaceAll('\\', '/'),
    status: page.outcomes.every(outcome => outcome.pass) ? 'PASSED' : 'FAILED',
    checks: page.outcomes.map(outcome => {
      const failure = failures.find(item => item.url === page.route && item.property === outcome.key);
      return failure
        ? { property: outcome.key, status: 'FAILED', expected: failure.expected, actual: failure.actual, reason: failure.reason }
        : { property: outcome.key, status: 'PASSED' };
    }),
  })),
  skipped: skippedPages,
  failures,
};

const reportDir = path.join(ROOT, 'reports', 'seo');
mkdirSync(reportDir, { recursive: true });
const jsonPath = path.join(reportDir, 'report.json');
const htmlPathname = path.join(reportDir, 'index.html');
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const resultClass = value => value === 'PASSED' ? 'passed' : value === 'FAILED' ? 'failed' : 'skipped';
const pageSections = report.pages.map(page => `
  <details class="page" ${page.status === 'FAILED' ? 'open' : ''}>
    <summary><span class="state ${resultClass(page.status)}">${page.status}</span><span class="page-url">${escapeHtml(page.url)}</span><span class="page-count">${page.checks.length} checks</span></summary>
    <div class="page-body">
      <p class="source">Source: <code>${escapeHtml(page.source)}</code></p>
      <ul class="checks">${page.checks.map(check => `<li class="check ${resultClass(check.status)}"><span class="state">${check.status}</span><strong>${escapeHtml(check.property)}</strong>${check.status === 'FAILED' ? `<dl><dt>Expected</dt><dd>${escapeHtml(check.expected)}</dd><dt>Actual</dt><dd>${escapeHtml(check.actual)}</dd><dt>Reason</dt><dd>${escapeHtml(check.reason)}</dd></dl>` : ''}</li>`).join('')}</ul>
    </div>
  </details>`).join('');
const skippedRows = report.skipped.map(item => `<li><code>${escapeHtml(item.source)}</code><span>${escapeHtml(item.reason)}</span></li>`).join('');
const htmlReport = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${report.title} — ${status}</title>
<style>
:root{color-scheme:light;--ink:#202a35;--muted:#5d6975;--line:#d9e0e6;--paper:#fff;--wash:#f3f6f8;--green:#176b45;--green-bg:#e7f4ec;--red:#a12c2c;--red-bg:#fff0ef;--amber:#805700;--amber-bg:#fff6dd;font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--wash);color:var(--ink)}main{max-width:1120px;margin:0 auto;padding:36px 24px 64px}h1{margin:0;font-size:28px;line-height:1.2;letter-spacing:-.02em}h2{margin:36px 0 12px;font-size:19px}.timestamp{margin:8px 0 24px;color:var(--muted);font-variant-numeric:tabular-nums}.banner{display:flex;align-items:center;gap:12px;margin:0 0 22px;padding:14px 16px;border:1px solid var(--line);background:var(--paper);font-weight:700}.banner.passed{color:var(--green);border-color:#b4d9c2}.banner.failed{color:var(--red);border-color:#edc0bd}.state{display:inline-block;font-size:12px;font-weight:750;letter-spacing:.04em}.passed .state,.state.passed{color:var(--green)}.failed .state,.state.failed{color:var(--red)}.skipped .state,.state.skipped{color:var(--amber)}.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;border:1px solid var(--line);background:var(--line)}.stat{padding:16px;background:var(--paper)}.stat dt{color:var(--muted);font-size:13px}.stat dd{margin:4px 0 0;font-size:23px;font-weight:700;font-variant-numeric:tabular-nums}.section-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px}.section-head p{margin:0;color:var(--muted);font-size:13px}.page-list{border-top:1px solid var(--line)}.page{border-bottom:1px solid var(--line);background:var(--paper)}.page summary{display:flex;align-items:center;gap:14px;min-height:54px;padding:12px 16px;cursor:pointer;list-style:none}.page summary::-webkit-details-marker{display:none}.page summary:focus-visible{outline:3px solid #397aa5;outline-offset:-3px}.page-url{font-weight:650;overflow-wrap:anywhere}.page-count{margin-left:auto;color:var(--muted);font-size:13px;white-space:nowrap}.page-body{padding:0 16px 16px}.source{margin:0 0 12px;color:var(--muted);font-size:13px}.checks{margin:0;padding:0;list-style:none}.check{display:grid;grid-template-columns:62px minmax(120px,190px) minmax(0,1fr);gap:8px;padding:10px 0;border-top:1px solid var(--line)}.check dl{display:grid;grid-template-columns:82px minmax(0,1fr);gap:3px 10px;margin:0;font-size:13px}.check dt{color:var(--muted);font-weight:600}.check dd{margin:0;overflow-wrap:anywhere}.skipped-list{padding:0;list-style:none;border-top:1px solid var(--line)}.skipped-list li{display:grid;grid-template-columns:minmax(220px,1fr) 2fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)}code{font-size:12px;overflow-wrap:anywhere}.skipped-list span{color:var(--muted)}@media(max-width:700px){main{padding:24px 16px 48px}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.page summary{gap:9px;flex-wrap:wrap}.page-count{margin-left:auto}.check{grid-template-columns:56px minmax(0,1fr)}.check dl{grid-column:2;grid-template-columns:68px minmax(0,1fr)}.skipped-list li{grid-template-columns:1fr;gap:4px}}
</style></head><body><main>
<h1>${report.title}</h1><p class="timestamp">Generated ${escapeHtml(finishedAt.toISOString())} · ${durationMs} ms</p>
<div class="banner ${resultClass(status)}"><span class="state">${status}</span><span>${failures.length ? `${failedChecks} metadata failure${failedChecks === 1 ? '' : 's'} across ${failedPages} page${failedPages === 1 ? '' : 's'}.` : `All ${pages.length} tested pages passed.`}</span></div>
<dl class="stats"><div class="stat"><dt>Markdown files discovered</dt><dd>${discoveredFiles.length}</dd></div><div class="stat"><dt>Pages tested</dt><dd>${pages.length}</dd></div><div class="stat"><dt>Passed pages</dt><dd>${passedPages}</dd></div><div class="stat"><dt>Failed pages</dt><dd>${failedPages}</dd></div><div class="stat"><dt>Skipped pages</dt><dd>${skippedPages.length}</dd></div><div class="stat"><dt>Metadata checks</dt><dd>${totalChecks}</dd></div><div class="stat"><dt>Passed checks</dt><dd>${passedChecks}</dd></div><div class="stat"><dt>Failed checks</dt><dd>${failedChecks}</dd></div></dl>
<div class="section-head"><h2>Page results</h2><p>Failed pages are expanded automatically.</p></div><div class="page-list">${pageSections || '<p>No eligible Markdown pages were found.</p>'}</div>
<h2>Skipped Markdown files</h2>${skippedRows ? `<ul class="skipped-list">${skippedRows}</ul>` : '<p>None</p>'}
</main></body></html>`;
writeFileSync(htmlPathname, htmlReport, 'utf8');

console.log('\nSEO METADATA VALIDATION');
console.log(`Execution time: ${finishedAt.toISOString()}`);
console.log(`Markdown files discovered: ${discoveredFiles.length}`);
console.log(`Pages tested: ${pages.length}`);
console.log(`Passed pages: ${passedPages}`);
console.log(`Failed pages: ${failedPages}`);
console.log(`Skipped pages: ${skippedPages.length}`);
console.log(`Total metadata checks: ${totalChecks}`);
console.log(`Passed metadata checks: ${passedChecks}`);
console.log(`Failed metadata checks: ${failedChecks}`);
console.log(`Execution duration: ${durationMs} ms`);
console.log(`Overall result: ${status}`);
for (const page of report.pages) {
  console.log(`\nPAGE: ${page.url} — ${page.status}`);
  for (const check of page.checks) {
    console.log(`${check.status === 'PASSED' ? 'PASS' : 'FAIL'} - ${check.property}`);
    if (check.status === 'FAILED') console.log(`  Expected: ${check.expected}\n  Actual: ${check.actual}\n  Reason: ${check.reason}`);
  }
}
for (const skipped of skippedPages) console.log(`\nSKIP - ${skipped.source}\n  Reason: ${skipped.reason}`);
console.log(`\nHTML report: ${path.relative(ROOT, htmlPathname)}`);
console.log(`JSON report: ${path.relative(ROOT, jsonPath)}`);
if (failures.length) process.exitCode = 1;
