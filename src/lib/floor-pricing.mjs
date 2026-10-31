// Ориентировъчни цени от src/content/seo/pricing.yaml — един източник за страници и schema.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

export const PRICING = load(readFileSync(path.resolve(process.cwd(), 'handoff/data/pricing.yaml'), 'utf8'));
export const PRICES_CONFIRMED = PRICING.status === 'confirmed';

const UNIT = { m2: 'кв.м', lm: 'л.м' };
const UNIT_CODE = { m2: 'MTK', lm: 'MTR' };

// Мерна единица — само ако е зададена.
// prefix (pricing.yaml) — дума пред диапазона, напр. „от“; null = без.
export const priceText = (p) => `${PRICING.prefix ? `${PRICING.prefix} ` : ''}${p.min}–${p.max} €${p.unit ? `/${UNIT[p.unit]}` : ''}`;
export const pricesFor = (pageId) => PRICING.items.filter((p) => p.pages.includes(pageId));

// Изречение пред FAQ отговор с `price: true`.
// Цените на страницата, с бележката на клиента („само труд“ и т.н.).
export function priceSentence(pageId) {
  const items = pricesFor(pageId);
  if (!items.length) return null;
  const one = (p) => `${priceText(p)}${p.note ? ` (${p.note})` : ''}`;
  return items.length === 1
    ? `Примерна цена: ${one(items[0])}.`
    : `Примерни цени: ${items.map((p) => `${p.name} — ${one(p)}`).join('; ')}.`;
}

export function vatText() {
  if (PRICING.vatIncluded === true) return 'с ДДС';
  if (PRICING.vatIncluded === false) return 'без ДДС';
  return null;
}

// JSON-LD: една UnitPriceSpecification на позиция.
export const priceSpec = (p) => ({
  '@type': 'UnitPriceSpecification', name: p.name, minPrice: p.min, maxPrice: p.max, priceCurrency: PRICING.currency,
  unitCode: UNIT_CODE[p.unit], unitText: UNIT[p.unit],
  ...(PRICING.vatIncluded != null && { valueAddedTaxIncluded: PRICING.vatIncluded }),
});
