import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="mono label">AJDER LAB</p>
        </div>
        <div className="footer-links">
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" size={17} /> LinkedIn</a>
          <a href={`mailto:${profile.links.email}`}><Mail aria-hidden="true" size={17} /> Email</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer"><Github aria-hidden="true" size={17} /> GitHub</a>
        </div>
      </div>
    </footer>
  );
}
