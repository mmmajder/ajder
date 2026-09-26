export default function ResearchLoading() {
  return (
    <div className="research-route-loading shell" role="status" aria-live="polite">
      <span className="mono">RESEARCH / 001</span>
      <h1>Two waves.<br />Seven months apart.</h1>
      <div className="research-loading-line" aria-hidden="true" />
      <p>Loading the research…</p>
    </div>
  );
}
