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
import type { Education } from '@/lib/types';

interface FormValues {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 10) : '';
}

function fromEducation(edu?: Education | null): FormValues {
  if (!edu) {
    return {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
  }
  return {
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field ?? '',
    startDate: toDateInput(edu.startDate),
    endDate: toDateInput(edu.endDate),
    current: edu.current,
    description: edu.description ?? '',
  };
}

export function EducationFormDialog({
  open,
  onOpenChange,
  education,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: Education | null;
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: fromEducation(education),
  });

  useEffect(() => {
    reset(fromEducation(education));
  }, [education, reset, open]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        institution: values.institution,
        degree: values.degree,
        field: values.field || undefined,
        startDate: values.startDate,
        endDate: values.current ? null : values.endDate || null,
        current: values.current,
        description: values.description || undefined,
      };

      if (education) {
        await adminApi.education.update(education.id, payload as any);
        toast.success('Education updated');
      } else {
        await adminApi.education.create(payload as any);
        toast.success('Education created');
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save education');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{education ? 'Edit education' : 'New education'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Institution</Label>
            <Input {...register('institution', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input {...register('degree', { required: true })} placeholder="BSc" />
            </div>
            <div className="space-y-2">
              <Label>Field</Label>
              <Input {...register('field')} placeholder="Computer Science and Engineering" />
            </div>
          </div>
          <div className="flex items-end justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="current">Currently studying</Label>
            <Switch
              id="current"
              checked={watch('current')}
              onCheckedChange={(v) => setValue('current', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input type="date" {...register('startDate', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>End date</Label>
              <Input type="date" disabled={watch('current')} {...register('endDate')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} {...register('description')} />
          </div>
          <DialogFooter>
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
