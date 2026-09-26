'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { BlogPost, PostStatus } from '@/lib/types';

interface FormValues {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  status: PostStatus;
  tags: string;
}

function fromPost(post?: BlogPost | null): FormValues {
  if (!post) {
    return {
      title: '',
      slug: '',
      excerpt: '',
      coverImage: '',
      content: '',
      status: 'DRAFT',
      tags: '',
    };
  }
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    coverImage: post.coverImage ?? '',
    content: post.content,
    status: post.status,
    tags: post.tags.join(', '),
  };
}

export function BlogEditor({ post }: { post?: BlogPost | null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: fromPost(post),
  });

  useEffect(() => {
    reset(fromPost(post));
  }, [post, reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        slug: values.slug || undefined,
        excerpt: values.excerpt || undefined,
        coverImage: values.coverImage || undefined,
        content: values.content,
        status: values.status,
        tags: values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (post) {
        await adminApi.blog.update(post.id, payload);
        toast.success('Article updated');
      } else {
        await adminApi.blog.create(payload);
        toast.success('Article created');
      }
      router.push('/admin/blog');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Slug (leave blank to auto-generate)</Label>
          <Input {...register('slug')} placeholder="auto-generated-from-title" />
        </div>
        <div className="space-y-2">
          <Label>Excerpt</Label>
          <Textarea rows={2} {...register('excerpt')} />
        </div>
        <div className="space-y-2">
          <Label>Content (Markdown)</Label>
          <Textarea
            rows={18}
            className="font-mono text-sm"
            {...register('content', { required: true })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(v) => setValue('status', v as PostStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cover image URL</Label>
          <Input {...register('coverImage')} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Tags (comma separated)</Label>
          <Input {...register('tags')} placeholder="testing, backend" />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Article
        </Button>
      </div>
    </form>
  );
}
