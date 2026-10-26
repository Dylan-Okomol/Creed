import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ChapterMetadata {
  title: string;
  section: string;
  x: number;
  y: number;
  slug: string;
}

export interface BookMetadata {
  slug: string;
  name: string;
  chapters: ChapterMetadata[];
}

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Returns a list of all books (top-level directories in /content)
 */
export async function getAllBooks(): Promise<BookMetadata[]> {
  if (!fs.existsSync(CONTENT_ROOT)) return [];

  const bookDirs = fs.readdirSync(CONTENT_ROOT).filter(dir => {
    const fullPath = path.join(CONTENT_ROOT, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  return Promise.all(
    bookDirs.map(async (bookSlug) => {
      const chapters = await getChaptersForBook(bookSlug);
      return {
        slug: bookSlug,
        name: bookSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        chapters,
      };
    })
  );
}

/**
 * Returns all chapters for a specific book
 */
export async function getChaptersForBook(bookSlug: string): Promise<ChapterMetadata[]> {
  const bookPath = path.join(CONTENT_ROOT, bookSlug, 'chapters');

  if (!fs.existsSync(bookPath)) return [];

  const files = fs.readdirSync(bookPath).filter(file => file.endsWith('.md'));

  return files.map(file => {
    const fullPath = path.join(bookPath, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title || file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      section: data.section || 'General',
      x: data.x || 0,
      y: data.y || 0,
      slug: file.replace('.md', ''),
    };
  });
}

/**
 * Returns the full content and metadata for a specific chapter
 */
export async function getChapterContent(bookSlug: string, chapterSlug: string) {
  const filePath = path.join(CONTENT_ROOT, bookSlug, 'chapters', `${chapterSlug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    metadata: data,
    content,
  };
}
