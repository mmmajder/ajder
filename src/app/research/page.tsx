import type { Metadata } from "next";
import ResearchDashboard from "@/components/research-dashboard";
import { research } from "@/content/research";

export const metadata: Metadata = { title: "AI Assistants and Developer Work", description: research.summary };

export default function ResearchPage() {
  return <ResearchDashboard />;
}
