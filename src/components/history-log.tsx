import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";

export function HistoryLog() {
  return (
    <section className="history-section shell" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <p className="eyebrow">History log / 2000-2026</p>
          <h2 id="history-title">A timeline of an engineer.</h2>
        </div>
        <Link className="experience-readout" href="/work" aria-label={`${profile.experience.years} ${profile.experience.label}. View work`}>
          <strong>{profile.experience.years.padStart(2, "0")}</strong>
          <span>{profile.experience.label}</span>
        </Link>
      </div>

      <ol className="history-track">
        {profile.history.map((entry, index) => (
          <li key={entry.year} className={index === profile.history.length - 1 ? "is-current" : undefined}>
            <span className="history-node" aria-hidden="true" />
            <div className="history-meta">
              <time>{entry.year}</time>
              <span>{entry.code}</span>
            </div>
            <h3>{entry.title}</h3>
            <p>{entry.detail}</p>
          </li>
        ))}
      </ol>

      <Link className="history-source" href="/work">
        Full professional record <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </section>
  );
}
