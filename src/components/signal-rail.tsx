import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const signals = [
  { code: "BUILD", title: "Software across web and mobile", detail: "Products, systems, and selected technical decisions.", href: "/work", x: 11, y: 45 },
  { code: "RESEARCH", title: "AI-assisted development", detail: "Two survey waves · seven months apart.", href: "/research", x: 50, y: 25 },
  { code: "SIDE QUESTS", title: "Professional side quests", detail: "Programs, certifications, organizing, and community work.", href: "/side-quests", x: 88, y: 58 },
] as const;

export function SignalRail() {
  return (
    <section className="signal" aria-labelledby="signal-title">
      <div className="signal-topline">
        <p id="signal-title" className="eyebrow">Recent work</p>
      </div>
      <div className="signal-board">
        <svg className="signal-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,45 C12,45 14,45 22,45 S29,28 40,28 S53,25 59,25 S65,58 76,58 S88,58 100,58" />
        </svg>
        <div className="signal-items">
          {signals.map((signal) => (
            <Link className="signal-item" href={signal.href} key={signal.code} style={{ "--x": `${signal.x}%`, "--y": `${signal.y}%` } as React.CSSProperties}>
              <span className="signal-node" aria-hidden="true" />
              <span className="mono signal-code">{signal.code}</span>
              <strong>{signal.title}</strong>
              <span>{signal.detail}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
