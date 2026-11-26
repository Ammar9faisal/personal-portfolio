# The Inventor's Workshop

An interactive portfolio inspired by my love for software engineering, robotics, and building things.

I'm **Ammar Faisal**, a Software Engineering student at York University. Instead of a traditional portfolio, I built a cozy, animated inventor's workshop where visitors can explore my projects, skills, and experience.

### Features
- Interactive pixel-art workshop with animated objects and ambient effects
- Measured CRT camera zoom and subtle power-on effect for every workstation entry point, with reverse zoom on return and reduced-motion fades
- **AmmarOS**, a custom desktop interface for exploring my portfolio
- Project case studies, technical skills, experience, and resume
- Interactive robot, chessboard, and simulated 3D printer

### Tech Stack
Next.js, React, TypeScript, Tailwind CSS, and Motion.

### Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

*Built with curiosity and a love for making things work.*

### Validation

Run `npm run typecheck` and `node --experimental-strip-types --test tests/*.test.mjs` (Node 22.6+). Stop the dev server before running `npm run build`.

The camera animates the existing scene rather than a duplicate image. It measures the monitor glass after responsive cropping, restores the originating control and scroll position on return, and safely completes if skipped or resized mid-transition.

Ambient overlays share the source artwork's 1672 × 941 coordinates. CRT scanlines stay clipped to the glass; only the robot's small dark eye sockets are masked for gaze and blinking. Irregular robot pauses use a low-frequency timer, while lamp variation and electronics LEDs use CSS. Motion pauses offscreen, in a hidden tab, or inside AmmarOS; reduced motion leaves still ambience and skips the pre-zoom glance. Separate transparent head/face sprites and a clean background would be needed for actual robot head movement.

### Vercel preparation

See [DEPLOYMENT.md](DEPLOYMENT.md) for the exact project settings, validation commands, asset checks, and remaining content. No environment variables are needed by the current portfolio. Deployment has not been performed.
