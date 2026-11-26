import { useId, type CSSProperties } from "react";
import { sceneSettings } from "./settings";
import styles from "./WorkshopScene.module.css";

// Decorative local terminal activity; no real commands, network calls, or announcements.
export default function CrtActivity() {
  const id = useId().replace(/:/g, "");
  return <g transform="translate(810 367)" data-crt-activity style={{ "--terminal-cycle": `${sceneSettings.terminal.cycleSeconds}s` } as CSSProperties}>
    {sceneSettings.terminal.messages.map((message, index) => {
      const timing = { "--terminal-delay": `${index * sceneSettings.terminal.offsetSeconds}s` } as CSSProperties;
      return <g key={message} style={timing}>
        <defs><clipPath id={`${id}-line-${index}`}><rect className={styles.terminalReveal} x="0" y="0" width="90" height="14"/></clipPath></defs>
        <g className={styles.terminalLine} clipPath={`url(#${id}-line-${index})`}>
          <text x="0" y="10" fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace" fontSize="9" fill="#d0e5b4">{message}</text>
        </g>
      </g>;
    })}
  </g>;
}
