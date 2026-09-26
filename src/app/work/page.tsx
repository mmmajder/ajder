import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Work", description: "Milan Ajder's engineering experience, production technologies, and selected software projects." };

const experience = [
  { company: "CodeBridge", period: "2026 — Present", role: "Software engineer", href: "https://www.codebridgehq.com/" },
  { company: "Codolis", period: "2023 — 2026", role: "Software engineer", href: "https://www.codolis.com/" },
] as const;

const productionTechnologies = [
  { area: "Interfaces", technologies: ["React", "Next.js", "Angular", "TypeScript", "Flutter"] },
  { area: "Services", technologies: ["Node.js", "Python", "FastAPI", "GraphQL", "Firebase"] },
  { area: "Data & infrastructure", technologies: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Docker"] },
] as const;

export default function WorkPage() {
  return (
    <>
      <PageHeader
        className="work-hero"
        eyebrow=""
        title={<><span>What I’m building.</span><span>What I’ve built.</span></>}
        intro="A record of platforms I have helped shape across operations, automation, identity, sport, compliance, and mobile product work."
      />
      <section className="shell records" aria-label="Selected projects">
        <div className="records-heading"><p className="eyebrow">Projects / Selected systems</p><h2>Selected work.</h2></div>
        {projects.map((project) => (
          <Link href={`/work/${project.slug}`} className="record-row" key={project.slug} data-analytics-project={project.slug}>
            <div className="record-meta">
              <span className="mono">{project.id}</span>
              <span className="record-period">{project.period}</span>
            </div>
            <div><h2>{project.title}</h2><p>{project.summary}</p></div>
            <ul aria-label="Technologies">{project.systems.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
            <ArrowUpRight aria-hidden="true" size={22} />
          </Link>
        ))}
      </section>
      <section className="shell work-overview" aria-labelledby="experience-title">
        <div className="work-overview-heading">
          <p className="eyebrow">Experience / 2023—Now</p>
          <h2 id="experience-title">Where I build.</h2>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <div className="experience-row" key={item.company}>
              <span className="mono experience-period">{item.period}</span>
              <div>
                <h3><a href={item.href} target="_blank" rel="noopener noreferrer">{item.company}<ArrowUpRight aria-hidden="true" size={20} /></a></h3>
                <p>{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="shell production-stack" aria-labelledby="production-stack-title">
        <div className="work-overview-heading">
          <h2 id="production-stack-title">Technologies I’ve worked with in production.</h2>
        </div>
        <div className="production-stack-groups">
          {productionTechnologies.map((group) => (
            <div className="production-stack-group" key={group.area}>
              <h3 className="mono">{group.area}</h3>
              <ul className="tech-list">{group.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
      <aside className="shell disclosure"><span className="mono">DISCLOSURE / SCOPE</span><p>Most client names and sensitive implementation details remain confidential. These records describe the problem space, my contribution, and the technical shape of the work without exposing protected information.</p></aside>
    </>
  );
}
