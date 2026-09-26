import { BlogEditor } from '@/components/admin/blog-editor';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">New article</h1>
        <p className="text-sm text-muted-foreground">
          Write in Markdown — it renders on the public blog.
        </p>
      </div>
      <BlogEditor />
    </div>
  );
}
