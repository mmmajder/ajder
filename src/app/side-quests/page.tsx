import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sideQuests } from "@/content/side-quests";

export const metadata: Metadata = {
  title: "Side quests",
  description: "A reverse-chronological record of Milan Ajder’s professional side quests, programs, certifications, community work, and research.",
};

export default function SideQuestsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Side quests / Professional"
        title="The work around the work."
        intro="Programs, certifications, research, organizing, and the communities that shaped how I build."
      />
      <section className="shell side-quests-index" aria-labelledby="side-quests-title">
        <ol className="quest-timeline">
          {sideQuests.map((quest, index) => (
            <li key={`${quest.date}-${quest.title}`}>
              <article className="quest-row">
                <div className="quest-date">
                  <span className="quest-node" aria-hidden="true" />
                  <span className="mono">{quest.date}</span>
                </div>
                <div className="quest-main">
                  <h2>{quest.title}</h2>
                  <p>{quest.description}</p>
                  <ul className="quest-tags" aria-label="Tags">
                    {quest.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <div className="quest-links">
                  {quest.links.map((link) => {
                    const external = !link.href.startsWith("/");
                    return external ? (
                      <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                        {link.label}<ArrowUpRight aria-hidden="true" size={16} />
                      </a>
                    ) : (
                      <Link href={link.href as Route} key={link.href}>
                        {link.label}<ArrowUpRight aria-hidden="true" size={16} />
                      </Link>
                    );
                  })}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
