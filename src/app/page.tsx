import Link from "next/link";
import type { Route } from "next";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { SignalRail } from "@/components/signal-rail";
import { HistoryLog } from "@/components/history-log";
import { EvidenceCard } from "@/components/evidence-card";
import { research } from "@/content/research";

export default function Home() {
  return (
    <>
      <section className="home-hero shell">
        <div className="hero-title-wrap">
          <p className="eyebrow">Milan Ajder · Software Engineer</p>
          <h1><span>AJDER</span><i>/</i></h1>
          <dl className="hero-origin">
            <div className="hero-origin-meta">
              <dt className="sr-only">Ajder</dt>
              <dd className="hero-origin-note">[EYE-der] · Persian origin</dd>
              <dd className="hero-origin-part">noun.</dd>
            </div>
            <dd className="hero-origin-definition">
              A name associated with the Persian word for dragon. Also: A software engineer who builds products end to end, from the interface to the systems behind it.
            </dd>
          </dl>
        </div>
        <div className="hero-statement">
          <p>Building software.<br />Exploring developer attention.<br /><span>Shipping products.</span></p>
          <Link className="primary-link" href="/research">Enter the research <ArrowDownRight aria-hidden="true" size={20} /></Link>
        </div>
        <SignalRail />
      </section>

      <HistoryLog />

      <section className="section shell" aria-labelledby="evidence-title"
        style={{ paddingTop: "32px" }}
      >
        <div className="section-heading">
          <div><h2 id="evidence-title">Selected evidence</h2></div>
          {/* <p>Technologies matter here only when they connect to something built, studied, or tested.</p> */}
        </div>
        <div className="evidence-grid">
          <EvidenceCard id={research.id} title="AI & Developer Work" description="A longitudinal study of productivity, mental effort, focus, trust, and coding-agent adoption." meta="2 WAVES" href="/research" />
          <EvidenceCard id="EXPERTISE / 003" title="Expertise across the stack" description="Building lead management, regulatory compliance, and health-tech products-from product interfaces and workflows to APIs, data, integrations, and cloud delivery." meta="END TO END" href="/work" />
          <EvidenceCard id="CERT / 001" title="AWS Developer – Associate" description="A professional certification connected to cloud application development." meta="AWS" href="https://www.credly.com/badges/3e46501c-9209-42e0-b422-f46b2f077aea/linked_in_profile" />
          <EvidenceCard id="SIDE QUESTS / 009" title="Side quests" description="Programs, certifications, research, organizing, and the communities that shaped how I build." meta="2022-2026" href="/side-quests" />
        </div>
      </section>

      {/* <section className="section shell cross-index" aria-labelledby="index-title">
        <div className="index-title">
          <p className="eyebrow">Cross-reference</p>
          <h2 id="index-title">Follow the evidence,<br />not a skills list.</h2>
        </div>
        <div className="index-rows">
          {[
            ["React / Next.js", "Web systems and lab experiments", "/work"],
            ["Kotlin / Compose", "Bachelor’s thesis Android app", "/work/bachelors-thesis-app"],
            ["AI-assisted development", "Research / 001", "/research"],
            ["AWS", "Developer Associate certification", "/about#certification"],
          ].map(([label, evidence, href]) => (
            <Link href={href as Route} key={label}><strong>{label}</strong><span>{evidence}</span><ArrowRight aria-hidden="true" size={18} /></Link>
          ))}
        </div>
      </section> */}
    </>
  );
}
