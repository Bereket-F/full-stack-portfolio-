'use client';

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/lib/api';
import type {
  BlogPost,
  DashboardStats,
  Education,
  Experience,
  Message,
  Profile,
  Project,
  Skill,
} from '@/lib/types';

/** All admin calls go straight to the Express backend from the browser, carrying the auth cookie. */

export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      apiPost<{ user: { id: string; email: string; role: string } }>('/auth/login', {
        email,
        password,
      }),
    logout: () => apiPost('/auth/logout'),
    me: () => apiGet<{ user: { id: string; email: string; role: string } }>('/auth/me', false),
  },

  dashboard: {
    stats: () => apiGet<{ data: DashboardStats }>('/admin/dashboard/stats', false),
  },

  projects: {
    list: () => apiGet<{ data: Project[] }>('/admin/projects', false),
    get: (id: string) => apiGet<{ data: Project }>(`/admin/projects/${id}`, false),
    create: (data: Partial<Project>) => apiPost<{ data: Project }>('/admin/projects', data),
    update: (id: string, data: Partial<Project>) =>
      apiPut<{ data: Project }>(`/admin/projects/${id}`, data),
    remove: (id: string) => apiDelete(`/admin/projects/${id}`),
  },

  skills: {
    list: () => apiGet<{ data: Skill[] }>('/admin/skills', false),
    create: (data: Partial<Skill>) => apiPost<{ data: Skill }>('/admin/skills', data),
    update: (id: string, data: Partial<Skill>) => apiPut<{ data: Skill }>(`/admin/skills/${id}`, data),
    remove: (id: string) => apiDelete(`/admin/skills/${id}`),
  },

  experience: {
    list: () => apiGet<{ data: Experience[] }>('/admin/experience', false),
    create: (data: Partial<Experience>) => apiPost<{ data: Experience }>('/admin/experience', data),
    update: (id: string, data: Partial<Experience>) =>
      apiPut<{ data: Experience }>(`/admin/experience/${id}`, data),
    remove: (id: string) => apiDelete(`/admin/experience/${id}`),
  },

  education: {
    list: () => apiGet<{ data: Education[] }>('/admin/education', false),
    create: (data: Partial<Education>) => apiPost<{ data: Education }>('/admin/education', data),
    update: (id: string, data: Partial<Education>) =>
      apiPut<{ data: Education }>(`/admin/education/${id}`, data),
    remove: (id: string) => apiDelete(`/admin/education/${id}`),
  },

  blog: {
    list: () => apiGet<{ data: BlogPost[] }>('/admin/blog', false),
    get: (id: string) => apiGet<{ data: BlogPost }>(`/admin/blog/${id}`, false),
    create: (data: Partial<BlogPost>) => apiPost<{ data: BlogPost }>('/admin/blog', data),
    update: (id: string, data: Partial<BlogPost>) =>
      apiPut<{ data: BlogPost }>(`/admin/blog/${id}`, data),
    remove: (id: string) => apiDelete(`/admin/blog/${id}`),
  },

  messages: {
    list: () => apiGet<{ data: Message[] }>('/admin/messages', false),
    markRead: (id: string, read: boolean) =>
      apiPatch<{ data: Message }>(`/admin/messages/${id}/read`, { read }),
    archive: (id: string, archived: boolean) =>
      apiPatch<{ data: Message }>(`/admin/messages/${id}/archive`, { archived }),
    remove: (id: string) => apiDelete(`/admin/messages/${id}`),
  },

  profile: {
    get: () => apiGet<{ data: Profile }>('/admin/profile', false),
    update: (data: Partial<Profile>) => apiPut<{ data: Profile }>('/admin/profile', data),
  },
};
