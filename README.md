# AJDER / Developer Lab

Milan Ajder’s personal software engineering and research portfolio, built with Next.js App Router and TypeScript.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

`NEXT_PUBLIC_SITE_URL` defaults to `https://ajder.dev` and controls canonical social metadata, `sitemap.xml`, and `robots.txt`. Copy `.env.example` to `.env.local` if you need to override it locally.

## Deploy to Cloudflare Pages

This app is configured as a Next.js static export. A production build writes the site to `out/`.

1. Put this directory in a GitHub or GitLab repository and connect it under **Cloudflare → Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Select the **Next.js (Static HTML Export)** preset. Use `pnpm build` as the build command and `out` as the output directory.
3. Set the Pages build environment variable `PNPM_VERSION=11.19.0`. Use Node.js 22 or newer. `NEXT_PUBLIC_SITE_URL` already defaults to `https://ajder.dev`.
4. After the first deployment, add `ajder.dev` under **Pages → Custom domains**. Add `www.ajder.dev` there too if you want it to redirect to the main address.
5. Verify `https://ajder.dev`, `https://ajder.dev/sitemap.xml`, and `https://ajder.dev/robots.txt` after DNS and SSL activation.

The export uses unoptimized local images because Next.js's default image optimizer requires a server. If you later add server-only features, switch to a server-capable deployment target.

## Content

Verified content lives in `src/content`. Add projects, research records, and lab entries there rather than hardcoding them into page components. Note metadata lives in `src/content/notes.ts`; article bodies are Markdown files in `src/content/notes/`. Placeholder records are explicitly marked and can be replaced without changing the interface.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The site includes structured metadata, sitemap and robots routes, light/dark themes, responsive layouts, keyboard navigation, a command palette (`Ctrl/Cmd + K`), and an optional navigation terminal.

## Analytics

Create a PostHog project, enable **Cookieless server hash mode** in its Web analytics settings, and set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in the production environment. Copy both values from that project's settings; the host must match its region. Tracking starts on production builds when both values are present. The site records page views and route changes, plus project opens, email and external-link clicks, research finding opens, and research downloads. It uses cookieless tracking without person profiles; session recording is disabled. Do not add personal information to event properties.

In PostHog, use **Web analytics** for visitors, pages, sources, and locations. Create an insight for each custom event (`project_opened`, `contact_clicked`, `outbound_link_clicked`, `research_finding_opened`, `research_chart_downloaded`, `research_exported`) and add useful ones to a dashboard. Filter out your own visits in PostHog's project settings.

For Google Search Console, add the verified production domain as a **Domain property** and add Google's DNS TXT record at the domain provider. This includes all subdomains and protocols. If DNS access is unavailable, create a **URL-prefix property** for the exact production URL and set `GOOGLE_SITE_VERIFICATION` to the `content` value of Google's HTML verification tag, then deploy before clicking **Verify**. Submit the existing `/sitemap.xml` in Search Console after verification. The verification value should remain configured so Google can recheck ownership.
