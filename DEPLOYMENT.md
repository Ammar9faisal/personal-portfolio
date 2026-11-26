# Vercel deployment preparation

This repository is prepared for Vercel's native Next.js preset. No project has been linked, uploaded, or deployed as part of this work.

## Project settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | Repository root (`.`) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Leave the framework default; do not set `out` or `public` |
| Node.js | `24.x`, declared in `package.json` and `.nvmrc` |
| Environment variables | None required by the current application |

Vercel supports Next.js without a custom `vercel.json`. The Node engine prevents an automatic switch to a different major runtime. See [Vercel's Next.js documentation](https://vercel.com/docs/frameworks/full-stack/nextjs) and [Node version settings](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Reproduce validation locally

```sh
npm ci
npm run typecheck
npm test
npm audit
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Stop any development server before building: development and production builds share `.next`. `npm run start` serves the built app locally; it does not deploy anything.

The pre-build script checks public assets, rejects hidden metadata and private file types, validates the scene's WebP container, checks local project screenshot paths, and checks the PDF signature if `public/resume.pdf` exists. Do not place private files or secrets in `public`: everything there is directly downloadable. Keep environment values in Vercel's environment settings; `NEXT_PUBLIC_` values are public browser data. Environment files and `.vercel/` project state are ignored by Git.

PostCSS is overridden only within Next.js to patched version `8.5.33`; keep the override and lockfile together until a future compatible Next.js release includes a patched dependency. Do not use `npm audit fix --force` to switch framework major versions as a deployment shortcut.

## Content still needed

- A reviewed, real `public/resume.pdf`. The current Resume application deliberately shows “Resume not yet available” and renders no download link or PDF iframe while it is absent. Its availability request receives an expected 404. Adding the PDF enables preview, open, and download on the next build.
- Verified profile, email, repository, and demo destinations in `src/data/portfolio.ts`. Missing destinations remain unavailable.
- Real project screenshots in `public/projects/`, referenced from structured project records. Current case studies use their supplied placeholders.
- Owner review of draft facts in `portfolio-data.md`, particularly dates, role scope, and incomplete project details. pawnVision must remain In Development.

Before a future Git-based deployment, include all intended modified and untracked source files in the commit, especially the transition components, robot idle hook, deployment script, tests, and runtime files. Build success only validates the current local working tree; it does not upload these changes or update a remote repository.

## Verification completed in this checkout

- Clean `npm ci`, TypeScript checks, 13 regression tests, asset checks, and the production build passed.
- `npm audit` reported zero known vulnerabilities after the scoped PostCSS patch.
- Production-mode browser checks passed at 1440 × 1000 and 390 × 844: computer entry, CRT zoom, reverse return, keyboard skip, every core application, project search/filter/empty state, window close/minimize/restore, robot Experience route, chess selection, and paused printer inspection/return.
- Mobile windows remained inside the viewport with no page-level horizontal overflow.
- Resume navigation from the workshop and workstation showed the unavailable state, with no download anchor or PDF iframe. A real PDF download cannot be checked until a resume is supplied.
- Workshop artwork and all referenced production JS/CSS responded with HTTP 200 and the expected content types. Sensitive source paths returned 404.
- No credential-pattern matches were found in the current source, the two existing Git commits, or the 16 built browser assets scanned. No production browser source maps were emitted. Pattern scans do not constitute a guarantee against every possible secret format; no environment values are used by the current source.

All results apply to the local production build. The Vercel-hosted version remains untested because deployment is intentionally deferred.
