'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Chapter {
  slug: string;
  title: string;
}

interface Book {
  slug: string;
  name: string;
  chapters: Chapter[];
}

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookDesc, setNewBookDesc] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('creed_admin_token');
    if (!token) {
      router.push('/admin-access');
    }

    async function fetchBooks() {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load books for admin', e);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [router]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName) return;

    try {
      const res = await fetch('/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBookName, description: newBookDesc }),
      });

      if (res.ok) {
        setNewBookName('');
        setNewBookDesc('');
        setIsAddingBook(false);
        const updatedRes = await fetch('/api/books');
        setBooks(await updatedRes.json());
      }
    } catch (e) {
      console.error('Error adding book:', e);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-maroon">Loading Studio...</div>;

  return (
    <main className="min-h-screen bg-background text-maroon p-8 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url(/images/backgrounds/swirls_background,jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-maroon">Writing Studio</h1>
            <p className="text-maroon/60 italic font-medium">Manage your knowledge nodes</p>
          </div>
          <Link
            href="/library"
            className="text-sm text-maroon hover:opacity-70 transition-colors"
          >
            View Public Site →
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Book Creation Section */}
          <section className="bg-pastel-green/30 border border-maroon/20 rounded-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-maroon">Add New Book</h3>
            {isAddingBook ? (
              <form onSubmit={handleAddBook} className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    placeholder="Enter book name..."
                    className="flex-1 px-4 py-2 bg-background border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon text-maroon"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-maroon text-background font-bold rounded-sm hover:bg-maroon/90 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBook(false)}
                    className="px-6 py-2 border border-maroon/20 rounded-sm hover:bg-maroon/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  value={newBookDesc}
                  onChange={(e) => setNewBookDesc(e.target.value)}
                  placeholder="Enter book description..."
                  className="w-full px-4 py-2 bg-background border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon text-maroon font-serif italic"
                  rows={2}
                />
              </form>
            ) : (
              <button
                onClick={() => setIsAddingBook(true)}
                className="px-6 py-2 bg-maroon text-background font-bold rounded-sm hover:bg-maroon/90 transition-colors"
              >
                + Create New Book
              </button>
            )}
          </section>

          {/* Books List */}
          <div className="grid grid-cols-1 gap-8">
            {Array.isArray(books) && books.map(book => (
              <div key={book.slug} className="bg-background/80 border border-maroon/20 rounded-sm p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-maroon">{book.name}</h2>
                  <Link
                    href={`/edit/new-chapter?book=${book.slug}`}
                    className="text-xs bg-maroon text-background px-3 py-1 rounded-sm hover:bg-maroon/90 transition-colors font-bold"
                  >
                    + Add Chapter
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {book.chapters?.map(chapter => (
                    <div key={chapter.slug} className="flex items-center justify-between p-3 bg-pastel-green/20 hover:bg-pastel-green/40 border border-maroon/10 rounded-sm text-sm text-maroon transition-colors group">
                      <Link
                        href={`/edit/${book.slug}/${chapter.slug}`}
                        className="flex-1 font-medium hover:text-emerald-green transition-colors"
                      >
                        {chapter.title}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="opacity-0 group-hover:opacity-100 text-xs text-maroon/60 transition-opacity">Edit</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${chapter.title}"?`)) {
                              try {
                                const res = await fetch(`/api/delete-chapter?project=${book.slug}&chapter=${chapter.slug}`, {
                                  method: 'DELETE',
                                });
                                if (res.ok) {
                                  const updatedRes = await fetch('/api/books');
                                  const updatedData = await updatedRes.json();
                                  setBooks(updatedData);
                                } else {
                                  alert('Failed to delete chapter.');
                                }
                              } catch (e) {
                                alert('Error deleting chapter.');
                              }
                            }
                          }}
                          className="text-maroon/40 hover:text-maroon transition-colors text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
