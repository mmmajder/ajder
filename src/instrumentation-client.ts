import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (process.env.NODE_ENV === "production" && token && host) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: "history_change",
    cookieless_mode: "on_reject",
    opt_out_capturing_by_default: true,
    person_profiles: "never",
    disable_session_recording: true,
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const projectLink = event.target.closest<HTMLElement>("[data-analytics-project]");
    if (projectLink?.dataset.analyticsProject) {
      posthog.capture("project_opened", { project: projectLink.dataset.analyticsProject });
    }

    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    if (link.protocol === "mailto:") {
      posthog.capture("contact_clicked", { method: "email" });
    } else if (link.origin !== window.location.origin && ["http:", "https:"].includes(link.protocol)) {
      posthog.capture("outbound_link_clicked", { destination: link.hostname });
    }
  });
}
