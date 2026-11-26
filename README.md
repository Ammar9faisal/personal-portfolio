# The Inventor's Workshop

A runnable **starter prototype** for Ammar Faisal's cozy workshop portfolio. Not a finished or validated production website.

## Start

```sh
npm install
npm run dev
```
Open http://localhost:3000. (Node.js 20+ recommended.)

## What's in the starter
- Pixel-art workshop scene in `public/workshop/scene.webp`, generated for this project.
- Responsive homepage, hotspots, navigation shortcuts.
- Modular scene overlays: window-clipped rain, warm lamp glow, and gentle CRT activity.
- Shared 1672×941 artwork coordinates for effects and hotspots, with labeled mobile object controls.
- Hover/keyboard feedback, dismissible object notes, pause control, and reduced-motion support.
- Robot blink masks and a brief greeting response, a robotics dialogue with an Experience action, a looping simulated knight print with Pause/Resume controls, and an illustrative chessboard with selectable squares and keyboard navigation.
- Optional synthesized rain audio, off by default. Motion and audio suspend when the artwork is offscreen or the document is hidden; audio resources close when leaving the scene.
- Short skippable boot transition, working workstation shell.
- Projects, skills, experience, about, resume and contact views.
- Draft portfolio content in `src/data/portfolio.ts` and reference notes in `portfolio-data.md`.
- AmmarOS desktop with independent application windows, taskbar restore/focus, minimize/close/maximize controls, and bounded title-bar dragging. Focus a window title and use arrow keys to move it with a keyboard. Mobile uses full-size application panels and excludes covered apps from keyboard focus.
- Searchable project archive with status filters and reusable case studies, a career timeline, project-linked skills, education, resume, and verified-link-only contact layouts.
- Codex development brief in `AGENTS.md` and milestone prompts in `CODEX_PROMPTS.md`.

## Important limitations to tackle next
- The room uses **one unchanged background image** with lightweight SVG/CSS atmosphere. Objects do not have independently animatable transparent layers.
- Robot responses use small eye masks/light overlays. The printer masks only its chamber interior and reconstructs the bed, carriage, and knight in pixel-style SVG; its original enclosure is untouched. No second opaque printer or whole-object stretching is used.
- The chess panel is a static starting-position illustration with square selection, not a chess engine or an implemented pawnVision demo. Both chess and printer panels link to its explicitly planned case study.
- Scene coordinates and object bounds live in `src/components/workshop/settings.ts`; layout and animation live in `WorkshopScene.module.css`. The image, effects, and targets share one scaled plane so cropping cannot shift them independently.
- The scene-to-OS transition is only a timed loading step; zoom and CRT effects must be added.
- Project cover graphics are placeholders; add real screenshots and verified demo links.
- The resume and socials links are intentionally empty. Add verified links to `src/data/portfolio.ts` and put your real resume in `public/resume.pdf` before enabling download.
- Portrait, project metrics, OPS employment dates and Clarus details need user review.

## Editing the workstation

- `src/components/workstation/Workstation.tsx` owns application state, focus order, and the desktop/taskbar.
- `Window.tsx`, `DesktopIcon.tsx`, `ApplicationLayout.tsx`, and `Navigation.tsx` provide reusable shell components; `apps.tsx` is the application registry.
- `Applications.tsx` renders the core apps; `ProjectsApplication.tsx` owns archive search, status filtering, and previous/next navigation. `ProjectDetail.tsx` provides reusable case studies with problem, contribution, workflow, challenges/solutions, outcome, image loading/error states, and verified links.
- All personal content stays in `src/data/portfolio.ts`. Adding or removing a project updates archive search and skill links automatically.
- Project records follow the requested priority order. `screenshot` accepts a real public asset path, alt text, and optional caption. There are currently no project screenshots in `public/projects`; placeholders are intentional.
- Optional project `links.github`, `links.demo`, and `links.devpost`, plus profile destinations in `publicLinks`, require a user-confirmed URL and `verified: true`. Missing or malformed destinations do not render as links. Unverified dates are omitted; planned workflows and candidate technologies remain labeled.
- Resume checks for a real PDF at the configured resume link or `/resume.pdf`; no download is enabled for a missing file or a non-PDF response.
- `npm run typecheck` runs TypeScript independently; `npm run build` creates the production build. The starter's lint command still needs ESLint and a configuration before use.
- Targeted data/search/link regression checks can be run on Node 22.6+ with `node --experimental-strip-types --test tests/portfolio.test.mjs` (no test dependencies required).

## Workshop interaction tuning

- `src/components/workshop/settings.ts` centralizes source coordinates, animation timing, rain count, reaction duration, and audio volume.
- `Atmosphere.tsx` owns decorative SVG effects; `WorkshopPanel.tsx` and `ChessPreview.tsx` own the optional scene panels. `src/data/workshop.ts` contains editable dialogue, with role details sourced from portfolio data.
- Click or keyboard-activate the robot, printer, or chessboard. Escape closes the panel and restores focus to the trigger; mobile uses the labeled object controls and inline panels. The computer, toolkit, and recruiter shortcuts retain their existing workstation destinations.
- Rain audio is generated locally with Web Audio after the Enable button is pressed. Mute suspends processing; leaving the scene closes the audio context. No microphone, network audio, chatbot, or LLM is used.
- Further fidelity could use a clean robot face/head layer and original-texture printer chamber, carriage, bed, and knight sprites with a clean interior plate. The current printer works using a bounded SVG reconstruction. A licensed rain/workshop recording could replace the optional synthesized texture; none is required for current functionality.
- Run both content and workshop regression checks with `node --experimental-strip-types --test tests/*.test.mjs`.

## Suggested workflow
Give Codex the repo. Use `CODEX_PROMPTS.md` prompts one milestone at a time. Review the output after each step. Do not ask Codex to invent design assets or personal details.

## Printer simulation

- `printerSimulation.ts` owns the 18-second build, 3.5-second completion hold, and 1.5-second reset, plus source-coordinate component poses. `PrinterLayer.tsx` clips the reconstruction to the existing chamber. The enclosure, feet, surrounding art, and scene alignment remain unchanged.
- `printerStore.ts` provides one 30-fps clock shared by geometry, layer reveal, progress, and status. Pause cancels frame scheduling; Resume continues from the stored elapsed point. The job survives Inspect Print / Back to Workshop and suspends while AmmarOS is open.
- The compact controls sit left of the printer on desktop so the sequence stays visible. Mobile uses the existing inline panel. Inspect Print opens pawnVision, explicitly In Development.
- Reduced motion stops automatic mechanical movement and offers manual layer stepping. Hidden documents and inactive scenes suspend scheduling; there is no wall-clock catch-up when returning.
- The original baked-in head, bed, and finished knight are occluded inside the chamber before reconstructed components are drawn. Original-texture transparent sprites would improve texture fidelity but are not required for the current sequence.
