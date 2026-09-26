"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Command, ExternalLink, Search, Terminal as TerminalIcon, X } from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

type Mode = "palette" | "terminal" | null;
type CommandItem = { label: string; detail: string; action: () => void; keywords: string };

export function ClientControls() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        returnFocusRef.current = document.activeElement as HTMLElement;
        setMode("palette");
      }
      if (event.key === "Escape") {
        setMode(null);
        window.setTimeout(() => returnFocusRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mode ? "hidden" : "";
    const background = document.querySelectorAll("#main-content, .site-footer, .brand, .primary-nav, .command-trigger, .terminal-trigger");
    background.forEach((element) => mode ? element.setAttribute("inert", "") : element.removeAttribute("inert"));
    return () => {
      document.body.style.overflow = "";
      background.forEach((element) => element.removeAttribute("inert"));
    };
  }, [mode]);

  const go = (href: string) => { setMode(null); router.push(href as Route); };
  const items: CommandItem[] = useMemo(() => [
    ...[["Work", "/work"], ["Research", "/research"], ["Side quests", "/side-quests"], ["About", "/about"]].map(([label, href]) => ({
      label: `Go to ${label}`, detail: href, keywords: `${label} ${href}`, action: () => go(href),
    })),
    ...projects.map((p) => ({ label: p.title, detail: p.id, keywords: `${p.title} ${p.systems.join(" ")}`, action: () => go(`/work/${p.slug}`) })),
    { label: "Open GitHub", detail: "External link", keywords: "github code", action: () => window.open(profile.links.github, "_blank", "noopener,noreferrer") },
    { label: "Open LinkedIn", detail: "External link", keywords: "linkedin profile", action: () => window.open(profile.links.linkedin, "_blank", "noopener,noreferrer") },
    { label: "Open terminal", detail: "Keyboard interface", keywords: "terminal commands", action: () => { setQuery(""); setMode("terminal"); } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const filtered = items.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  return (
    <div className="client-controls">
      {/* <button ref={triggerRef} className="command-trigger" onClick={(event) => { returnFocusRef.current = event.currentTarget; setMode("palette"); }} aria-label="Open command palette" aria-haspopup="dialog">
        <Command aria-hidden="true" size={16} /><span>Navigate</span><kbd>⌘ K</kbd>
      </button>
      <button className="terminal-trigger" onClick={(event) => { returnFocusRef.current = event.currentTarget; setMode("terminal"); }} aria-label="Open terminal" aria-haspopup="dialog">_</button>
      {mode === "palette" && <Palette query={query} setQuery={setQuery} items={filtered} close={() => { setMode(null); window.setTimeout(() => returnFocusRef.current?.focus(), 0); }} />}
      {mode === "terminal" && <Terminal close={() => { setMode(null); window.setTimeout(() => returnFocusRef.current?.focus(), 0); }} navigate={go} />} */}
    </div>
  );
}

function Palette({ query, setQuery, items, close }: { query: string; setQuery: (value: string) => void; items: CommandItem[]; close: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="palette" role="dialog" aria-modal="true" aria-labelledby="palette-title">
        <div className="palette-search">
          <Search aria-hidden="true" size={19} />
          <label className="sr-only" htmlFor="command-search" id="palette-title">Navigate AJDER Lab</label>
          <input ref={inputRef} id="command-search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && items[0]) items[0].action(); }} placeholder="Search routes, records, and actions…" />
          {query && <button className="clear-button" onClick={() => setQuery("")} aria-label="Clear search"><X aria-hidden="true" size={17} /></button>}
        </div>
        <div className="palette-list" role="list">
          {items.length ? items.map((item, index) => (
            <button key={`${item.label}-${index}`} onClick={item.action} autoFocus={false}>
              <span>{item.label}<small>{item.detail}</small></span>
              {item.detail === "External link" && <ExternalLink aria-hidden="true" size={15} />}
            </button>
          )) : <p className="palette-empty">No matching record. Try “research” or “Android”.</p>}
        </div>
        <div className="palette-foot mono"><span>Enter to open</span><span>Esc to close</span></div>
      </section>
    </div>
  );
}

function Terminal({ close, navigate }: { close: () => void; navigate: (href: string) => void }) {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<string[]>(["AJDER LAB command line · type ‘help’"]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const run = () => {
    const command = value.trim().toLowerCase();
    const routes: Record<string, string> = { work: "/work", research: "/research", "side quests": "/side-quests", sidequests: "/side-quests", about: "/about" };
    if (routes[command]) return navigate(routes[command]);
    if (command === "clear") { setLines([]); setValue(""); return; }
    const output: Record<string, string> = {
      help: "help · whoami · ls · work · research · sidequests · about · clear",
      whoami: "Milan Ajder / Software Engineer / Novi Sad, Serbia",
      ls: "/work  /research  /side-quests  /about",
      "research ai": "Opening Research / 001: AI-assisted software development",
    };
    setLines((current) => [...current, `$ ${value}`, output[command] ?? `Unknown command: ${command || "(empty)"}`]);
    if (command === "research ai") setTimeout(() => navigate("/research"), 500);
    setValue("");
  };
  return (
    <div className="overlay terminal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <section className="terminal" role="dialog" aria-modal="true" aria-labelledby="terminal-title">
        <header><span><TerminalIcon aria-hidden="true" size={17} /><strong id="terminal-title">AJDER / SHELL</strong></span><button onClick={close} aria-label="Close terminal"><X aria-hidden="true" size={18} /></button></header>
        <div className="terminal-output" aria-live="polite">{lines.map((line, i) => <p key={`${line}-${i}`}>{line}</p>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); run(); }} noValidate>
          <label htmlFor="terminal-input">$</label>
          <input ref={inputRef} id="terminal-input" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} aria-label="Terminal command" />
        </form>
      </section>
    </div>
  );
}
