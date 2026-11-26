"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Folder, Search } from "lucide-react";
import { projects } from "@/data/portfolio";
import { filterProjects } from "@/lib/portfolio";
import ApplicationLayout from "./ApplicationLayout";
import ProjectDetail from "./ProjectDetail";
import styles from "./Workstation.module.css";

export default function ProjectsApplication({ selected, onSelect, query, onQuery, status, onStatus }: {
  selected: string; onSelect: (id: string) => void; query: string; onQuery: (value: string) => void; status: string; onStatus: (value: string) => void;
}) {
  const deferredQuery = useDeferredValue(query);
  const searching = deferredQuery !== query;
  const filtered = filterProjects(projects, deferredQuery, status);
  const project = filtered.find(project => project.id === selected) || filtered[0];
  const index = filtered.findIndex(item => item.id === project?.id);
  const detail = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  const [selection, setSelection] = useState(0);

  function navigate(id: string) {
    pendingFocus.current = true;
    onSelect(id);
    setSelection(value => value + 1);
  }

  useEffect(() => {
    if (pendingFocus.current) {
      detail.current?.querySelector<HTMLHeadingElement>('h2')?.focus({ preventScroll: true });
      detail.current?.scrollIntoView({ block: "nearest" });
      pendingFocus.current = false;
    }
  }, [project?.id, selection]);

  const projectNavigation = project && <nav className={styles.projectPagination} aria-label="Navigate case studies">
    <button className={styles.secondaryButton} disabled={index <= 0} onClick={() => navigate(filtered[index - 1].id)} aria-label="Previous project">Previous</button>
    <span>{index + 1} of {filtered.length} · {project.name}</span>
    <button className={styles.secondaryButton} disabled={index >= filtered.length - 1} onClick={() => navigate(filtered[index + 1].id)} aria-label="Next project">Next</button>
  </nav>;

  return <ApplicationLayout eyebrow="Engineering archive" title="Projects" description="Project work in AI, computer vision, and full-stack engineering.">
    <div className={styles.searchbar}>
      <label><Search size={17}/><span className={styles.srOnly}>Search projects</span><input aria-label="Search projects" type="search" value={query} onChange={event => onQuery(event.target.value)} placeholder="Search project, technology, or problem"/></label>
      <label className={styles.filterLabel}><span className={styles.srOnly}>Project status</span><select aria-label="Project status" value={status} onChange={event => onStatus(event.target.value)}>{["All projects", "Completed", "In development", "Needs review"].map(value => <option key={value} value={value}>{value === "In development" ? "In Development" : value}</option>)}</select></label>
    </div>
    <p className={styles.resultCount} role="status">{searching ? "Updating results…" : `${filtered.length} ${filtered.length === 1 ? "project" : "projects"}`}</p>
    <div aria-busy={searching}>
      {project ? <div className={styles.projectWorkspace}>
        <nav className={styles.projectList} aria-label="Project archive">{filtered.map(item => <button key={item.id} aria-current={item.id === project.id ? "true" : undefined} onClick={() => navigate(item.id)}><Folder size={17}/><span><strong>{item.name}</strong><small>{item.category}</small>{item.status !== "Completed" && <small>{item.status === "In development" ? "In Development" : "Details pending"}</small>}</span></button>)}</nav>
        <div ref={detail} className={styles.caseStudy}>{projectNavigation}<ProjectDetail project={project}/></div>
      </div> : <div className={styles.emptyState}><Search size={26}/><h2>{projects.length ? "No matching projects" : "Project archive coming soon"}</h2><p>{projects.length ? "Try a different technology, project name, or status." : "Project records will appear here once supplied."}</p>{projects.length > 0 && <button className={styles.secondaryButton} onClick={() => { onQuery(""); onStatus("All projects"); }}>Clear filters</button>}</div>}
    </div>
  </ApplicationLayout>;
}
