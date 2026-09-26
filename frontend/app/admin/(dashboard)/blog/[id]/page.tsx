import { EditBlogPostClient } from '@/components/admin/edit-blog-post-client';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditBlogPostClient id={id} />;
}
