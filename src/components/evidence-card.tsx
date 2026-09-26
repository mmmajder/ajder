import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

type Props = { id: string; title: string; description: string; meta: string; href: Route | `https://${string}`; featured?: boolean };

export function EvidenceCard({ id, title, description, meta, href, featured }: Props) {
  const isExternal = href.startsWith("https://");

  return (
    <article className={`evidence-card${featured ? " featured" : ""}`}>
      {/* <div className="evidence-meta"><span className="mono">{id}</span><span className="mono">{meta}</span></div> */}
      <h3>{title}</h3>
      <p>{description}</p>
      <Link
        className="text-link"
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        Open record <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}
