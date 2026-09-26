'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import {
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Database,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import {
  Select as AuthoredSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import ResearchLoading from '@/components/research-loading';
import {
  categories,
  csvCell,
  Dataset,
  distribution,
  filterDefs,
  filterRows,
  Filters,
  findQ,
  groupPaidToolResponses,
  normalize,
  parseWorkbook,
  Question,
  questions,
  Row,
  Wave,
  waveNames,
} from '@/lib/survey';

const colors = ['#4164e8', '#109886'];
const trackResearch = (event: string, properties: Record<string, string>) => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.capture(event, properties);
  }
};
const fmt = (v: number) =>
  v.toLocaleString('en-GB', { maximumFractionDigits: 1 });
const pct = (n: number, total: number) => (total ? (100 * n) / total : 0);
function download(content: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Pick({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <AuthoredSelect
      value={value}
      onValueChange={(v) => {
        if (v !== null) onChange(v);
      }}
    >
      <SelectTrigger aria-label={label} className="picker">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((v) => (
          <SelectItem key={v} value={v}>
            {v}
          </SelectItem>
        ))}
      </SelectContent>
    </AuthoredSelect>
  );
}
function Legend() {
  return (
    <div className="legend">
      <span>
        <i style={{ background: colors[0] }} />
        January
      </span>
      <span>
        <i style={{ background: colors[1] }} />
        August / September
      </span>
    </div>
  );
}

function OriginalTextResponses({ q, rows }: { q: Question; rows: Row[][] }) {
  return (
    <div className="text-columns">
      {rows.map((rs, w) => {
        const responses = rs.filter((r) => r[q.id]);
        return (
          <section key={w}>
            <h4 style={{ color: colors[w] }}>
              {waveNames[w]} · {responses.length} responses
            </h4>
            {!q.headers[w] ? (
              <p>This question was not asked.</p>
            ) : responses.length ? (
              responses.map((r, j) => (
                <blockquote key={j}>{r[q.id]}</blockquote>
              ))
            ) : (
              <p>No responses match the selected filters.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PaidToolsSummary({ q, rows }: { q: Question; rows: Row[][] }) {
  const grouped = rows.map((rs) =>
    groupPaidToolResponses(rs.map((r) => r[q.id] ?? '')),
  );
  const labels = [
    ...new Set(grouped.flatMap(({ counts }) => Object.keys(counts))),
  ].sort(
    (a, b) =>
      grouped.reduce((sum, result) => sum + (result.counts[b] ?? 0), 0) -
      grouped.reduce((sum, result) => sum + (result.counts[a] ?? 0), 0) ||
      a.localeCompare(b, 'en'),
  );

  return (
    <>
      <p className="grouped-intro">
        Spelling variants and product editions are grouped by tool. A single
        response can contribute to more than one group.
      </p>
      {labels.length ? (
        <div className="tool-groups-scroll">
          <table className="tool-groups">
            <thead>
              <tr>
                <th scope="col">Tool group</th>
                {grouped.map((result, w) => (
                  <th scope="col" key={w} style={{ color: colors[w] }}>
                    <span>{waveNames[w]}</span>
                    <br />
                    <small>n = {result.n}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {grouped.map((result, w) => {
                    const count = result.counts[label] ?? 0;
                    const percent = pct(count, result.n);
                    return (
                      <td
                        key={w}
                        aria-label={`${waveNames[w]}: ${count} of ${result.n} responses, ${fmt(percent)}%`}
                      >
                        <div className="tool-group-value">
                          <strong>{count}</strong>
                          <span>&nbsp;&nbsp;{fmt(percent)}%</span>
                        </div>
                        <div className="tool-group-track" aria-hidden="true">
                          <span
                            style={{ width: `${percent}%`, background: colors[w] }}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty">No responses match the selected filters.</p>
      )}
      <details className="raw-responses">
        <summary>Show original responses</summary>
        <OriginalTextResponses q={q} rows={rows} />
      </details>
    </>
  );
}
const likertLabels = [
  '',
  '1 · Strongly disagree',
  '2 · Disagree',
  '3 · Neutral',
  '4 · Agree',
  '5 · Strongly agree',
];

function Chart({
  q,
  rows,
  allRows,
  data,
  mode,
  serial,
}: {
  q: Question;
  rows: Row[][];
  allRows: Row[];
  data: (Dataset | null)[];
  mode: string;
  serial: number;
}) {
  const d = rows.map((r) => distribution(r, q));
  const cats = categories(q, allRows);
  const available = data.map(
    (ds, w) => !!q.headers[w] && !!ds?.available.includes(q.id),
  );
  const cap = mode === 'Percentages' ? 100 : Math.max(1, ...d.map((s) => s.n));
  const label = (c: string) =>
    q.kind === 'likert' ? (likertLabels[Number(c)] ?? c) : c;
  function svg() {
    trackResearch('research_chart_downloaded', { question: q.id, format: 'svg' });
    const esc = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
          })[c]!,
      );
    const width = 1200;
    const lines = (s: string, len: number) =>
      s.match(new RegExp(`.{1,${len}}(?:\\s|$)|.{1,${len}}`, 'g')) ?? [s];
    const title = lines(q.label, 100);
    let y = 40 + title.length * 25;
    let body = title
      .map(
        (s, i) =>
          `<text x="30" y="${35 + i * 25}" font-size="19" font-weight="600">${esc(s)}</text>`,
      )
      .join('');
    body += `<text x="30" y="${y + 20}" font-size="14">January: n=${d[0].n} · August / September: n=${d[1].n} · ${mode} · Filtered results</text>`;
    y += 55;
    cats.forEach((c) => {
      const l = lines(label(c), 100);
      l.forEach((s) => {
        body += `<text x="30" y="${y}" font-size="14">${esc(s)}</text>`;
        y += 19;
      });
      d.forEach((s, w) => {
        const n = s.counts[c] ?? 0;
        const value = mode === 'Percentages' ? pct(n, s.n) : n;
        body += `<text x="30" y="${y + 15}" font-size="13">${esc(waveNames[w])}</text><rect x="180" y="${y}" height="19" width="${available[w] && s.n ? (value / cap) * 750 : 0}" fill="${colors[w]}"/><text x="950" y="${y + 15}" font-size="13">${available[w] && s.n ? `${fmt(pct(n, s.n))}% (${n}/${s.n})` : 'No data'}</text>`;
        y += 27;
      });
      y += 18;
    });
    body += `<text x="30" y="${y + 12}" font-size="13">Two independent samples. Percentages use valid responses to this question. ${q.kind === 'multi' ? 'Multiple choice: totals may exceed 100%.' : ''}</text>`;
    download(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y + 45}" viewBox="0 0 ${width} ${y + 45}"><rect width="100%" height="100%" fill="#111411"/><g fill="#f1f4ee" font-family="Arial,sans-serif">${body}</g></svg>`,
      'image/svg+xml',
      `${q.id}-chart.svg`,
    );
  }
  return (
    <article className="chart-card" id={q.id} tabIndex={-1}>
      <div className="chart-heading">
        <div>
          <div className="eyebrow">
            <span>{String(serial).padStart(2, '0')}</span>
            {q.group}
            <b className={q.headers.every(Boolean) ? 'badge common' : 'badge'}>
              {q.headers.every(Boolean)
                ? 'Comparison'
                : q.headers[0]
                  ? 'January only'
                  : 'Wave two only'}
            </b>
          </div>
          <h3>{q.label}</h3>
        </div>
        <button
          className="icon-button"
          title="Download chart as SVG"
          aria-label={`Download chart: ${q.label}`}
          onClick={svg}
        >
          <ArrowDownToLine size={18} />
        </button>
      </div>
      <div className="sample-line">
        {d.map((s, w) => (
          <span key={w}>
            <i style={{ background: colors[w] }} />
            {waveNames[w]}:{' '}
            {available[w]
              ? `n = ${s.n} · missing ${s.missing}`
              : 'Question unavailable'}
          </span>
        ))}
      </div>
      {q.kind === 'likert' && (
        <div className="likert-summary">
          {d.map((s, w) => {
            const mean = s.n
              ? Object.entries(s.counts).reduce(
                (a, [k, n]) => a + Number(k) * n,
                0,
              ) / s.n
              : null;
            return (
              <span key={w}>
                Average score · {waveNames[w]}{' '}
                <strong style={{ color: colors[w] }}>
                  {available[w] && mean !== null ? `${fmt(mean)} / 5` : '-'}
                </strong>
              </span>
            );
          })}
        </div>
      )}
      {cats.length === 0 ? (
        <p className="empty">No responses for this question.</p>
      ) : (
        <div className="chart">
          <div className="axis">
            <span>Response</span>
            <div>
              {[0, 25, 50, 75, 100].map((v) => (
                <span key={v}>
                  {fmt((v / 100) * cap)}
                  {mode === 'Percentages' ? '%' : ''}
                </span>
              ))}
            </div>
            <span>Share · count</span>
            <span>Δ p.p.</span>
          </div>
          {cats.map((c) => {
            const a = pct(d[0].counts[c] ?? 0, d[0].n),
              b = pct(d[1].counts[c] ?? 0, d[1].n);
            const delta =
              available.every(Boolean) && d.every((s) => s.n > 0)
                ? b - a
                : null;
            return (
              <div className="chart-row" key={c}>
                <div className="answer-label">{label(c)}</div>
                <div className="bar-pair">
                  {d.map((s, w) => {
                    const count = s.counts[c] ?? 0;
                    const value = mode === 'Percentages' ? pct(count, s.n) : count;
                    return (
                      <div
                        className="bar-track"
                        key={w}
                        title={`${waveNames[w]}: ${count} of ${s.n} (${fmt(pct(count, s.n))}%)`}
                      >
                        <div
                          className="bar-fill"
                          style={{
                            width: `${available[w] && s.n ? (value / cap) * 100 : 0}%`,
                            background: colors[w],
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="bar-values">
                  {d.map((s, w) => (
                    <span key={w}>
                      {available[w] && s.n ? (
                        <>
                          <strong>{fmt(pct(s.counts[c] ?? 0, s.n))}%</strong>
                          <small>
                            {s.counts[c] ?? 0} / {s.n}
                          </small>
                        </>
                      ) : (
                        <small>-</small>
                      )}
                    </span>
                  ))}
                </div>
                <div
                  className="delta"
                  title="Wave two minus January, in percentage points"
                >
                  {delta === null
                    ? '-'
                    : `${delta > 0 ? '+' : ''}${fmt(delta)}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="chart-foot">
        {q.kind === 'multi'
          ? 'Multiple choice · percentages may total more than 100%.'
          : 'Percentages are calculated from valid responses to this question.'}
        {d.some((s, w) => available[w] && s.n > 0 && s.n < 10) && (
          <span className="small-sample">
            Small sample: fewer than 10 responses.
          </span>
        )}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<(Dataset | null)[]>([null, null]);
  const [filters, setFilters] = useState<Filters>({});
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Shared questions');
  const [group, setGroup] = useState('All topics');
  const [mode, setMode] = useState('Percentages');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const imported = useRef([false, false]);
  const hashes = useRef(['', '']);
  const refreshing = useRef(false);
  const dataRef = useRef(data);
  async function refresh(reset = false) {
    if (refreshing.current) return;
    refreshing.current = true;
    setBusy(true);
    setError('');
    try {
      const next = [...dataRef.current];
      for (const w of [0, 1] as Wave[]) {
        if (imported.current[w] && !reset) continue;
        const assetName = w === 0 ? 'januar.xlsx' : 'drugi-talas.xlsx';
        const displayName =
          w === 0 ? 'January.xlsx' : 'August-September.xlsx';
        const r = await fetch(`/data/${assetName}`, { cache: 'no-store' });
        if (!r.ok)
          throw new Error(
            `Could not load ${displayName}. Try again or upload an XLSX file.`,
          );
        const buffer = await r.arrayBuffer();
        const digest = Array.from(
          new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)),
        )
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        if (digest !== hashes.current[w] || reset || !next[w]) {
          next[w] = await parseWorkbook(buffer, w, displayName);
          hashes.current[w] = digest;
        }
      }
      setData(next);
      dataRef.current = next;
      if (reset) {
        imported.current = [false, false];
        localStorage.removeItem('ai-survey-imports-v1');
      }
      setStatus('Data refreshed.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Loading failed.');
    } finally {
      refreshing.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('ai-survey-imports-v1') ?? '[null,null]',
      );
      if (Array.isArray(saved) && saved.length === 2) {
        const next = saved.map((d: Dataset | null, w: number) => {
          if (
            d &&
            Array.isArray(d.rows) &&
            Array.isArray(d.available) &&
            typeof d.name === 'string'
          ) {
            imported.current[w] = true;
            return d;
          }
          return null;
        });
        dataRef.current = next;
        setData(next);
      }
    } catch {
      setStatus('Saved data is unavailable; loading the bundled files.');
    }
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  async function upload(file: File, w: Wave) {
    setBusy(true);
    setError('');
    try {
      if (!/\.xlsx$/i.test(file.name)) throw new Error('Choose an XLSX file.');
      const parsed = await parseWorkbook(
        await file.arrayBuffer(),
        w,
        file.name,
      );
      const next = [...dataRef.current];
      parsed.uploaded = true;
      next[w] = parsed;
      imported.current[w] = true;
      setData(next);
      dataRef.current = next;
      try {
        localStorage.setItem(
          'ai-survey-imports-v1',
          JSON.stringify(next.map((d, i) => (imported.current[i] ? d : null))),
        );
        setStatus(
          `${file.name}: loaded ${parsed.rows.length} responses. Saved in this browser.`,
        );
      } catch {
        setStatus(
          'Data loaded for this session. The browser did not allow persistent storage.',
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The XLSX file could not be read.');
    } finally {
      setBusy(false);
    }
  }
  const allRows = useMemo(() => data.flatMap((d) => d?.rows ?? []), [data]);
  const rows = useMemo(
    () => data.map((d) => filterRows(d, filters)),
    [data, filters],
  );
  const [pendingChart, setPendingChart] = useState<string | null>(null);
  const findings = [
    {
      question: findQ(8),
      title: 'AI is reaching more everyday tasks',
      detail: 'Used in almost every work task',
      values: ['In almost every work task'],
    },
    {
      question: findQ(7),
      title: 'Coding agents gained ground',
      detail: 'Use CLI or coding agents',
      values: ['CLI / coding agents'],
    },
    {
      question: findQ(14),
      title: 'More respondents report a productivity gain',
      detail: 'Agree or strongly agree',
      values: ['4', '5'],
    },
    {
      question: findQ(23),
      title: 'Verification remains part of the work',
      detail: 'Agree or strongly agree',
      values: ['4', '5'],
    },
  ];
  useEffect(() => {
    if (!pendingChart) return;
    const frame = requestAnimationFrame(() => {
      const chart = document.getElementById(pendingChart);
      chart?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      chart?.focus({ preventScroll: true });
      if (chart) {
        history.replaceState(null, '', `#${pendingChart}`);
        setPendingChart(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingChart, tab, group, query]);
  function openFinding(id: string) {
    trackResearch('research_finding_opened', { question: id });
    setFilters({});
    setTab('Shared questions');
    setGroup('All topics');
    setQuery('');
    setPendingChart(id);
  }
  const active = Object.values(filters).reduce((n, v) => n + v.length, 0);
  const activeSecond = Object.entries(filters).some(
    ([id, v]) =>
      v.length && questions.find((q) => q.id === id)?.headers[0] === null,
  );
  const groups = [
    'All topics',
    ...new Set(questions.filter((q) => q.kind !== 'text').map((q) => q.group)),
  ];
  const shown = questions.filter(
    (q) =>
      (tab === 'Open responses' ? q.kind === 'text' : q.kind !== 'text') &&
      (tab !== 'Shared questions' || q.headers.every(Boolean)) &&
      (tab !== 'Single-wave questions' || !q.headers.every(Boolean)) &&
      (group === 'All topics' ||
        q.group === group ||
        tab === 'Open responses') &&
      normalize(q.label).toLowerCase().includes(normalize(query).toLowerCase()),
  );
  const ordered = [...shown].sort(
    (a, b) => Number(b.id === findQ(6).id) - Number(a.id === findQ(6).id),
  );
  function toggle(id: string, v: string) {
    setFilters((f) => ({
      ...f,
      [id]: (f[id] ?? []).includes(v)
        ? f[id].filter((x) => x !== v)
        : [...(f[id] ?? []), v],
    }));
  }
  function exportCSV() {
    trackResearch('research_exported', { format: 'csv' });
    const records: unknown[][] = [
      [
        'Question',
        'Waves',
        'Response',
        'Wave',
        'Count',
        'Valid responses',
        'Percentage',
        'Missing',
        'Active filters',
      ],
    ];
    for (const q of shown.filter((q) => q.kind !== 'text'))
      for (const w of [0, 1] as Wave[]) {
        if (!data[w]?.available.includes(q.id)) continue;
        const d = distribution(rows[w], q);
        for (const c of categories(q, allRows))
          records.push([
            q.label,
            q.headers.every(Boolean) ? 'Shared' : 'Single wave',
            c,
            waveNames[w],
            d.counts[c] ?? 0,
            d.n,
            d.n ? pct(d.counts[c] ?? 0, d.n) : '',
            d.missing,
            Object.entries(filters)
              .filter(([, v]) => v.length)
              .map(
                ([id, v]) =>
                  `${questions.find((q) => q.id === id)?.label}: ${v.join(' / ')}`,
              )
              .join('; '),
          ]);
      }
    download(
      '\uFEFF' + records.map((r) => r.map(csvCell).join(',')).join('\r\n'),
      'text/csv;charset=utf-8',
      'survey-filtered-results.csv',
    );
  }
  if (busy && !allRows.length && !error) return <ResearchLoading />;
  return (
    <section className="research-dashboard" aria-labelledby="research-dashboard-title">
      <div className="research-story shell">
        <div className="research-story-kicker mono"><span>RESEARCH / 001</span><span>JANUARY → AUGUST / SEPTEMBER 2026</span></div>
        <h1 id="research-dashboard-title">Two waves.<br /><em>Seven months apart.</em></h1>
        <div className="research-story-intro">
          <h2>About the research</h2>
          <div>
            <p>How is AI changing the way software developers work? This study compares two surveys of IT professionals, from January and August / September 2026, to trace changes in usage, productivity, focus, and trust.</p>
            <p>The first wave included 131 respondents and the second 101. They are independent samples, so the differences below describe the answers in each wave; they do not track the same people or prove a cause.</p>
          </div>
        </div>
        <div className="research-findings" aria-labelledby="research-findings-title">
          <div className="research-findings-heading"><span className="mono">KEY FINDINGS</span><h2 id="research-findings-title">What the two waves show</h2><p>Select a finding to see its chart and the responses behind it. Percentages use valid answers to each question.</p></div>
          <div className="research-findings-list">
            {findings.map((finding, index) => {
              const results = data.map((dataset) => {
                const result = distribution(dataset?.rows ?? [], finding.question);
                return result.n ? Math.round(pct(finding.values.reduce((sum, value) => sum + (result.counts[value] ?? 0), 0), result.n)) : null;
              });
              return <button className="research-finding" key={finding.question.id} type="button" onClick={() => openFinding(finding.question.id)} disabled={!allRows.length}>
                <span className="mono research-finding-index">0{index + 1}</span>
                <span className="research-finding-copy"><strong>{finding.title}</strong><small>{finding.detail}</small></span>
                <span className="research-finding-values" aria-label={results.every((value) => value !== null) ? `January ${results[0]} percent; August / September ${results[1]} percent` : 'Loading results'}>{results[0] === null ? '—' : `${results[0]}%`} <span>→</span> {results[1] === null ? '—' : `${results[1]}%`}</span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </button>;
            })}
          </div>
        </div>
      </div>
      <header className="research-dashboard-toolbar shell">
        <div>
          <span className="mono research-dashboard-id">RESEARCH / 001</span>
          <strong>AI in practice</strong>
          <small>Research among IT professionals</small>
        </div>
        <div className="header-actions">
          <span className="private-label">
            <span />
            Two waves · 2026
          </span>
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => refresh()}
          >
            <RefreshCw size={16} className={busy ? 'spin' : ''} />
            Refresh
          </button>
          <button
            className="button primary"
            onClick={exportCSV}
            disabled={!allRows.length || tab === 'Open responses'}
          >
            <ArrowDownToLine size={16} />
            Export CSV
          </button>
        </div>
      </header>
      <div className="workspace">
        <aside className={`filters-panel ${showFilters ? 'mobile-open' : ''}`}>
          <div className="filter-title">
            <span>
              <Filter size={17} /> Sample filters{' '}
              {active > 0 && <b>{active}</b>}
            </span>
            <button className="text-button" onClick={() => setFilters({})}>
              Clear
            </button>
          </div>
          <p className="filter-intro">The same criteria apply to both waves.</p>
          {filterDefs.map(({ q, label }, i) => {
            const opts = categories(q, allRows);
            return (
              <details
                key={q.id}
                className="filter-section"
                open={i < 3 ? true : undefined}
              >
                <summary>
                  {label}
                  {!!filters[q.id]?.length && <b>{filters[q.id].length}</b>}
                  <ChevronDown size={15} />
                </summary>
                <div className="filter-options">
                  {opts.map((v) => (
                    <label className="check-label" key={v}>
                      <Checkbox
                        checked={(filters[q.id] ?? []).includes(v)}
                        onCheckedChange={() => toggle(q.id, v)}
                      />
                      <span>{v}</span>
                      <small>
                        {
                          allRows.filter((r) =>
                            q.kind === 'multi'
                              ? r[q.id]?.includes(v)
                              : r[q.id] === v,
                          ).length
                        }
                      </small>
                    </label>
                  ))}
                </div>
              </details>
            );
          })}
          <div className="filter-note">
            <strong>How are filters combined?</strong>
            <p>
              Multiple choices in one group use “or”. Different groups are
              combined with “and”.
            </p>
          </div>
        </aside>
        <main className="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                RESEARCH RESULTS <span className="live-dot" /> XLSX DATA
              </div>
              <h2 id="research-results-title">Explore the results.</h2>
              <p>
                Compare how the use of AI assistants differs between two
                samples.
              </p>
            </div>
            <button
              className="button secondary mobile-filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters {active || ''}
            </button>
          </div>
          <div className="summary-grid">
            {data.map((ds, w) => (
              <section key={w} className="metric-card">
                <div className="metric-top">
                  <span>
                    <i style={{ background: colors[w] }} />
                    {waveNames[w]}
                  </span>
                  <span>WAVE 0{w + 1}</span>
                </div>
                <div className="metric-number">
                  {ds ? rows[w].length : '-'}
                  <small>/ {ds?.rows.length ?? '-'} respondents</small>
                </div>
                <div className="metric-bottom">
                  <span>{ds?.range ?? 'Loading data…'}</span>
                  <BarChart3 size={20} color={colors[w]} />
                </div>
              </section>
            ))}
            <section className="metric-card">
              <div className="metric-top">
                <span>Shared questions</span>
                <ArrowUpRight size={18} />
              </div>
              <div className="metric-number">
                {
                  questions.filter(
                    (q) => q.headers.every(Boolean) && q.kind !== 'text',
                  ).length
                }
                <small>for direct comparison</small>
              </div>
              <div className="metric-bottom">
                <span>Horizontal charts · both waves</span>
              </div>
            </section>
          </div>
          {/* <details className="data-panel">
            <summary>
              <span>
                <Database size={17} /> Data sources and updates
              </span>
              <span>
                {busy ? 'Loading…' : 'Upload a new XLSX'}
                <ChevronDown size={16} />
              </span>
            </summary>
            <div className="data-content">
              {status && (
                <output className="upload-status">
                  {status}
                </output>
              )}
              <p>
                This local version follows the source Excel files. On the
                published page, upload a new XLSX below; the replacement is
                stored only in this browser. Charts are calculated directly
                from file rows without manually entered results.
              </p>
              <div className="upload-grid">
                {data.map((ds, w) => (
                  <div className="upload-card" key={w}>
                    <FileSpreadsheet color={colors[w]} size={24} />
                    <strong>{waveNames[w]}</strong>
                    <small>{ds?.name ?? 'No file'}</small>
                    <label className="button secondary">
                      Upload XLSX
                      <input
                        type="file"
                        accept=".xlsx"
                        disabled={busy}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void upload(f, w as Wave);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <small>
                      {ds?.uploaded
                        ? 'Local replacement in this browser'
                        : 'Bundled file · checked every 60 seconds'}
                    </small>
                  </div>
                ))}
              </div>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => refresh(true)}
              >
                Restore bundled XLSX files
              </button>
              {data
                .flatMap((ds) => ds?.warnings ?? [])
                .map((w, i) => (
                  <p className="warning" key={i}>
                    {w}
                  </p>
                ))}
            </div>
          </details> */}
          {error && (
            <div className="notice error" role="alert">
              {error}
              <button className="text-button" onClick={() => refresh()}>
                Try again
              </button>
            </div>
          )}
          <output className="sr-only">
            {busy ? 'Loading data' : status}
          </output>
          {active > 0 && (
            <div className="active-filters">
              {Object.entries(filters).flatMap(([id, vs]) =>
                vs.map((v) => (
                  <button key={id + v} onClick={() => toggle(id, v)}>
                    {filterDefs.find((f) => f.q.id === id)?.label}: {v}
                    <X size={13} />
                  </button>
                )),
              )}
            </div>
          )}
          {activeSecond && (
            <p className="notice">
              The selected filter exists only in wave two. January has no
              matching data, so a comparison is unavailable.
            </p>
          )}
          <div className="results-toolbar">
            <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
              <TabsList variant="line" className="result-tabs">
                {[
                  'Shared questions',
                  'Single-wave questions',
                  'All questions',
                  'Open responses',
                ].map((t) => (
                  <TabsTrigger value={t} key={t}>
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="search-toolbar">
            <div className="search-input">
              <Search size={17} />
              <input
                aria-label="Search questions"
                placeholder="Find a question…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {tab !== 'Open responses' && (
              <>
                <Pick
                  label="Question topic"
                  value={group}
                  options={groups}
                  onChange={setGroup}
                />
                <Pick
                  label="Chart unit"
                  value={mode}
                  options={['Percentages', 'Response count']}
                  onChange={setMode}
                />
              </>
            )}
          </div>
          <div className="results-meta">
            <span>
              {shown.length} questions {active > 0 ? '· filtered samples' : ''}
            </span>
            <Legend />
          </div>
          {busy && !allRows.length ? (
            <div className="empty">
              <RefreshCw className="spin" />
              Reading responses from both surveys…
            </div>
          ) : ordered.length === 0 ? (
            <div className="empty">
              No questions match this search.{' '}
              <button
                className="text-button"
                onClick={() => {
                  setQuery('');
                  setGroup('All topics');
                }}
              >
                Show all topics
              </button>
            </div>
          ) : (
            ordered.map((q, i) =>
              q.kind === 'text' ? (
                <article className="chart-card" key={q.id}>
                  <div className="eyebrow">OPEN RESPONSES</div>
                  <h3>{q.label}</h3>
                  <p className="source-language-note">
                    Free-text responses are shown in their original language.
                  </p>
                  {q.id === findQ(13).id ? (
                    <PaidToolsSummary q={q} rows={rows} />
                  ) : (
                    <OriginalTextResponses q={q} rows={rows} />
                  )}
                </article>
              ) : (
                <Chart
                  key={q.id}
                  q={q}
                  rows={rows}
                  allRows={allRows}
                  data={data}
                  mode={mode}
                  serial={i + 1}
                />
              ),
            )
          )}
          <footer className="method-note">
            <span className="method-icon">
              <Check size={18} />
            </span>
            <div>
              <strong>About this comparison</strong>
              <p>
                The waves represent independent samples rather than the same
                people over time. Differences are descriptive and do not
                establish causality or statistical significance. Δ is August /
                September minus January in percentage points. Blank responses
                are excluded from each question&apos;s denominator. The 25–29 and
                30–34 age groups remain separate; Cyrillic entries and selected
                field-of-work synonyms are harmonized. Questions are matched by
                wording regardless of column order.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </section>
  );
}
