import { BriefcaseBusiness, Code2, FileText, Folder, House, Mail, UserRound } from "lucide-react";

export const applications = [
  { id: "home", label: "Home", description: "Start here", icon: House },
  { id: "projects", label: "Projects", description: "Engineering archive", icon: Folder },
  { id: "experience", label: "Experience", description: "Work & mentorship", icon: BriefcaseBusiness },
  { id: "skills", label: "Skills", description: "Technical toolkit", icon: Code2 },
  { id: "about", label: "About", description: "Background & education", icon: UserRound },
  { id: "resume", label: "Resume", description: "The short version", icon: FileText },
  { id: "contact", label: "Contact", description: "Profiles & email", icon: Mail },
] as const;

export type AppId = (typeof applications)[number]["id"];
