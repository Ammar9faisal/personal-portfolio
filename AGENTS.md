# The Inventor's Workshop — Codex instructions

## Product
Build a memorable but recruiter-usable software engineering portfolio for Ammar Faisal. The opening screen is a cozy pixel-art inventor's workshop. Clicking the computer boots into **Ammar / Workstation**, an original, clean engineering desktop. This is **not** Minecraft and **not** a Windows/Mac replica.

## Current repository
Already includes a runnable Next.js prototype with a scene image, interactive object hotspots, boot overlay, responsive workstation UI, and example project data. **Inspect and improve it; do not throw away working code.**

## Visual direction
- Scene: handcrafted, cozy, warm amber lamp lighting, rainy window, readable at desktop resolutions; warm and slightly moody.
- Computer UI: restrained technical workstation; charcoal/olive/sand colors, excellent typography and whitespace. It should feel like a bespoke tool an engineer built, not a vintage OS clone, glossy sci-fi HUD, or generic SaaS dashboard.
- Animate with restraint. The room must feel alive: subtle rain/light, robot blinking, printer movement, monitor glow. No unnecessary particles or flashy gradients.
- Preserve image aspect ratio. Hotspots must map accurately to scene artwork on resize. The current full-background/percentage hotspot approach is a **prototype**, not final layered animation.

## Functionality
- Main scene with clickable computer, robot, printer, chessboard and tools.
- Clicking computer should smoothly zoom into its display, do a short skippable boot, then open the workstation.
- Persistent clearly labeled Projects/Experience/Resume shortcuts on home page.
- Workstation apps: Home, Projects, Experience, Skills, About, Resume, Contact.
- Project case studies should be rich but factual: problem, approach, architecture, outcomes, visual evidence and actual verified links. Extend data types for these sections when implemented.
- Mobile: make shortcuts and portfolio immediately usable; don't depend on hotspot hunting.
- Reduced motion accessibility and keyboard focus/controls.

## Content integrity
- Read `portfolio-data.md` and `src/data/portfolio.ts`.
- Never invent employment dates, measurable impact, technical implementation, personal links or project demos. Unknown links remain absent, and incomplete projects are labelled.
- Planned `pawnVision` is not a completed product.
- Don't add a fabricated resume: user must provide a verified PDF.
- Keep all content editable independently of the visual environment.

## Development
- Next.js App Router / TypeScript / CSS / Motion as needed.
- Keep scene animation components modular, avoid pulling in 3D engines.
- Break into small testable milestones; run `npm run build` when practical.
- Do not deploy or publish without permission.
