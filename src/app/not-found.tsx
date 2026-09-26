import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() { return <section className="not-found shell"><p className="eyebrow">ERROR / 404</p><h1>Record not found.</h1><p>The requested path is not part of the current site index.</p><Link className="primary-link" href="/"><ArrowLeft aria-hidden="true" size={18} /> Return home</Link></section>; }
