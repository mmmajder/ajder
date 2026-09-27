"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

type ConsentStatus = "granted" | "denied" | "pending";

const analyticsEnabled =
  process.env.NODE_ENV === "production" &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);

export function AnalyticsConsent() {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;
    const frame = requestAnimationFrame(() => {
      const currentStatus = posthog.get_explicit_consent_status();
      setStatus(currentStatus);
      setOpen(currentStatus === "pending");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (status === null) return null;

  function choose(allow: boolean) {
    if (allow) posthog.opt_in_capturing({ captureEventName: false });
    else posthog.opt_out_capturing();
    setStatus(allow ? "granted" : "denied");
    setOpen(false);
  }

  return (
    <div className="analytics-control">
      {open ? (
        <section className="analytics-consent" aria-labelledby="analytics-consent-title">
          <div>
            <p className="analytics-consent-kicker">Site analytics</p>
            <h2 id="analytics-consent-title">Help me understand how this site is used</h2>
            <p>Basic visits are counted without cookies. If you allow analytics cookies, I can also see approximate visitor locations and repeat visits. You can change this choice anytime.</p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" className="analytics-allow" onClick={() => choose(true)}>Allow analytics</button>
            <button type="button" className="analytics-decline" onClick={() => choose(false)}>Keep it cookieless</button>
          </div>
        </section>
      ) : (
        <button type="button" className="analytics-settings" onClick={() => setOpen(true)}>
          Analytics settings
        </button>
      )}
    </div>
  );
}
