'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewChapterPage() {
  const [bookSlug, setBookSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('creed_admin_token');
    if (!token) {
      router.push('/admin-access');
    }

    // Extract book slug from query params
    const queryParams = new URLSearchParams(window.location.search);
    const book = queryParams.get('book');
    if (book) {
      setBookSlug(book);
    }
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookSlug || !title) {
      alert('Please provide both a book and a title.');
      return;
    }

    setIsSaving(true);
    try {
      // Create a slug from the title
      const chapterSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const response = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: bookSlug,
          chapter: chapterSlug,
          content: content,
        }),
      });

      if (response.ok) {
        alert('Chapter created successfully!');
        router.push(`/edit/${bookSlug}/${chapterSlug}`);
      } else {
        const err = await response.text();
        alert(`Error creating chapter: ${err}`);
      }
    } catch (e) {
      alert('Network error occurred while creating chapter.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-maroon flex flex-col relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url(/images/backgrounds/swirls_background.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      <header className="p-4 border-b border-maroon/20 bg-background/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/edit" className="text-sm text-maroon hover:opacity-70 transition-opacity">
            ← Exit Studio
          </Link>
          <span className="text-xs text-maroon/60 font-mono">
            New Chapter / {bookSlug}
          </span>
        </div>
        <button
          onClick={handleCreate}
          disabled={isSaving}
          className={`px-6 py-2 rounded-sm font-bold transition-all ${
            isSaving
              ? 'bg-maroon/20 text-maroon/50 cursor-not-allowed'
              : 'bg-maroon text-background hover:bg-maroon/90'
          }`}
        >
          {isSaving ? 'Creating...' : 'Create & Save'}
        </button>
      </header>

      <div className="flex-1 p-6 flex justify-center relative z-10">
        <div className="max-w-4xl w-full h-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-maroon uppercase tracking-widest">Chapter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 bg-background/60 backdrop-blur-sm border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors font-serif text-2xl text-maroon"
              placeholder="Enter the title of this belief..."
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-bold text-maroon uppercase tracking-widest">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-8 bg-background/60 backdrop-blur-sm border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors font-serif text-xl leading-relaxed resize-none text-maroon"
              placeholder="Write the truth here..."
            />
          </div>
          <p className="text-maroon/50 text-xs text-right italic">
            The slug will be generated automatically from the title.
          </p>
        </div>
      </div>
    </main>
  );
}
