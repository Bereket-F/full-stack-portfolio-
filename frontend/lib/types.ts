export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TESTING' | 'DESIGN' | 'OTHER';
export type ProjectCategory = 'WEB' | 'API' | 'MOBILE' | 'TESTING' | 'TOOLING' | 'OTHER';
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  socialLinks: SocialLink[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  icon?: string | null;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  overview?: string | null;
  problem?: string | null;
  solution?: string | null;
  role?: string | null;
  challenges?: string | null;
  features: string[];
  coverImage?: string | null;
  screenshots: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  category: ProjectCategory;
  featured: boolean;
  published: boolean;
  order: number;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  content: string;
  status: PostStatus;
  publishedAt?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalPosts: number;
  publishedPosts: number;
  unreadMessages: number;
  recentMessages: Message[];
  recentProjects: Project[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}
