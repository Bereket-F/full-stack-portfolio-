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
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Experience } from '@/lib/types';

interface FormValues {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string;
  technologies: string;
}

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : '';
}

function fromExperience(exp?: Experience | null): FormValues {
  if (!exp) {
    return {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: '',
      technologies: '',
    };
  }
  return {
    company: exp.company,
    position: exp.position,
    location: exp.location ?? '',
    startDate: toDateInput(exp.startDate),
    endDate: toDateInput(exp.endDate),
    current: exp.current,
    description: exp.description,
    responsibilities: exp.responsibilities.join('\n'),
    technologies: exp.technologies.join(', '),
  };
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  experience,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: fromExperience(experience),
  });

  useEffect(() => {
    reset(fromExperience(experience));
  }, [experience, reset, open]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        company: values.company,
        position: values.position,
        location: values.location || undefined,
        startDate: values.startDate,
        endDate: values.current ? null : values.endDate || null,
        current: values.current,
        description: values.description,
        responsibilities: values.responsibilities
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: values.technologies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (experience) {
        await adminApi.experience.update(experience.id, payload as any);
        toast.success('Experience updated');
      } else {
        await adminApi.experience.create(payload as any);
        toast.success('Experience created');
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save experience');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{experience ? 'Edit experience' : 'New experience'}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <Label>Company</Label>
            <Input {...register('company', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Input {...register('position', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...register('location')} />
          </div>
          <div className="flex items-end justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="current">Current role</Label>
            <Switch
              id="current"
              checked={watch('current')}
              onCheckedChange={(v) => setValue('current', v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input type="date" {...register('startDate', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input type="date" disabled={watch('current')} {...register('endDate')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea rows={2} {...register('description', { required: true })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Responsibilities (one per line)</Label>
            <Textarea rows={3} {...register('responsibilities')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Technologies (comma separated)</Label>
            <Input {...register('technologies')} />
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
