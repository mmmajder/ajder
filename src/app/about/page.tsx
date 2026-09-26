import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "About Milan Ajder", description: `${profile.name} is a software engineer based in ${profile.location}.` };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="" title="Hi, I'm Milan." intro={profile.bio} className="about-hero" />
      <section className="shell profile-grid">
        <aside className="profile-card">
          <img
            src="/profile.jpeg"
            alt={profile.name}
            className="profile-image"
          />

          <dl>
            <div>
              <dt>Name</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{profile.role}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>

          <div className="profile-links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub <ExternalLink aria-hidden="true" size={15} />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
        </aside>
        <div className="profile-content">
          <section className="profile-summary"><p className="eyebrow">A bit about me</p><h2>{profile.intro}</h2>{profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <section><p className="eyebrow">Education</p>{profile.education.map((item) => <div className="profile-entry" key={item.institution}><h3>{item.institution}</h3><p>{item.field}</p><span>{item.studies}</span></div>)}</section>
          <section id="certification"><p className="eyebrow">Certification</p>{profile.certifications.map((item) => <div className="profile-entry" key={item}><h3>{item}</h3><span>Credential details can be linked when provided.</span></div>)}</section>
          <section><p className="eyebrow">Selected technologies</p><ul className="system-cloud">{profile.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
      </section>
    </>
  );
}
