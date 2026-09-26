'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Project, ProjectCategory } from '@/lib/types';

const CATEGORIES: ProjectCategory[] = ['WEB', 'API', 'MOBILE', 'TESTING', 'TOOLING', 'OTHER'];

interface FormValues {
  title: string;
  summary: string;
  overview: string;
  problem: string;
  solution: string;
  role: string;
  challenges: string;
  features: string;
  coverImage: string;
  screenshots: string;
  githubUrl: string;
  demoUrl: string;
  category: ProjectCategory;
  technologies: string;
  featured: boolean;
  published: boolean;
}

const EMPTY: FormValues = {
  title: '',
  summary: '',
  overview: '',
  problem: '',
  solution: '',
  role: '',
  challenges: '',
  features: '',
  coverImage: '',
  screenshots: '',
  githubUrl: '',
  demoUrl: '',
  category: 'WEB',
  technologies: '',
  featured: false,
  published: true,
};

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function fromProject(project?: Project | null): FormValues {
  if (!project) return EMPTY;
  return {
    title: project.title,
    summary: project.summary,
    overview: project.overview ?? '',
    problem: project.problem ?? '',
    solution: project.solution ?? '',
    role: project.role ?? '',
    challenges: project.challenges ?? '',
    features: project.features.join('\n'),
    coverImage: project.coverImage ?? '',
    screenshots: project.screenshots.join('\n'),
    githubUrl: project.githubUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    category: project.category,
    technologies: project.technologies.join(', '),
    featured: project.featured,
    published: project.published,
  };
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: fromProject(project),
  });

  useEffect(() => {
    reset(fromProject(project));
  }, [project, reset, open]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        summary: values.summary,
        overview: values.overview || undefined,
        problem: values.problem || undefined,
        solution: values.solution || undefined,
        role: values.role || undefined,
        challenges: values.challenges || undefined,
        features: toLines(values.features),
        coverImage: values.coverImage || undefined,
        screenshots: toLines(values.screenshots),
        githubUrl: values.githubUrl || undefined,
        demoUrl: values.demoUrl || undefined,
        category: values.category,
        technologies: toCsv(values.technologies),
        featured: values.featured,
        published: values.published,
      };

      if (project) {
        await adminApi.projects.update(project.id, payload);
        toast.success('Project updated');
      } else {
        await adminApi.projects.create(payload);
        toast.success('Project created');
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit project' : 'New project'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label>Title</Label>
            <Input {...register('title', { required: true })} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Summary</Label>
            <Textarea rows={2} {...register('summary', { required: true })} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Overview</Label>
            <Textarea rows={2} {...register('overview')} />
          </div>

          <div className="space-y-2">
            <Label>Problem</Label>
            <Textarea rows={3} {...register('problem')} />
          </div>
          <div className="space-y-2">
            <Label>Solution</Label>
            <Textarea rows={3} {...register('solution')} />
          </div>

          <div className="space-y-2">
            <Label>My Role</Label>
            <Input {...register('role')} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => setValue('category', v as ProjectCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Challenges</Label>
            <Textarea rows={2} {...register('challenges')} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Features (one per line)</Label>
            <Textarea rows={3} {...register('features')} />
          </div>

          <div className="space-y-2">
            <Label>Cover image URL</Label>
            <Input {...register('coverImage')} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Technologies (comma separated)</Label>
            <Input {...register('technologies')} placeholder="React, Node.js, PostgreSQL" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Screenshots (one URL per line)</Label>
            <Textarea rows={2} {...register('screenshots')} />
          </div>

          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input {...register('githubUrl')} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Demo URL</Label>
            <Input {...register('demoUrl')} placeholder="https://..." />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="featured">Featured</Label>
            <Switch
              id="featured"
              checked={watch('featured')}
              onCheckedChange={(v) => setValue('featured', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={watch('published')}
              onCheckedChange={(v) => setValue('published', v)}
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
