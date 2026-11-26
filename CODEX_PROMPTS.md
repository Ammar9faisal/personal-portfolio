# Codex milestone prompts — paste one at a time

## 0. Initial audit (start here)
Read AGENTS.md, portfolio-data.md, README.md, and inspect this Next.js project. Run `npm install` and `npm run build`, resolve build errors if any. Launch the dev server and inspect desktop and mobile behavior if browser tooling is available. Preserve functionality, the warm original workshop art, and current data. Give me a short inventory of what exists and the biggest issues. Do not redesign the OS yet.

## 1. Interactive scene (first major pass)
Upgrade the existing pixel-art workshop homepage to feel like a living indie game room. Preserve the supplied scene's look. Add subtle atmospheric movement (rain over the window region, lamp glow, monitor light) with lightweight overlays, not heavy canvas effects everywhere. Use image-based transparent layers only if assets are actually supplied; never duplicate the existing robot/printer in the background with opaque copies. Improve hotspot mapping with one shared 1672x941 coordinate system that handles scaling and cropping precisely. Add clear on-hover focus feedback and simple object labels. Make accessible/mobile fallbacks. Show the result and stop after testing.

## 2. Computer zoom + boot
Implement a smooth click-to-zoom transition centered on the computer monitor using measured coordinates in the original image. The image is 1672x941, and the monitor is approximately x 772–935, y 302–450. The transition must work responsively and respect prefers-reduced-motion. End with a tasteful CRT power-on screen with 1–2 seconds max, skippable. Then render the existing workstation view. Don't change the workstation UI in this pass.

## 3. Visual redesign of workstation
Refine Ammar / Workstation as a coherent *original bespoke inventor's engineering system*. Avoid the Mac/Windows clone aesthetic; don't make a green monochrome terminal or generic neon/glass dashboard. Make it sophisticated, readable and functional with charcoal, muted olive, parchment, subtle amber highlights and intentional typography. Preserve recognizable Projects, Experience, Skills, About, Resume and Contact navigation. Use a consistent component system. Strong desktop and mobile layouts; ensure case studies are easy to read. Use screenshots to compare and iterate; preserve functionality.

## 4. Real content and case studies
Read portfolio-data.md and data/portfolio.ts. Refactor the project detail view to support sections: Overview, Problem, What I Built, Architecture, Challenges, Tech Stack, Demo/Code. Data-drive everything. Keep unknown sections visibly as draft placeholders in development, but don't publish them. DO NOT invent outcome metrics, links or responsibilities. Include SkillForge, NeuroGait, Dash2Dorm, EunoiaHub, and pawnVision (in development). Ask me for any missing facts when essential rather than guessing.

## 5. Interactive personality
Add tasteful optional actions: the desk robot reacts with a blink/short message, chessboard opens pawnVision, printer offers a concise hardware note, tools display robotics-related experience. Add small discovery details but keep recruiter shortcuts prominent. Animations should be lightweight, purposeful and disabled/reduced for motion-sensitive users. No heavy 3D rendering.

## 6. QA and release preparation
Run lint/typecheck/build. Test navigation, project routes, desktop/mobile layout, keyboard access, loading/boot skip, reduced motion, image performance and accessibility. Verify all biography info from my review. Confirm placeholders are not presented as achievements. Never deploy without my explicit approval. Summarize remaining blockers and exact next steps.
