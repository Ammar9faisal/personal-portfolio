"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImageIcon } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { projectLinks } from "@/lib/portfolio";
import styles from "./Workstation.module.css";

function ProjectImage({ project }: { project: Project }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete) setState(image.current.naturalWidth ? "ready" : "error");
  }, []);
  if (!project.screenshot || state === "error") return <figure className={styles.evidence}>
    <ImageIcon size={30} strokeWidth={1.2} aria-hidden="true"/>
    <figcaption><strong>{state === "error" ? "Screenshot unavailable" : "Screenshot not yet supplied"}</strong><span>{project.name} · visual evidence</span></figcaption>
  </figure>;
  return <figure className={styles.projectFigure} aria-busy={state === "loading"}>
    {state === "loading" && <p role="status" className={styles.imageLoading}>Loading project screenshot…</p>}
    <img ref={image} className={styles.screenshot} src={project.screenshot.src} alt={project.screenshot.alt}
      onLoad={() => setState("ready")} onError={() => setState("error")}/>
    {project.screenshot.caption && <figcaption>{project.screenshot.caption}</figcaption>}
  </figure>;
}

export default function ProjectDetail({ project }: { project: Project }) {
  const links = projectLinks(project);
  const planned = project.status === "In development";
  return <article className={styles.projectDetail}>
    <div className={styles.projectMeta}><span>{project.category}</span><span className={styles.badge} data-status={project.status}>{planned ? "In Development" : project.status}</span></div>
    <h2 tabIndex={-1}>{project.name}</h2><p className={styles.summary}>{project.summary}</p>
    <p className={styles.context}>{project.context || "Project context not yet documented"}</p>
    {planned && <p className={styles.notice}>Planned / in development. The workflow and technologies below describe an intended direction, not completed integrations or results.</p>}
    {project.status === "Needs review" && <p className={styles.notice}>Draft case study. A verified technical description is needed before this project can be presented as completed work.</p>}
    <ProjectImage key={project.id} project={project}/>
    <section><h3>Overview</h3><p>{project.detail}</p></section>
    <section><h3>Problem being solved</h3><p className={!project.problem ? styles.placeholder : undefined}>{project.problem || "Problem statement awaiting project notes."}</p></section>
    <section><h3>My contribution</h3><p className={!project.contribution ? styles.placeholder : undefined}>{project.contribution || "Personal contribution has not yet been documented."}</p></section>
    <section><h3>{planned ? "Proposed workflow" : "Technical workflow"}</h3>
      {project.workflow?.length ? <ol className={styles.workflow}>{project.workflow.map(step => <li key={step}>{step}</li>)}</ol> : <p className={styles.placeholder}>Architecture and workflow details awaiting confirmation.</p>}
    </section>
    <section><h3>{planned ? "Candidate technologies" : "Technologies used"}</h3><div className={styles.tags}>{project.stack.length ? project.stack.map(tech => <span key={tech}>{tech}</span>) : <span>Stack not yet verified</span>}</div></section>
    <section><h3>Engineering challenges & solutions</h3>
      {project.challenges?.length ? project.challenges.map(item => <div key={item.challenge} className={styles.challenge}><h4>{item.challenge}</h4><p>{item.solution}</p></div>) : <p className={styles.placeholder}>Specific engineering challenges and how they were addressed have not yet been supplied.</p>}
    </section>
    <section><h3>Outcome or demonstration</h3><p className={!project.outcome ? styles.placeholder : undefined}>{project.outcome || (planned ? "No completed demonstration or results are claimed for this planned project." : "A demonstration or documented outcome has not yet been supplied.")}</p></section>
    <footer className={styles.detailFooter} aria-label="Verified project links">
      {links.map(link => <a key={link.key} href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={14}/></a>)}
      {!links.length && <p className={styles.placeholder}>GitHub, live demo, and Devpost links will appear once verified destinations are provided.</p>}
    </footer>
  </article>;
}
