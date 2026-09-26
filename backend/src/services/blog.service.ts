import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateBlogPostInput, UpdateBlogPostInput } from '@/validators/blog.validator';

const postInclude = { tags: { include: { tag: true } } };

function serialize(post: any) {
  return { ...post, tags: post.tags.map((t: any) => t.tag.name) };
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base, { lower: true, strict: true });
  let candidate = root;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

export async function listBlogPosts(opts: { publicOnly: boolean }) {
  const where = opts.publicOnly ? { status: 'PUBLISHED' as const } : {};
  const posts = await prisma.blogPost.findMany({
    where,
    include: postInclude,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
  return posts.map(serialize);
}

export async function getBlogPostBySlug(slug: string, publicOnly: boolean) {
  const post = await prisma.blogPost.findUnique({ where: { slug }, include: postInclude });
  if (!post || (publicOnly && post.status !== 'PUBLISHED')) {
    throw HttpError.notFound('Blog post not found');
  }
  return serialize(post);
}

export async function getBlogPostById(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id }, include: postInclude });
  if (!post) throw HttpError.notFound('Blog post not found');
  return serialize(post);
}

export async function createBlogPost(input: CreateBlogPostInput) {
  const slug = await uniqueSlug(input.slug || input.title);
  const post = await prisma.blogPost.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage || null,
      content: input.content,
      status: input.status,
      publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      tags: {
        create: input.tags.map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } },
        })),
      },
    },
    include: postInclude,
  });
  return serialize(post);
}

export async function updateBlogPost(id: string, input: UpdateBlogPostInput) {
  const existing = await getBlogPostById(id);

  const data: any = { ...input };
  delete data.tags;
  delete data.slug;

  if (input.slug) {
    data.slug = await uniqueSlug(input.slug, id);
  }

  if (input.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
    data.publishedAt = new Date();
  }

  if (input.tags) {
    await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    data.tags = {
      create: input.tags.map((name) => ({
        tag: { connectOrCreate: { where: { name }, create: { name } } },
      })),
    };
  }

  const post = await prisma.blogPost.update({ where: { id }, data, include: postInclude });
  return serialize(post);
}

export async function deleteBlogPost(id: string) {
  await getBlogPostById(id);
  await prisma.blogPost.delete({ where: { id } });
}
