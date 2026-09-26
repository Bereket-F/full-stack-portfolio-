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
import type { Profile } from '@/lib/types';

interface FormValues {
  name: string;
  role: string;
  tagline: string;
  bio: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    adminApi.profile
      .get()
      .then((res) => {
        setProfile(res.data);
        reset({
          name: res.data.name,
          role: res.data.role,
          tagline: res.data.tagline,
          bio: res.data.bio,
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await adminApi.profile.update(values);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          The identity shown in the hero and about sections.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input {...register('name', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Role / title</Label>
          <Input
            {...register('role', { required: true })}
            placeholder="QA Engineer & Full-Stack Developer"
          />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Textarea rows={2} {...register('tagline', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea rows={6} {...register('bio', { required: true })} />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </Button>
      </form>

      {!profile && (
        <p className="text-sm text-muted-foreground">
          No profile exists yet — saving this form will create one.
        </p>
      )}
    </div>
  );
}
