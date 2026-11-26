import { useId, type CSSProperties } from "react";
import CrtActivity from "./CrtActivity";
import { sceneSettings } from "./settings";
import styles from "./WorkshopScene.module.css";

export default function Atmosphere({ reaction, eyes }: { reaction: number; eyes: { gaze: number; blink: boolean } }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={styles.atmosphere} viewBox={`0 0 ${sceneSettings.width} ${sceneSettings.height}`} aria-hidden="true" focusable="false">
      <defs>
        {/* Window mullions, noticeboard, printer and plants remain in front of rain. */}
        <clipPath id={`${id}-window`}>
          <path d="M999 0H1083V59H999Z M1099 0H1233V54H1099Z M1249 0H1383V49H1249Z M1399 0H1517V44H1399Z M999 79L1083 76V175H999Z M1099 74L1233 71V195L1099 198Z M1249 70L1383 65V194H1249Z M1399 64L1517 60V193H1399Z M1099 213H1233V377H1184L1167 344H1099Z M1249 211H1383V245L1360 274V326L1310 307L1270 333H1249Z M1399 210H1517V243H1399Z" />
        </clipPath>
        <clipPath id={`${id}-screen`}>
          <path d="M802 330L920 332L917 429L797 426Z" />
        </clipPath>
        <radialGradient id={`${id}-phosphor`}>
          <stop stopColor="#bad5a1" stopOpacity=".17" />
          <stop offset="1" stopColor="#bad5a1" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-scanlines`} width="4" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 0H4" stroke="#d6e7bd" strokeOpacity=".15" />
        </pattern>
      </defs>
      <g clipPath={`url(#${id}-window)`}>
        {Array.from({ length: sceneSettings.rainCount }, (_, index) => (
          <path
            key={index}
            className={styles.rain}
            d={`M${1008 + ((index * 71) % 510)} ${-140 + ((index * 47) % 530)}l-3 ${9 + (index % 4) * 3}`}
            style={{ animationDelay: `${-(index % 13) * sceneSettings.rainSpreadSeconds}s`, animationDuration: `${sceneSettings.rainSeconds + (index % 5) * sceneSettings.rainSpreadSeconds}s` }}
          />
        ))}
      </g>
      <g className={styles.monitorGlow}>
        <ellipse cx="856" cy="385" rx="102" ry="100" fill={`url(#${id}-phosphor)`} />
        <g clipPath={`url(#${id}-screen)`}>
          <path d="M795 328H923V431H795Z" fill={`url(#${id}-scanlines)`} />
          <path className={styles.scan} d="M795 329H923V337H795Z" fill="#c4dcaa" fillOpacity=".075" />
          <CrtActivity/>
          <g className={styles.crtPrompt} stroke="#bccf9c" strokeWidth="2" opacity=".3">
            <path d="m811 398 4 3-4 3m10 0h7" />
          </g>
        </g>
      </g>
      {/* Only the two dark eye sockets are reconstructed, not the face or head. */}
      <g data-robot-gaze={eyes.gaze} data-robot-blink={eyes.blink}>
        <g fill="#091619">
          <rect x="1087" y="399" width="16" height="25" rx="5"/>
          <rect x="1120" y="401" width="16" height="25" rx="5"/>
        </g>
        <g className={styles.robotEyes} style={{ "--gaze": eyes.gaze, "--eye-height": eyes.blink ? .08 : 1 } as CSSProperties}>
          <g className={styles.eyeLeft}><path d="M1092 404h5v3h2v8h-2v3h-5v-2h-2v-9h2Z"/></g>
          <g className={styles.eyeRight}><path d="M1125 406h5v2h2v9h-2v2h-5v-2h-2v-9h2Z"/></g>
        </g>
      </g>
      {reaction > 0 && <g key={reaction} className={styles.robotReaction} fill="none" stroke="#9cded9" strokeWidth="1.5">
        <ellipse cx="1112" cy="412" rx="45" ry="30"/><path d="m1100 352 2-7m34 5 3-6"/>
      </g>}

    </svg>
  );
}

