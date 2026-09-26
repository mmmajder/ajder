import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest { return { name: "AJDER", short_name: "AJDER", description: "Software, research, and professional side quests by Milan Ajder.", start_url: "/", display: "standalone", background_color: "#111411", theme_color: "#111411" }; }
