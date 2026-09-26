"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { ClientControls } from "./client-controls";

const nav = [
  ["Work", "/work"],
  ["Research", "/research"],
  ["Side quests", "/side-quests"],
  ["About", "/about"],
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="AJDER, home">
          <span className="brand-word">AJDER</span><span className="brand-mark">/</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} aria-current={isActive ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <nav className="social-nav" aria-label="Contact and social links">
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin aria-hidden="true" size={19} />
            </a>
            <a href={`mailto:${profile.links.email}`} aria-label="Email Milan">
              <Mail aria-hidden="true" size={19} />
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github aria-hidden="true" size={19} />
            </a>
          </nav>
          <ClientControls />
        </div>
      </div>
    </header>
  );
}
