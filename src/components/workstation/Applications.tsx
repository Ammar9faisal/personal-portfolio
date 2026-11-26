"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, Folder } from "lucide-react";
import { experience, profile, projects, publicLinks, skills, skillNotes } from "@/data/portfolio";
import { projectsForSkill, verifiedEmail, verifiedUrl } from "@/lib/portfolio";
import ProjectsApplication from "./ProjectsApplication";
import ApplicationLayout from "./ApplicationLayout";
import type { AppId } from "./apps";
import styles from "./Workstation.module.css";

function Resume() {
  const resumeUrl = verifiedUrl(publicLinks.resume) || "/resume.pdf";
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const [previewFailed, setPreviewFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setChecking(true);
    setAvailable(false);
    fetch(resumeUrl, { method: "HEAD", signal: controller.signal }).then(response => {
      if (controller.signal.aborted) return;
      setAvailable(response.ok && Boolean(response.headers.get("content-type")?.includes("application/pdf")));
    }).catch(() => { if (!controller.signal.aborted) setAvailable(false); }).finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => controller.abort();
  }, [resumeUrl]);
  return <ApplicationLayout eyebrow="Professional profile" title="Resume" description={`${profile.role} · AI, computer vision, and full-stack projects.`}>
    {available ? <>
      <div className={styles.resumeActions}><a className={styles.primaryButton} href={resumeUrl} download><Download size={16}/>Download PDF</a><a href={resumeUrl} target="_blank" rel="noreferrer">Open PDF <ExternalLink size={14}/></a></div>
      {previewFailed ? <p className={styles.notice}>The embedded preview is unavailable. Open or download the PDF above.</p> : <iframe className={styles.pdf} title="Ammar Faisal resume PDF" src={resumeUrl} onError={() => setPreviewFailed(true)}/>}
    </> : <div className={styles.emptyState} aria-busy={checking} role="status"><FileText size={38} strokeWidth={1.2}/><h2>{checking ? "Checking resume…" : "Resume not yet available"}</h2><p>{checking ? "Checking whether a PDF is available for preview and download." : "No PDF is currently available to preview or download. A verified resume will appear here once provided."}</p></div>}
  </ApplicationLayout>;
}

export default function Applications({ app, onOpen, selected, onSelect, query, onQuery, status, onStatus }: {
  app: AppId; onOpen: (id: AppId) => void; selected: string; onSelect: (id: string) => void; query: string; onQuery: (value: string) => void; status: string; onStatus: (value: string) => void;
}) {
  if (app === "projects") return <ProjectsApplication selected={selected} onSelect={onSelect} query={query} onQuery={onQuery} status={status} onStatus={onStatus}/>;
  if (app === "resume") return <Resume/>;
  if (app === "home") return <ApplicationLayout eyebrow="A personal engineering space" title="Good ideas start at the workbench." description={profile.introduction}>
    <div className={styles.homeActions}><button className={styles.primaryButton} onClick={() => onOpen("projects")}><Folder size={17}/>Browse projects</button><button className={styles.secondaryButton} onClick={() => onOpen("resume")}><FileText size={17}/>View resume</button></div>
    <div className={styles.sectionHeader}><h2>On the workbench</h2><span>From the project archive</span></div>
    <div className={styles.featuredProjects}>{projects.filter(project => project.status === "Completed").slice(0, 3).map(project => <button key={project.id} onClick={() => { onSelect(project.id); onQuery(""); onStatus("All projects"); onOpen("projects"); }}><span className={styles.projectMeta}>{project.category}</span><h3>{project.name}</h3><p>{project.summary}</p><span className={styles.textLink}>Open case study</span></button>)}</div>
    <div className={styles.educationStrip}><span>Currently studying</span><strong>{profile.education.degree}</strong><span>{profile.education.institution} · {profile.education.school}</span></div>
  </ApplicationLayout>;
  if (app === "experience") return <ApplicationLayout eyebrow="Work & leadership" title="Experience" description="Systems support, STEM mentorship, and hands-on engineering.">
    <h2 className={styles.sectionTitle}>Work & leadership</h2>
    <div className={styles.timeline}>{experience.map(item => <article key={item.organization} className={!item.date ? styles.undated : undefined}>{item.date && <p className={styles.timelineDate}>{item.date}</p>}<div><h2>{item.role}</h2><strong>{item.organization}</strong><p>{item.description}</p></div></article>)}</div>
    <h2 className={styles.sectionTitle}>Education</h2>
    <div className={styles.timeline}><article><p className={styles.timelineDate}>Since {profile.education.started}</p><div><h2>{profile.education.degree}</h2><strong>{profile.education.institution} · {profile.education.school}</strong><p>Undergraduate study in Software Engineering.</p></div></article></div>
  </ApplicationLayout>;
  if (app === "skills") return <ApplicationLayout eyebrow="Technical toolkit" title="Skills" description="Technologies explored through projects, coursework, and hardware experiments.">
    <p className={styles.context}>Select an underlined technology to find projects that document its use.</p>
    <div className={styles.skillGroups}>{Object.entries(skills).map(([group, items]) => <section key={group}><div><h2>{group}</h2>{skillNotes[group as keyof typeof skills] && <p className={styles.skillNote}>{skillNotes[group as keyof typeof skills]}</p>}</div><div className={styles.tags}>{items.map(skill => {
      const linked = projectsForSkill(skill, projects);
      return linked.length ? <button key={skill} title={`Documented in: ${linked.map(project => project.name).join(", ")}`} onClick={() => { onQuery(skill); onStatus("All projects"); onOpen("projects"); }}>{skill}</button> : <span key={skill}>{skill}</span>;
    })}</div></section>)}</div>
  </ApplicationLayout>;
  if (app === "about") return <ApplicationLayout eyebrow="Behind the workshop" title={profile.name} description={profile.role}>
    <p className={styles.largeText}>{profile.introduction}</p><p>{profile.about}</p>
    <section className={styles.education}><p className={styles.eyebrow}>Education</p><h2>{profile.education.institution}</h2><p>{profile.education.school}</p><strong>{profile.education.degree}</strong><dl><div><dt>Started</dt><dd>{profile.education.started}</dd></div>{profile.education.graduation && <div><dt>Graduation</dt><dd>{profile.education.graduation}</dd></div>}</dl></section>
    <h2 className={styles.sectionTitle}>Outside the code editor</h2><div className={styles.tags}>{profile.interests.map(interest => <span key={interest}>{interest}</span>)}</div>
  </ApplicationLayout>;
  return <ApplicationLayout eyebrow="Make a connection" title="Contact" description="For engineering opportunities, collaboration, or a conversation about something worth building.">
    <div className={styles.contactList}>{[
      { name: "GitHub", description: "Code & repositories", href: verifiedUrl(publicLinks.github) },
      { name: "LinkedIn", description: "Professional profile", href: verifiedUrl(publicLinks.linkedin) },
      { name: "Devpost", description: "Hackathon projects", href: verifiedUrl(publicLinks.devpost) },
      { name: "Email", description: "Get in touch", href: verifiedEmail(publicLinks.email) },
    ].map(link => <div key={link.name}><div><h2>{link.name}</h2><p>{link.description}</p></div>{link.href ? <a href={link.href} target={link.name !== "Email" ? "_blank" : undefined} rel="noreferrer">{link.name === "Email" ? "Write an email" : "Open profile"}<ExternalLink size={15}/></a> : <span className={styles.placeholder}>Verified link not yet provided</span>}</div>)}</div>
  </ApplicationLayout>;
}
