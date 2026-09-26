import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/research", "/side-quests", "/about", ...projects.map((p) => `/work/${p.slug}`)].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : 0.7 }));
}
