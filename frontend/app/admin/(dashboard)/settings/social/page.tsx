'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';

interface FormValues {
  socialLinks: { platform: string; url: string; order: number }[];
}

export default function SocialLinksSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { socialLinks: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'socialLinks' });

  useEffect(() => {
    adminApi.profile
      .get()
      .then((res) =>
        reset({
          socialLinks: res.data.socialLinks.map((l) => ({
            platform: l.platform,
            url: l.url,
            order: l.order,
          })),
        }),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await adminApi.profile.update({
        socialLinks: values.socialLinks.map((l, i) => ({ ...l, order: i })),
      } as any);
      toast.success('Social links saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save social links');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full max-w-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Social Links</h1>
        <p className="text-sm text-muted-foreground">
          Shown in the hero and footer (e.g. github, linkedin).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="w-32 space-y-1.5">
                <Label>Platform</Label>
                <Input
                  {...register(`socialLinks.${index}.platform` as const, { required: true })}
                  placeholder="github"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label>URL</Label>
                <Input
                  {...register(`socialLinks.${index}.url` as const, { required: true })}
                  placeholder="https://..."
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ platform: '', url: '', order: fields.length })}
        >
          <Plus className="h-4 w-4" /> Add link
        </Button>

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
