import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { UpdateProfileInput } from '@/validators/profile.validator';

export async function getProfile() {
  const profile = await prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  });
  if (!profile) throw HttpError.notFound('Profile not configured yet');
  return profile;
}

export async function updateProfile(input: UpdateProfileInput) {
  const existing = await prisma.profile.findFirst();
  const { socialLinks, ...rest } = input;

  const data: any = { ...rest };
  if (rest.avatarUrl === '') data.avatarUrl = null;
  if (rest.resumeUrl === '') data.resumeUrl = null;

  let profile;
  if (existing) {
    profile = await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    profile = await prisma.profile.create({
      data: {
        name: rest.name ?? 'Your Name',
        role: rest.role ?? 'Software Engineer',
        tagline: rest.tagline ?? '',
        bio: rest.bio ?? '',
        ...rest,
      },
    });
  }

  if (socialLinks) {
    await prisma.socialLink.deleteMany({ where: { profileId: profile.id } });
    await prisma.socialLink.createMany({
      data: socialLinks.map((link) => ({
        platform: link.platform,
        url: link.url,
        order: link.order,
        profileId: profile.id,
      })),
    });
  }

  return getProfile();
}
