import type { ReactNode } from "react";
import styles from "./Workstation.module.css";

export default function ApplicationLayout({ eyebrow, title, description, children }: {
  eyebrow: string; title: string; description?: string; children: ReactNode;
}) {
  return <div className={styles.applicationLayout}>
    <header className={styles.applicationHeading}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1>{description && <p>{description}</p>}</header>
    {children}
  </div>;
}
