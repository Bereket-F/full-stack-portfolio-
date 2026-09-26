'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BlogEditor } from '@/components/admin/blog-editor';
import { adminApi } from '@/lib/admin-api';
import type { BlogPost } from '@/lib/types';

export function EditBlogPostClient({ id }: { id: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.blog
      .get(id)
      .then((res) => setPost(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) return <p className="text-muted-foreground">Article not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Edit article</h1>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <BlogEditor post={post} />
    </div>
  );
}
