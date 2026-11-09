import { getChapterContent, getChaptersForBook } from '@/lib/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';
import { Suspense } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

async function IndexLink({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  return (
    <Link
      href={`/book/${project}`}
      className="text-sm text-emerald-green hover:text-maroon transition-colors flex items-center gap-2"
    >
      ← Index
    </Link>
  );
}

async function ReaderContent({ params }: { params: Promise<{ project: string; chapter: string }> }) {
  const { project, chapter } = await params;
  const contentData = await getChapterContent(project, chapter);
  const allChapters = await getChaptersForBook(project);

  if (!contentData) {
    notFound();
  }

  const { metadata, content } = contentData;
  const currentIdx = allChapters.findIndex(c => c.slug === chapter);
  const prevChapter = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
  const nextChapter = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;

  // Ensure we strip the frontmatter if it somehow leaked into the content string
  const { content: rawContent } = matter(content || '');

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(rawContent);

  // Custom replacement for the awkward back-arrow ↩
  // We replace the default back-arrow with a clean, minimal '↑'
  // or you can use '↩︎' for the plain text version.
  const strippedContent = processedContent.toString().replace(/↩/g, '↑');

  return (
    <>
      {/* Content Area - The plain white/off-white reading column */}
      <article className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full relative z-10 bg-background shadow-sm">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-6xl font-medium tracking-tighter mb-4 text-maroon">
            {metadata.title}
          </h1>
          <div className="h-1 w-12 bg-maroon/30 mx-auto" />
        </header>

        <div className="prose prose-zinc max-w-none
          text-maroon leading-relaxed font-light text-xl
          [&>h1]:text-3xl [&>h1]:font-medium [&>h1]:mb-6 [&>h1]:text-maroon
          [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:mb-4 [&>h2]:text-maroon
          [&>p]:mb-6 [&>p]:leading-loose
          [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6
          [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-6
          [&>blockquote]:border-l-2 [&>blockquote]:border-maroon/30 [&>blockquote]:pl-4 [&>blockquote]:italic
          [&_a]:text-maroon [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-emerald-green
          [&_sup a]:text-sm [&_sup a]:font-bold [&_sup a]:text-maroon/80 [&_sup a]:no-underline [&_sup a]:hover:text-maroon
          [&_sup a]:before:content-['['] [&_sup a]:after:content-[']']
          [&_.footnotes]:mt-12 [&_.footnotes]:pt-4
          [&_.footnotes h2]:hidden
          [&_.footnote]:mb-6 [&_.footnote]:text-lg [&_.footnote]:leading-relaxed
          [&_.footnote-backref]:hidden
          [&_.footnotes ol]:list-decimal [&_.footnotes ol]:pl-6 [&_.footnotes ol]:m-0
          [&_.footnotes li]:flex [&_.footnotes li]:gap-2 [&_.footnotes li]:items-start
          [&_.footnotes li > a]:hidden
        "
        dangerouslySetInnerHTML={{ __html: strippedContent }}
        />
      </article>

      {/* Sequential Navigation Footer */}
      <footer className="p-6 md:p-12 border-t border-emerald-green/10 flex justify-between items-center max-w-3xl mx-auto w-full mb-12 relative z-10 bg-background/90">
        <Link
          href={prevChapter ? `/book/${project}/${prevChapter.slug}` : '#'}
          className={`text-sm font-medium transition-colors ${prevChapter ? 'text-maroon hover:text-emerald-green' : 'text-emerald-green/20 pointer-events-none'}`}
        >
          ← Previous
        </Link>

        <Link
          href={nextChapter ? `/book/${project}/${nextChapter.slug}` : '#'}
          className={`text-sm font-medium transition-colors ${nextChapter ? 'text-maroon hover:text-emerald-green' : 'text-emerald-green/20 pointer-events-none'}`}
        >
          Next →
        </Link>
      </footer>
    </>
  );
}

export default async function ReaderPage({ params }: { params: Promise<{ project: string; chapter: string }> }) {
  return (
    <main className="min-h-screen bg-background text-emerald-green flex flex-col relative">
      {/* Global Background Swirls - creating the "manuscript" frame */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-repeat bg-[length:360px_auto] sm:bg-[length:600px_auto] md:bg-[length:800px_auto]"
        style={{
          backgroundImage: 'url(/images/backgrounds/swirls_background.jpg)',
        }}
      />

      {/* Navigation Header */}
      <header className="py-4 md:py-6 border-b border-emerald-green/20 bg-background/80 backdrop-blur-md sticky top-0 z-20 w-full">
        <div className="mx-auto flex w-full max-w-3xl justify-between items-center px-4 sm:px-6">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto">
            <Link
              href="/"
              className="text-maroon hover:opacity-70 transition-opacity text-sm font-medium whitespace-nowrap"
            >
              ← Home
            </Link>
            <Suspense fallback={<span className="text-sm text-emerald-green/50">Loading...</span>}>
              <IndexLink params={params} />
            </Suspense>
          </div>
          <div className="text-[10px] md:text-xs text-emerald-green/60 uppercase tracking-widest font-mono whitespace-nowrap ml-4">
            The Creed
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-maroon">Loading Chapter...</div>}>
        <ReaderContent params={params} />
      </Suspense>
    </main>
  );
}
