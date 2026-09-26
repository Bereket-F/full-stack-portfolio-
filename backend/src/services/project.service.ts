import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateProjectInput, UpdateProjectInput } from '@/validators/project.validator';

const projectInclude = {
  technologies: { include: { technology: true } },
};

function serialize(project: any) {
  return {
    ...project,
    technologies: project.technologies.map((t: any) => t.technology.name),
  };
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base, { lower: true, strict: true });
  let candidate = root;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

export async function listProjects(opts: { publicOnly: boolean; category?: string; featured?: boolean }) {
  const where: any = {};
  if (opts.publicOnly) where.published = true;
  if (opts.category) where.category = opts.category;
  if (opts.featured !== undefined) where.featured = opts.featured;

  const projects = await prisma.project.findMany({
    where,
    include: projectInclude,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return projects.map(serialize);
}

export async function getProjectBySlug(slug: string, publicOnly: boolean) {
  const project = await prisma.project.findUnique({ where: { slug }, include: projectInclude });
  if (!project || (publicOnly && !project.published)) {
    throw HttpError.notFound('Project not found');
  }
  return serialize(project);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
  if (!project) throw HttpError.notFound('Project not found');
  return serialize(project);
}

export async function createProject(input: CreateProjectInput) {
  const slug = await uniqueSlug(input.slug || input.title);

  const project = await prisma.project.create({
    data: {
      title: input.title,
      slug,
      summary: input.summary,
      overview: input.overview,
      problem: input.problem,
      solution: input.solution,
      role: input.role,
      challenges: input.challenges,
      features: input.features,
      coverImage: input.coverImage || null,
      screenshots: input.screenshots,
      githubUrl: input.githubUrl || null,
      demoUrl: input.demoUrl || null,
      category: input.category,
      featured: input.featured,
      published: input.published,
      order: input.order,
      technologies: {
        create: input.technologies.map((name) => ({
          technology: {
            connectOrCreate: { where: { name }, create: { name } },
          },
        })),
      },
    },
    include: projectInclude,
  });

  return serialize(project);
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  await getProjectById(id);

  const data: any = { ...input };
  delete data.technologies;
  delete data.slug;

  if (input.slug) {
    data.slug = await uniqueSlug(input.slug, id);
  }

  if (input.technologies) {
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
    data.technologies = {
      create: input.technologies.map((name) => ({
        technology: {
          connectOrCreate: { where: { name }, create: { name } },
        },
      })),
    };
  }

  const project = await prisma.project.update({
    where: { id },
    data,
    include: projectInclude,
  });

  return serialize(project);
}

export async function deleteProject(id: string) {
  await getProjectById(id);
  await prisma.project.delete({ where: { id } });
}
