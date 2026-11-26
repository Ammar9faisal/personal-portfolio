import type { applications } from "./apps";
import styles from "./Workstation.module.css";

export default function DesktopIcon({ app, onOpen }: { app: (typeof applications)[number]; onOpen: () => void }) {
  const Icon = app.icon;
  return <button className={styles.desktopIcon} onClick={onOpen} aria-label={`Open ${app.label}`}>
    <span className={styles.iconTile}><Icon size={25} strokeWidth={1.5}/></span>
    <strong>{app.label}</strong><small>{app.description}</small>
  </button>;
}
