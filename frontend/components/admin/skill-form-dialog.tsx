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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Skill, SkillCategory } from '@/lib/types';

const CATEGORIES: SkillCategory[] = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'TESTING',
  'DESIGN',
  'OTHER',
];

interface FormValues {
  name: string;
  category: SkillCategory;
  level: number;
  order: number;
}

export function SkillFormDialog({
  open,
  onOpenChange,
  skill,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
  onSaved: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: { name: '', category: 'FRONTEND', level: 80, order: 0 },
  });

  useEffect(() => {
    reset(
      skill
        ? { name: skill.name, category: skill.category, level: skill.level, order: skill.order }
        : { name: '', category: 'FRONTEND', level: 80, order: 0 },
    );
  }, [skill, reset, open]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = { ...values, level: Number(values.level), order: Number(values.order) };
      if (skill) {
        await adminApi.skills.update(skill.id, payload);
        toast.success('Skill updated');
      } else {
        await adminApi.skills.create(payload);
        toast.success('Skill created');
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save skill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit skill' : 'New skill'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register('name', { required: true })} placeholder="React" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch('category')}
              onValueChange={(v) => setValue('category', v as SkillCategory)}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proficiency (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                {...register('level', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Display order</Label>
              <Input type="number" {...register('order', { valueAsNumber: true })} />
            </div>
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
