export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  status?: string;
  technologies: string[];
  category?: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  problem?: string;
  approach?: string;
  architecture?: string;
  implementation?: string;
  challenges?: string;
  learnings?: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  link?: string;
  order: number;
  published: boolean;
}

export interface Community {
  id: string;
  name: string;
  institution: string;
  description?: string;
  order: number;
}

export interface SocialLinkItem {
  label: string;
  url: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  others: SocialLinkItem[];
}

export interface Competitive {
  codechefStars?: string;
  codechefUrl?: string;
  codeforcesRank?: string;
  codeforcesUrl?: string;
  problemsSolved?: number;
  problemsNote?: string;
  leetcodeUrl?: string;
  streakImage?: string;
  streakLabel?: string;
}

export interface Profile {
  name: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  affiliation: string;
  statusNote: string;
  bio: string[];
  college: string;
  collegeShort: string;
  branch: string;
  batch: string;
  currentFocus: string;
  photo: string;
}

export type SourceType =
  | "profile"
  | "project"
  | "skills"
  | "achievement"
  | "community"
  | "competitive";

export interface KnowledgeDoc {
  key: string;
  sourceType: SourceType;
  title: string;
  text: string;
  hash: string;
  embedding: number[];
  updatedAt: string;
}

export interface SyncMeta {
  lastSync: string | null;
  docCount: number;
}

export interface DBData {
  profile: Profile;
  socials: SocialLinks;
  competitive: Competitive;
  skills: SkillCategory[];
  achievements: Achievement[];
  communities: Community[];
  projects: Project[];
  knowledgeDocs: KnowledgeDoc[];
  syncMeta: SyncMeta;
}
