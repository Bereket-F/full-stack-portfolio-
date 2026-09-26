import { PrismaClient, SkillCategory, ProjectCategory, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding placeholder content...');

  // --- Profile -------------------------------------------------------------
  const existingProfile = await prisma.profile.findFirst();
  const profile =
    existingProfile ??
    (await prisma.profile.create({
      data: {
        name: 'Bereket Fanose',
        role: 'QA Engineer & Full-Stack Developer',
        tagline: 'I build reliable digital products and test complex systems from requirements to release.',
        bio: 'I am a Computer Science and Engineering graduate who works across the stack: writing test plans and automated suites as a QA engineer, and building backend services and frontend interfaces as a developer. I care about software that works the way it is supposed to — and about catching the ways it doesn\'t before users do.',
        location: 'Ethiopia',
        email: 'bereket.example@example.com',
        avatarUrl: null,
        resumeUrl: null,
        seoTitle: 'Bereket Fanose — QA Engineer & Full-Stack Developer',
        seoDescription:
          'Portfolio of Bereket Fanose, a QA Engineer and Full-Stack Developer building and testing reliable software.',
      },
    }));

  await prisma.socialLink.deleteMany({ where: { profileId: profile.id } });
  await prisma.socialLink.createMany({
    data: [
      { platform: 'github', url: 'https://github.com/your-username', order: 0, profileId: profile.id },
      { platform: 'linkedin', url: 'https://linkedin.com/in/your-username', order: 1, profileId: profile.id },
    ],
  });

  // --- Skills ----------------------------------------------------------------
  const skills: { name: string; category: SkillCategory; level: number }[] = [
    { name: 'React', category: 'FRONTEND', level: 90 },
    { name: 'Next.js', category: 'FRONTEND', level: 85 },
    { name: 'TypeScript', category: 'FRONTEND', level: 88 },
    { name: 'JavaScript', category: 'FRONTEND', level: 92 },
    { name: 'Tailwind CSS', category: 'FRONTEND', level: 88 },
    { name: 'Node.js', category: 'BACKEND', level: 88 },
    { name: 'Express.js', category: 'BACKEND', level: 86 },
    { name: 'Java', category: 'BACKEND', level: 75 },
    { name: 'Spring Boot', category: 'BACKEND', level: 70 },
    { name: 'REST APIs', category: 'BACKEND', level: 90 },
    { name: 'PostgreSQL', category: 'DATABASE', level: 85 },
    { name: 'MySQL', category: 'DATABASE', level: 78 },
    { name: 'MongoDB', category: 'DATABASE', level: 72 },
    { name: 'Manual Testing', category: 'TESTING', level: 92 },
    { name: 'Postman', category: 'TESTING', level: 90 },
    { name: 'JMeter', category: 'TESTING', level: 75 },
    { name: 'k6', category: 'TESTING', level: 70 },
    { name: 'Playwright', category: 'TESTING', level: 82 },
    { name: 'Figma', category: 'DESIGN', level: 70 },
    { name: 'UI/UX', category: 'DESIGN', level: 75 },
  ];

  await prisma.skill.deleteMany();
  for (const [i, skill] of skills.entries()) {
    await prisma.skill.create({ data: { ...skill, order: i } });
  }

  // --- Projects ----------------------------------------------------------------
  const projects: {
    title: string;
    slug: string;
    summary: string;
    overview: string;
    problem: string;
    solution: string;
    role: string;
    challenges: string;
    features: string[];
    githubUrl: string;
    demoUrl: string;
    category: ProjectCategory;
    featured: boolean;
    technologies: string[];
  }[] = [
    {
      title: 'QA Automation Framework',
      slug: 'qa-automation-framework',
      summary: 'An end-to-end test automation framework built for a multi-service web application.',
      overview:
        'A Playwright-based automation framework covering UI regression, API contract tests, and load-test smoke checks, wired into CI so every pull request is verified automatically.',
      problem:
        'Manual regression testing before every release was slow and error-prone, and defects were frequently found in production.',
      solution:
        'Built a layered automation suite (UI, API, performance smoke) with reusable page objects and fixtures, integrated into the CI pipeline with test reports published per build.',
      role: 'QA Engineer / Test Automation Developer',
      challenges:
        'Flaky UI tests caused by asynchronous rendering; solved with explicit wait strategies and network-idle checks rather than fixed sleeps.',
      features: [
        'Playwright UI test suite with page object model',
        'API contract tests with schema validation',
        'CI integration with HTML test reports',
        'Parallel test execution',
      ],
      githubUrl: 'https://github.com/your-username/qa-automation-framework',
      demoUrl: '',
      category: 'TESTING',
      featured: true,
      technologies: ['Playwright', 'TypeScript', 'Postman', 'GitHub Actions'],
    },
    {
      title: 'Task Management API',
      slug: 'task-management-api',
      summary: 'A REST API for team task management with role-based access control.',
      overview:
        'A backend service exposing authenticated REST endpoints for projects, tasks, and comments, with role-based authorization and thorough input validation.',
      problem:
        'Small teams needed a lightweight, self-hostable task tracker without the overhead of large SaaS tools.',
      solution:
        'Designed a normalized PostgreSQL schema and an Express + Prisma API with JWT auth, granular permissions, and comprehensive Supertest coverage.',
      role: 'Backend Developer',
      challenges:
        'Modeling flexible team/role permissions without over-complicating the schema; resolved with a compact roles table and middleware-based authorization checks.',
      features: [
        'JWT authentication with refresh handling',
        'Role-based authorization middleware',
        'Full CRUD for projects, tasks, comments',
        'Supertest API test suite',
      ],
      githubUrl: 'https://github.com/your-username/task-management-api',
      demoUrl: '',
      category: 'API',
      featured: true,
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Jest'],
    },
    {
      title: 'This Portfolio',
      slug: 'developer-qa-portfolio',
      summary: 'A full-stack portfolio with a Next.js frontend, Express API, and admin dashboard.',
      overview:
        'The site you are looking at: a Next.js public site and admin dashboard backed by an independent Express + Prisma REST API.',
      problem:
        'Static portfolio templates do not demonstrate backend, database, or testing skills — only frontend polish.',
      solution:
        'Built a real REST API with authentication, a normalized PostgreSQL schema, an admin dashboard with full CRUD, and automated tests across the stack.',
      role: 'Full-Stack Developer',
      challenges:
        'Keeping the admin dashboard and public site in sync with one source of truth without duplicating business logic between frontend and backend.',
      features: [
        'JWT auth with HTTP-only cookies',
        'Admin dashboard with CRUD for all content',
        'Public REST API consumed by the frontend',
        'Automated API, component, and E2E tests',
      ],
      githubUrl: 'https://github.com/your-username/portfolio',
      demoUrl: '',
      category: 'WEB',
      featured: true,
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Express', 'Prisma', 'PostgreSQL'],
    },
  ];

  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  for (const [i, p] of projects.entries()) {
    await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        overview: p.overview,
        problem: p.problem,
        solution: p.solution,
        role: p.role,
        challenges: p.challenges,
        features: p.features,
        screenshots: [],
        githubUrl: p.githubUrl,
        demoUrl: p.demoUrl || null,
        category: p.category,
        featured: p.featured,
        published: true,
        order: i,
        technologies: {
          create: p.technologies.map((name) => ({
            technology: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
    });
  }

  // --- Experience ----------------------------------------------------------------
  await prisma.experience.deleteMany();
  await prisma.experience.create({
    data: {
      company: 'Example Software Company',
      position: 'QA Engineer',
      location: 'Remote',
      startDate: new Date('2023-02-01'),
      endDate: null,
      current: true,
      description:
        'Responsible for manual and automated testing across web and API layers for a multi-team engineering organization.',
      responsibilities: [
        'Wrote and executed test plans and test cases for new features',
        'Built and maintained Playwright and Postman automation suites',
        'Performed load testing with k6 and JMeter ahead of releases',
        'Collaborated with developers to reproduce and triage bugs',
      ],
      technologies: ['Playwright', 'Postman', 'JMeter', 'k6', 'Jira'],
      order: 0,
    },
  });
  await prisma.experience.create({
    data: {
      company: 'Example Startup',
      position: 'Full-Stack Developer (Part-time)',
      location: 'Remote',
      startDate: new Date('2022-06-01'),
      endDate: new Date('2023-01-31'),
      current: false,
      description: 'Built and maintained internal tools using React and Node.js.',
      responsibilities: [
        'Developed REST APIs with Node.js and Express',
        'Built React interfaces for internal dashboards',
        'Wrote unit and integration tests for critical modules',
      ],
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL'],
      order: 1,
    },
  });

  // --- Education ----------------------------------------------------------------
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: 'Adama Science and Technology University',
      degree: 'BSc',
      field: 'Computer Science and Engineering',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2023-07-01'),
      current: false,
      description:
        'Studied software engineering fundamentals, algorithms, databases, and systems design.',
      order: 0,
    },
  });

  // --- Blog ----------------------------------------------------------------
  await prisma.blogPostTag.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.create({
    data: {
      title: 'Why I Test Before I Ship',
      slug: 'why-i-test-before-i-ship',
      excerpt: 'A few thoughts on treating testing as part of engineering, not an afterthought.',
      coverImage: null,
      content:
        '# Why I Test Before I Ship\n\nTesting is not a phase that happens after development — it is part of how I design software from the start. This post walks through how I approach test planning, automation boundaries, and what I check before every release.',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      tags: {
        create: [{ tag: { connectOrCreate: { where: { name: 'testing' }, create: { name: 'testing' } } } }],
      },
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
