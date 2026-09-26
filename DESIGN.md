# AJDER / Developer Lab - Design Context

## North Star

A personal engineering lab, not a résumé template: visitors should see evidence of building, researching, and documenting within the first minute.

## Register

Editorial research notebook crossed with a calibrated technical instrument. Precise and curious; never cyberpunk, corporate, or ornamental.

## Signature

The **signal rail** is a responsive trace connecting BUILD, RESEARCH, and SIDE QUESTS. It encodes the site's three real modes and becomes a navigation device on the homepage, not background decoration.

## Tokens

Runtime owner: `src/app/globals.css`.

- Bench: `#111411`
- Raised bench: `#181c18`
- Ink: `#f1f4ee`
- Muted graphite: `#a1aaa2`
- Hairline: `#353b35`
- Calibration blue: `#91a2ff`
- Deep blue panels: `#222d5a`

The main site uses this dark palette only. The v2 and v3 concepts maintain their own palettes.

## Typography

- Primary: Instrument Sans - editorial headings and body copy.
- Utility: IBM Plex Mono - IDs, status, commands, dates, and measurements.
- Large text is compact and line-broken with intent; long-form text stays under 68 characters per line.
- Utility labels, captions, and chart annotations use a 12px minimum at the default root size.

## Geometry & Layout

- 4/8px spacing rhythm with broad 64–128px section gaps.
- Square technical panels with occasional 999px control geometry; no card soup.
- 12-column desktop grid; single-column reading flow below 760px.
- Thin rules organize evidence. Blue is reserved for links, selected state, and the signal rail.

## Motion

- One homepage load sequence and short state transitions only.
- 180ms controls, 420ms section reveals, ease-out.
- `prefers-reduced-motion` disables non-essential movement.

## Interaction

- Minimum 44px pointer targets, visible 2px focus rings, semantic links/buttons.
- Command palette opens with Ctrl/Cmd+K; terminal is optional and never primary navigation.
- Both overlays close with Escape and restore focus to their trigger.

## Anti-references

- No fake editor or terminal shell as the page frame.
- No neon hacker green, gradients, glass cards, skill meters, or generic hero portrait.
- No invented outcomes, employers, dates, or research findings.
