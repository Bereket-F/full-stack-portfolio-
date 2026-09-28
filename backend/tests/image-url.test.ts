import { imageUrl } from '@/validators/common.validator';

describe('imageUrl validator', () => {
  it('accepts extensionless GitHub user-attachment links', () => {
    expect(
      imageUrl.safeParse('https://github.com/user-attachments/assets/09bb10b6-97d9-4944-8549-e1fc731b346d').success,
    ).toBe(true);
  });

  it('accepts ordinary image URLs with extensions', () => {
    expect(imageUrl.safeParse('https://i.imgur.com/abc123.png').success).toBe(true);
    expect(imageUrl.safeParse('https://res.cloudinary.com/demo/image/upload/sample.jpg').success).toBe(true);
  });

  it('rejects a bare site URL pasted into an image field', () => {
    const result = imageUrl.safeParse('https://full-stack-portfolio-ten-coral.vercel.app');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/looks like a webpage/i);
    }
  });

  it('rejects GitHub repo / issue pages', () => {
    expect(imageUrl.safeParse('https://github.com/Bereket-F/full-stack-portfolio-').success).toBe(false);
    expect(imageUrl.safeParse('https://github.com/Bereket-F/full-stack-portfolio-/issues/1').success).toBe(false);
  });

  it('rejects non-https and malformed values', () => {
    expect(imageUrl.safeParse('http://example.com/pic.png').success).toBe(false);
    expect(imageUrl.safeParse('not a url').success).toBe(false);
  });
});
