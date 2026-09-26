import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { homeEvidence, homeSignals } from "@/content/home-variants";
import { profile } from "@/content/profile";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AJDER — Version 2",
  description: "A monochrome take on Milan Ajder's software engineering portfolio.",
};

export default function VersionTwo() {
  return (
    <div className={styles.versionPage} data-home-version="2">
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/v2" aria-label="AJDER version 2 home">AJDER<span>®</span></Link>
        <nav className={styles.mainNav} aria-label="Version 2 navigation">
          <Link href="/work">Work</Link>
          <Link href="/research">Research</Link>
          <Link href="/side-quests">Side quests</Link>
          <Link href="/about">About</Link>
        </nav>
        <a className={styles.contact} href={`mailto:${profile.links.email}`}>Email Milan <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>

      <section className={styles.hero} aria-labelledby="v2-heading">
        <div className={styles.heroTop}><span>Milan Ajder · Software Engineer</span><span>Build · Ship · Scale</span></div>
        <div className={styles.logoFrame}>
          <Image src="/ajder-mark-monochrome.png" alt="AJDER — Build · Ship · Scale" width={1774} height={887} priority sizes="(max-width: 800px) 100vw, 80vw" />
        </div>
        <div className={styles.heroBottom}>
          <div>
            <h1 id="v2-heading">AJDER<span>/</span></h1>
            <dl className={styles.origin}>
              <div><dt className="sr-only">Ajder</dt><dd>[EYE-der] · Persian origin</dd><dd>noun.</dd></div>
              <dd>A name associated with the Persian word for dragon. Also: A software engineer who builds products end to end, from the interface to the systems behind it.</dd>
            </dl>
          </div>
          <div className={styles.heroAside}>
            <p>Building software.<br />Exploring developer attention.<br /><span>Shipping products.</span></p>
            <Link className={buttonVariants({ size: "lg", className: styles.whiteButton })} href="/research">Enter the research <ArrowDownRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className={styles.signals} aria-labelledby="v2-signals-heading">
        <div className={styles.sectionLead}><p id="v2-signals-heading">Recent work</p></div>
        <div className={styles.signalGrid}>
          {homeSignals.map((signal) => (
            <Link href={signal.href} className={styles.signal} key={signal.code}>
              <span className={styles.signalCode}>{signal.code}</span>
              <ArrowUpRight size={22} aria-hidden="true" />
              <strong>{signal.title}</strong>
              <span className={styles.signalDetail}>{signal.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.history} aria-labelledby="v2-history-heading">
        <div className={styles.historyHeading}>
          <div><p className={styles.kicker}>History log / 2000-2026</p><h2 id="v2-history-heading">A timeline of an engineer.</h2></div>
          <Link href="/work" className={styles.experience} aria-label={`${profile.experience.years} ${profile.experience.label}. View work`}><strong>{profile.experience.years.padStart(2, "0")}</strong><span>{profile.experience.label}</span></Link>
        </div>
        <ol className={styles.timeline}>
          {profile.history.map((entry) => (
            <li key={entry.year}>
              <div className={styles.timelineMeta}><time>{entry.year}</time><span>{entry.code}</span></div>
              <h3>{entry.title}</h3>
              <p>{entry.detail}</p>
            </li>
          ))}
        </ol>
        <Link className={styles.recordLink} href="/work">Full professional record <ArrowRight size={17} aria-hidden="true" /></Link>
      </section>

      <section className={styles.evidence} aria-labelledby="v2-evidence-heading">
        <div className={styles.evidenceHeading}><h2 id="v2-evidence-heading">Selected evidence</h2></div>
        <div className={styles.evidenceGrid}>
          {homeEvidence.map((item, index) => (
            <article className={styles.evidenceItem} key={item.title}>
              <span className={styles.evidenceIndex}>0{index + 1} / 04</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href} target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noopener noreferrer" : undefined}>Open record <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>AJDER LAB</span>
        <nav aria-label="Homepage versions"><Link href="/">V1</Link><Link href="/v2" aria-current="page">V2</Link><Link href="/v3">V3</Link></nav>
        <div><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>
      </footer>
    </div>
  );
}
