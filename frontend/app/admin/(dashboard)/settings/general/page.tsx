'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';

interface FormValues {
  email: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
}

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    adminApi.profile
      .get()
      .then((res) =>
        reset({
          email: res.data.email ?? '',
          location: res.data.location ?? '',
          avatarUrl: res.data.avatarUrl ?? '',
          resumeUrl: res.data.resumeUrl ?? '',
        }),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await adminApi.profile.update(values);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full max-w-xl" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">General Settings</h1>
        <p className="text-sm text-muted-foreground">Contact details and downloadable assets.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>Contact email</Label>
          <Input type="email" {...register('email')} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input {...register('location')} placeholder="City, Country" />
        </div>
        <div className="space-y-2">
          <Label>Avatar image URL</Label>
          <Input {...register('avatarUrl')} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Resume / CV URL</Label>
          <Input {...register('resumeUrl')} placeholder="https://..." />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </form>
    </div>
  );
}
