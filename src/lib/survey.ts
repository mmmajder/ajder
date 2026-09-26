import schema from './survey-schema.json';
import { optionTranslations, questionLabels } from './survey-translations';

export type Wave = 0 | 1;
export type Question = {
  id: string;
  label: string;
  headers: (string | null)[];
  group: string;
  kind: 'category' | 'likert' | 'multi' | 'text';
};
export type Row = Record<string, string>;
export type Dataset = {
  uploaded?: boolean;
  rows: Row[];
  name: string;
  range: string;
  loaded: string;
  warnings: string[];
  available: string[];
};
export type Filters = Record<string, string[]>;
export const waveNames = ['January', 'August / September'];
const cyr = 'АБВГДЂЕЖЗИЈКЛМНОПРСТЋУФХЦЧШабвгдђежзијклмнопрстћуфхцчш';
const lat = Array.from(
  'ABVGDĐEŽZIJKLMNOPRSTĆUFHCČŠabvgdđežzijklmnoprstćufhcčš',
);
const translit: Record<string, string> = Object.fromEntries(
  Array.from(cyr).map((c, i) => [c, lat[i]]),
);
Object.assign(translit, {
  Љ: 'Lj',
  Њ: 'Nj',
  Џ: 'Dž',
  љ: 'lj',
  њ: 'nj',
  џ: 'dž',
});
function scalar(v: unknown): string {
  return typeof v === 'string' ? v : typeof v === 'number' || typeof v === 'boolean' ? String(v) : '';
}
export function normalize(v: unknown) {
  return scalar(v)
    .replace(/[\u0400-\u04FF]/g, (c) => translit[c] ?? c)
    .replace(/[–−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}
const key = (v: string) => normalize(v).toLowerCase();
const h = schema.headers;
export const questions: Question[] = [];
for (const [wave, headers] of h.entries())
  headers.slice(1).forEach((label, offset) => {
    const i = offset + 1;
    const existing = questions.find((q) =>
      q.headers.some((header) => header && key(header) === key(label)),
    );
    if (existing) {
      existing.headers[wave] = label;
      return;
    }
    const group =
      i <= 5 || (wave === 1 && i === 6)
        ? 'Respondent profile'
        : wave === 1 && i >= 33 && i <= 53
          ? 'Agentic work and control'
          : 'AI in everyday work';
    const isLikert =
      wave === 0
        ? [
            14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32,
          ].includes(i)
        : [
            15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 44,
            45, 46, 47, 48, 49, 50,
          ].includes(i);
    const text =
      wave === 0 ? [13, 34, 35].includes(i) : [14, 55, 56].includes(i);
    const multi = wave === 0 ? [7, 33].includes(i) : [8, 33, 54].includes(i);
    questions.push({
      id: `w${wave}q${i}`,
      label: questionLabels[wave][i],
      headers: wave === 0 ? [label, null] : [null, label],
      group: isLikert
        ? wave === 1 && i >= 44
          ? 'Agentic work and control'
          : 'Attitudes and experience'
        : text
          ? 'Open responses'
          : group,
      kind: text ? 'text' : isLikert ? 'likert' : multi ? 'multi' : 'category',
    });
  });
export const findQ = (index: number, wave: Wave = 0) =>
  questions.find((q) => q.headers[wave] === h[wave][index])!;
export const filterDefs = [
  { q: findQ(4), label: 'Gender' },
  { q: findQ(1), label: 'Years of experience' },
  { q: findQ(5), label: 'Age group' },
  { q: findQ(2), label: 'Field of work' },
  { q: findQ(3), label: 'Education' },
  { q: findQ(6), label: 'AI usage' },
  { q: findQ(12), label: 'Paid AI tools' },
  { q: findQ(8), label: 'Usage frequency' },
  { q: findQ(7), label: 'AI tool type' },
  { q: findQ(9), label: 'Share of AI-generated code' },
  { q: findQ(6, 1), label: 'Employment status · wave two only' },
  { q: findQ(42, 1), label: 'Agent autonomy · wave two only' },
];

function translateOption(value: string) {
  const exact = optionTranslations[value];
  if (exact) return exact;
  return Object.entries(optionTranslations)
    .filter(([source]) => source.length > 2)
    .sort(([left], [right]) => right.length - left.length)
    .reduce(
      (translated, [source, target]) => translated.replaceAll(source, target),
      value,
    );
}
export function harmonize(value: unknown, q: Question) {
  if (q.kind === 'text') return scalar(value).trim();
  let v = normalize(value);
  if (q.id === findQ(2).id)
    v =
      (
        {
          'Ful-stek': 'Full-stack',
          Bekend: 'Backend',
          'Obezbeđenje kvaliteta': 'QA',
          QE: 'QA',
          Devops: 'DevOps',
          Embeded: 'Embedded',
          'Embedded + tests': 'Embedded',
          'Front end': 'Frontend',
          'Front-end': 'Frontend',
          'Dejta/ML': 'Data/ML',
        } as Record<string, string>
      )[v] ?? v;
  return translateOption(v
    .replace(/\bVI\b/g, 'AI')
    .replace('Pređem na drugi zadatak', 'Pređem na drugi task'));
}
export function choices(v: string, q: Question): string[] {
  if (!v) return [];
  if (q.kind !== 'multi') return [v];
  if (q.id === findQ(7).id) {
    const patterns = [
      'Chat-based',
      'IDE integration',
      'AI-first IDE',
      'CLI / coding agents',
    ];
    const found = patterns.filter((p) => v.includes(p));
    // Split only outside parentheses: tool examples contain commas.
    const rest = v
      .split(/,\s*(?![^()]*\))/)
      .filter((s) => s && !patterns.some((p) => s.includes(p)));
    return [...new Set([...found, ...rest])];
  }
  return [
    ...new Set(
      v
        .split(/,\s*(?![^()]*\))/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}
export function filterRows(data: Dataset | null, filters: Filters) {
  return (data?.rows ?? []).filter((row) =>
    Object.entries(filters).every(
      ([id, values]) =>
        !values.length ||
        values.some((v) =>
          choices(
            row[id] ?? '',
            questions.find((q) => q.id === id)!,
          ).includes(v),
        ),
    ),
  );
}
export function distribution(rows: Row[], q: Question) {
  const counts: Record<string, number> = {};
  let n = 0;
  for (const row of rows) {
    const values = choices(row[q.id] ?? '', q);
    if (!values.length) continue;
    n++;
    values.forEach((v) => {
      counts[v] = (counts[v] ?? 0) + 1;
    });
  }
  return { n, missing: rows.length - n, counts };
}

const paidToolGroups = [
  { label: 'GitHub Copilot', pattern: /\b(?:github\s+|microsoft\s+)?copilot\b/i },
  {
    label: 'Claude',
    pattern:
      /\b(?:claud(?:e)?(?:\s+(?:ai|chat|code|cli|cowork|desktop|opus))?|caude|anthropic|cc)\b/i,
  },
  {
    label: 'ChatGPT / OpenAI',
    pattern:
      /\bchat\s*gpt(?:\s*(?:plus|premium|pro|team|\+))?\b|\bopen\s*ai\b|\bgpt(?:[-\s]?[345o]\w*)?\b/i,
  },
  { label: 'Codex', pattern: /\bcodex(?:\s+(?:cli|cloud))?\b/i },
  { label: 'Cursor', pattern: /\bcursor\b/i },
  { label: 'Gemini / Google AI', pattern: /\bgemini\b|\bgoogle(?:\s+ai)?\b/i },
  { label: 'Perplexity', pattern: /\bperplexity\b/i },
  { label: 'JetBrains AI / Junie', pattern: /\bjetbrains\b|\bjunie\b/i },
  { label: 'Windsurf / Codeium', pattern: /\bwindsurf\b|\bcodeium\b/i },
  { label: 'Augment Code', pattern: /\baugment\s*code\b/i },
  { label: 'Cline', pattern: /\bcline\b/i },
  { label: 'OpenCode', pattern: /\bopen\s*code\b/i },
  { label: 'Amazon Q / AWS', pattern: /\bamazon\s+q\b|\baws\b/i },
  { label: 'Grok', pattern: /\bgrok\b/i },
  { label: 'Replit', pattern: /\breplit\b/i },
] as const;

export function groupPaidToolResponses(values: string[]) {
  const counts: Record<string, number> = {};
  let n = 0;
  for (const raw of values) {
    const value = normalize(raw);
    if (!value) continue;
    n++;
    const matches = paidToolGroups.filter(({ pattern }) => pattern.test(value));
    if (!matches.length) {
      counts.Other = (counts.Other ?? 0) + 1;
      continue;
    }
    for (const { label } of matches) counts[label] = (counts[label] ?? 0) + 1;
  }
  return { n, counts };
}
const orders = [
  ['1', '2', '3', '4', '5'],
  ['0-1', '2-3', '4-5', '6-10', '10+'],
  ['0-10%', '11-25%', '26-50%', '51-75%', '76-100%'],
  [
    'Less often',
    'Several times a month',
    'Several times a week',
    'Several times a day',
    'In almost every work task',
  ],
  ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  [
    'Entirely me',
    'Mostly me',
    'Together',
    'Mostly AI',
    'Entirely AI',
  ],
  ['Never', 'Once', '2–3 times', '4–10 times', 'More than 10 times'],
];
export function categories(q: Question, allRows: Row[]) {
  const values = [
    ...new Set(allRows.flatMap((r) => choices(r[q.id] ?? '', q))),
  ];
  if (q.kind === 'likert') return ['1', '2', '3', '4', '5'];
  const order = orders.find(
    (o) => values.filter((v) => o.includes(v)).length >= 2,
  );
  return values.sort((a, b) =>
    order
      ? (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) -
          (order.indexOf(b) < 0 ? 99 : order.indexOf(b)) ||
        a.localeCompare(b, 'en', { numeric: true })
      : a.localeCompare(b, 'en', { numeric: true }),
  );
}
export async function parseWorkbook(
  buffer: ArrayBuffer,
  wave: Wave,
  name: string,
): Promise<Dataset> {
  if (buffer.byteLength > 20 * 1024 * 1024)
    throw new Error('The file is larger than 20 MB. Export survey responses only.');
  const ExcelJS = (await import('exceljs')).default;
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(buffer);
  const sheet = book.worksheets.find(
    (s) => s.getRow(1).values && s.getRow(1).cellCount > 5,
  );
  if (!sheet)
    throw new Error('No worksheet with headers in the first row was found.');
  const columns = new Map<string, number>();
  sheet.getRow(1).eachCell((c, i) => {
    const k = key(c.text);
    if (columns.has(k)) throw new Error('Duplicate header: ' + c.text);
    columns.set(k, i);
  });
  const expected = questions.filter((q) => q.headers[wave]);
  const available = expected.filter((q) => columns.has(key(q.headers[wave]!)));
  if (
    available.length < Math.floor(expected.length * 0.8) ||
    !columns.has(key(h[wave][1]))
  )
    throw new Error(
      `This file does not match the “${waveNames[wave]}” wave. Check the selected wave and column headers.`,
    );
  const missing = expected.filter((q) => !available.includes(q));
  const unknown = [...columns.keys()].filter(
    (k) => !h[wave].some((s) => key(s) === k),
  );
  const warnings = [
    ...missing.map((q) => 'Missing question: ' + q.label),
    ...unknown.map((k) => 'Unrecognized column (not displayed): ' + k),
  ];
  const rows: Row[] = [];
  const dates: Date[] = [];
  let invalid = 0;
  sheet.eachRow((r, i) => {
    if (i === 1) return;
    const out: Row = {};
    for (const q of available) {
      const c = r.getCell(columns.get(key(q.headers[wave]!))!);
      let v = harmonize(c.text, q);
      if (q.kind === 'likert' && v && !['1', '2', '3', '4', '5'].includes(v)) {
        invalid++;
        v = '';
      }
      out[q.id] = v;
    }
    if (!Object.values(out).some(Boolean)) return;
    rows.push(out);
    const dateColumn = columns.get(key(h[wave][0]));
    if (dateColumn) {
      const value = r.getCell(dateColumn).value;
      const date =
          value instanceof Date ? value : new Date(scalar(value));
      if (!isNaN(date.getTime())) dates.push(date);
    }
  });
  if (!rows.length) throw new Error('The file contains no responses.');
  if (invalid)
    warnings.push(
      `${invalid} values outside the 1–5 scale were excluded from those questions.`,
    );
  dates.sort((a, b) => a.getTime() - b.getTime());
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { timeZone: 'UTC' });
  return {
    rows,
    name,
    range: dates.length
      ? `${fmt(dates[0])} – ${fmt(dates[dates.length - 1])}`
      : 'Dates unavailable',
    loaded: new Date().toISOString(),
    warnings,
    available: available.map((q) => q.id),
  };
}
export function csvCell(value: unknown) {
  const s = scalar(value);
  return '"' + (/^[=+@\-\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""') + '"';
}
