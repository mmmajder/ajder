# AJDER UX Contract

This contract records shared interaction ownership for application-like routes. The editorial shell remains governed by `DESIGN.md`.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | `src/components/ui/select.tsx` | This contract and `DESIGN.md` | Authored Base UI popup using Ajder tokens | Keyboard operation, focus restoration, popup collision, and trigger-width geometry |

## Research dashboard

- Filters apply consistently to both survey waves; selections within one filter use OR and separate filter groups use AND.
- Search is local, immediate, and always provides a visible clear action when populated.
- The paid-tools open response is grouped into stable product families for comparison; original verbatim responses remain available in an expandable disclosure.
- Loading, refresh, import, warning, empty, and error states remain inside the research page and do not replace global navigation.
- Imported XLSX data stays in the current browser. Reset returns both waves to the bundled source files.
- Chart SVG and filtered CSV exports are user-triggered downloads and never modify the source workbooks.
