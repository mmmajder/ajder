type Props = { eyebrow: string; title: React.ReactNode; intro: string; aside?: React.ReactNode; className?: string };

export function PageHeader({ eyebrow, title, intro, aside, className }: Props) {
  return (
    <header className={`page-hero shell${className ? ` ${className}` : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      <div className="page-intro">
        <p>{intro}</p>
        {aside}
      </div>
    </header>
  );
}
