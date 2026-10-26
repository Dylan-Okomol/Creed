import { getChaptersForBook } from '@/lib/content';
import Link from 'next/link';
import { Suspense } from 'react';

async function BookIndexContent({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const chapters = await getChaptersForBook(project);

  return (
    <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
      <header className="mb-20 text-center">
        <Link
          href="/"
          className="absolute -left-12 top-0 text-maroon hover:opacity-70 transition-opacity text-sm font-medium"
        >
          ← Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-bold text-maroon tracking-tight mb-6 capitalize">
          {project.replace(/-/g, ' ')}
        </h1>
        <div className="w-24 h-px bg-maroon/30 mx-auto mb-6" />
        <p className="text-maroon/70 text-xl italic font-medium">
          Catalogue
        </p>
      </header>

      {/* The Index List */}
      <div className="w-full space-y-8 mb-20">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.slug}
            href={`/book/${project}/${chapter.slug}`}
            className="group flex items-center justify-between p-4 border-b border-maroon/10 hover:bg-pastel-green/30 transition-all duration-300 rounded-sm"
          >
            <div className="flex items-center gap-6">
              <span className="text-maroon/40 font-mono text-sm">
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-medium text-maroon group-hover:text-emerald-green transition-colors">
                  {chapter.title}
                </span>
                <span className="text-xs text-maroon/60 uppercase tracking-widest italic">
                  {chapter.section}
                </span>
              </div>
            </div>
            <span className="text-maroon/30 group-hover:text-maroon transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>

      <footer className="text-center pb-12">
        <Link
          href="/library"
          className="text-maroon hover:underline text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
        >
          Return to Library
        </Link>
      </footer>
    </div>
  );
}

export default async function BookIndexPage({ params }: { params: Promise<{ project: string }> }) {
  return (
    <main className="min-h-screen bg-background text-emerald-green p-6 md:p-12 lg:p-24 flex flex-col items-center relative overflow-hidden">
      {/* Background Layer */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/backgrounds/swirls_background.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-maroon">Loading Catalogue...</div>}>
        <BookIndexContent params={params} />
      </Suspense>
    </main>
  );
}
