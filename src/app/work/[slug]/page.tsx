import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "@/content/projects";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <article className="case-study shell">
      <Link className="back-link" href="/work"><ArrowLeft aria-hidden="true" size={17} /> All work</Link>
      <header className="case-head"><p className="eyebrow">{project.id}</p><h1>{project.title}</h1><p>{project.summary}</p></header>
      <dl className="spec-strip">
        <div><dt>Role</dt><dd>{project.role}</dd></div>
        <div><dt>System</dt><dd>{project.system}</dd></div>
        <div><dt>Period</dt><dd>{project.period}</dd></div>
      </dl>
      <div className="case-layout">
        <aside><p className="eyebrow">Technology</p><ul className="tech-list">{project.systems.map((item) => <li key={item}>{item}</li>)}</ul></aside>
        <div className="case-body">
          <section><p className="eyebrow">Challenge</p><h2>{project.challengeTitle}</h2><p>{project.challenge}</p></section>
          <section><p className="eyebrow">Built</p><h2>{project.builtTitle}</h2><p>{project.built}</p></section>
          <section><p className="eyebrow">Technical decisions</p><h2>{project.decisionsTitle}</h2><ol>{project.decisions.map((item) => <li key={item}>{item}</li>)}</ol></section>
          <section><p className="eyebrow">{project.noteLabel}</p><p>{project.note}</p></section>
        </div>
      </div>
    </article>
  );
}
