import { useId, type CSSProperties } from "react";
import { sceneSettings } from "./settings";
import styles from "./WorkshopScene.module.css";

/** Source-coordinate light only: the original lamp/electronics artwork stays intact. */
export default function Lighting() {
  const id = useId().replace(/:/g, "");
  return <svg className={styles.lighting} viewBox={`0 0 ${sceneSettings.width} ${sceneSettings.height}`} aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={`${id}-warm`}><stop stopColor="#ffc16b" stopOpacity=".5"/><stop offset="1" stopColor="#ffc16b" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-shade`}><stop stopColor="#24170f" stopOpacity=".6"/><stop offset="1" stopColor="#24170f" stopOpacity="0"/></radialGradient>
      {sceneSettings.leds.map((led, i) => <radialGradient key={i} id={`${id}-led-${i}`}><stop stopColor={led.color} stopOpacity=".45"/><stop offset="1" stopColor={led.color} stopOpacity="0"/></radialGradient>)}
    </defs>
    <g data-ambient-lamp="desk">
      <g className={styles.lampDim}>
        <ellipse cx="784" cy="365" rx="185" ry="150" fill={`url(#${id}-shade)`}/>
        <ellipse cx="823" cy="506" rx="225" ry="42" fill={`url(#${id}-shade)`}/>
        <path d="M746 286L774 278L811 274L827 276L812 287L780 294L746 293Z" fill="#392416"/>
      </g>
      <g className={styles.lamplight}>
        <ellipse cx="784" cy="365" rx="185" ry="150" fill={`url(#${id}-warm)`}/>
        <ellipse cx="823" cy="506" rx="225" ry="42" fill={`url(#${id}-warm)`}/>
        <path d="M750 287L775 280L810 276L822 277L810 285L779 292L750 291Z" fill="#ffe1a1" fillOpacity=".55"/>
      </g>
    </g>
    <g data-ambient-lamp="hanging" style={{ "--lamp-duration": `${sceneSettings.hangingLampSeconds}s`, "--lamp-delay": `${sceneSettings.hangingLampDelaySeconds}s` } as CSSProperties}>
      <g className={styles.lampDim}>
        <ellipse cx="1610" cy="178" rx="105" ry="140" fill={`url(#${id}-shade)`}/>
        <path d="M1598 138H1623L1625 155L1631 171V185L1622 197H1602L1591 185V171L1597 155Z" fill="#392416" fillOpacity=".65"/>
      </g>
      <g className={styles.lamplight}>
        <ellipse cx="1610" cy="178" rx="105" ry="140" fill={`url(#${id}-warm)`}/>
        <path d="M1602 141H1619L1621 159L1627 172V183L1619 193H1605L1597 183V173L1602 158Z" fill="#ffda86" fillOpacity=".26"/>
      </g>
    </g>
    {sceneSettings.leds.map((led, i) => <g key={i} data-electronics-led={i} className={styles.electronicsLed} style={{ animationDuration: `${led.seconds}s`, animationDelay: `${led.delay}s` }}>
      <ellipse cx={led.x} cy={led.y} rx="8" ry="7" fill={`url(#${id}-led-${i})`}/>
      <rect x={led.x - 2.5} y={led.y - 1.75} width="5" height="3.5" fill={led.color}/>
      <rect x={led.x - .75} y={led.y - .75} width="1.5" height="1.5" fill="#fff5d7" fillOpacity=".8"/>
    </g>)}
  </svg>;
}
