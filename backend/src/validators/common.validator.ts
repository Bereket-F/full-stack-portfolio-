import { z } from 'zod';

/**
 * Hostnames/paths that are websites rather than image files. Catches the common mistake of
 * pasting a page URL (your own site, a GitHub repo/issue) into an image field.
 */
const NOT_IMAGE_PATTERNS: RegExp[] = [
  /\.vercel\.app\/?$/i, // bare deployment URL
  /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/i, // repo home page
  /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/(issues|pull|blob|tree)\//i, // repo pages
  /^https?:\/\/(www\.)?google\.[a-z.]+\//i,
  /^https?:\/\/(www\.)?youtube\.com\//i,
  /^https?:\/\/(www\.)?linkedin\.com\//i,
];

/**
 * A URL that plausibly points to an image. We can't fetch it server-side to be sure, so we
 * accept anything https that isn't an obvious webpage — GitHub `user-attachments/assets/…`
 * links are extensionless but valid, so we deliberately don't require an image extension.
 */
export const imageUrl = z
  .string()
  .url('Must be a valid URL')
  .refine((url) => url.startsWith('https://'), 'Image URLs must use https')
  .refine(
    (url) => !NOT_IMAGE_PATTERNS.some((re) => re.test(url)),
    'This looks like a webpage, not an image. Paste a direct image link (open it in a new tab — you should see only the picture).',
  );

/** Optional image URL that also accepts an empty string from cleared form fields. */
export const optionalImageUrl = imageUrl.optional().or(z.literal(''));
