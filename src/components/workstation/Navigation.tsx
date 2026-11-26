import { applications, type AppId } from "./apps";
import styles from "./Workstation.module.css";

export default function Navigation({ current, onOpen }: { current: AppId; onOpen: (id: AppId) => void }) {
  return <nav className={styles.appNavigation} aria-label="Application navigation">
    {applications.map(app => <button key={app.id} onClick={() => onOpen(app.id)} aria-current={current === app.id ? "page" : undefined}>{app.label}</button>)}
  </nav>;
}
