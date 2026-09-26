'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';

interface FormValues {
  seoTitle: string;
  seoDescription: string;
}

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    adminApi.profile
      .get()
      .then((res) =>
        reset({
          seoTitle: res.data.seoTitle ?? '',
          seoDescription: res.data.seoDescription ?? '',
        }),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await adminApi.profile.update(values);
      toast.success('SEO settings saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save SEO settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full max-w-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">SEO</h1>
        <p className="text-sm text-muted-foreground">
          Default title and description used across the site.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input
            {...register('seoTitle')}
            placeholder="Bereket Fanose — QA Engineer & Full-Stack Developer"
          />
        </div>
        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea rows={3} {...register('seoDescription')} />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </form>
    </div>
  );
}
