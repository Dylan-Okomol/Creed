import { getAllBooks } from '@/lib/content';
import Link from 'next/link';

export default async function LibraryPage() {
  const books = await getAllBooks();

  return (
    <main className="min-h-screen bg-background text-emerald-green p-8 relative overflow-hidden">
      {/* Grainy Texture Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/backgrounds/background_clouds.jpg)',
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <Link
            href="/"
            className="absolute left-0 top-0 text-maroon hover:opacity-70 transition-opacity text-sm font-medium"
          >
            ← Home
          </Link>
          <h1 className="text-6xl font-bold tracking-tighter mb-4 text-maroon">Library</h1>
          <p className="text-emerald-green text-xl max-w-2xl mx-auto italic font-medium">
            A collection of my beliefs in writing.
          </p>
        </header>

        {/* Divider Bar */}
        <div className="flex justify-center mb-20">
          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-maroon/30 to-transparent relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-maroon rounded-full shadow-[0_0_10px_rgba(87,0,27,0.5)]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-16">
          {books.map((book) => (
            <div key={book.slug} className="flex flex-col items-center space-y-6 max-w-md">
              <a
                href={`/book/${book.slug}`}
                className="group relative block overflow-hidden rounded-sm bg-pastel-green border border-emerald-green/20 transition-all hover:border-maroon hover:scale-[1.02] w-64"
              >
                <div className="aspect-[3/4] bg-pastel-green/50 relative overflow-hidden border-b border-emerald-green/10">
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-green/40 font-serif text-sm uppercase tracking-widest">
                    Project Cover
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
              </a>

              {/* Space for word description */}
              <p className="text-maroon/70 text-center text-lg italic leading-relaxed max-w-xs font-medium">
                {book.slug === 'the-creed'
                  ? "I write this to be a witness of my past and future selves, who watch me develop the beliefs that will guide my overcoming and becoming of myself."
                  : "Exploring the boundaries of truth and the architecture of a conscious life."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
