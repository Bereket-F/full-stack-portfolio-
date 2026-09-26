import { apiGet, ApiError } from '@/lib/api';
import type {
  BlogPost,
  Education,
  Experience,
  Profile,
  Project,
  Skill,
} from '@/lib/types';

/** Public content fetchers used by server components. Return null on 404 instead of throwing. */

export async function getProfile(): Promise<Profile | null> {
  try {
    const res = await apiGet<{ data: Profile }>('/profile');
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getProjects(params?: { featured?: boolean }): Promise<Project[]> {
  const query = params?.featured !== undefined ? `?featured=${params.featured}` : '';
  const res = await apiGet<{ data: Project[] }>(`/projects${query}`);
  return res.data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await apiGet<{ data: Project }>(`/projects/${slug}`);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getSkills(): Promise<Skill[]> {
  const res = await apiGet<{ data: Skill[] }>('/skills');
  return res.data;
}

export async function getExperiences(): Promise<Experience[]> {
  const res = await apiGet<{ data: Experience[] }>('/experience');
  return res.data;
}

export async function getEducation(): Promise<Education[]> {
  const res = await apiGet<{ data: Education[] }>('/education');
  return res.data;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await apiGet<{ data: BlogPost[] }>('/blog');
  return res.data;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await apiGet<{ data: BlogPost }>(`/blog/${slug}`);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
