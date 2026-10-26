'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WritingStudioPage({ params }: { params: Promise<{ project: string; chapter: string }> }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('creed_admin_token');
      if (!token) {
        router.push('/admin-access');
        return;
      }

      const resolvedParams = await params;
      const { project, chapter } = resolvedParams;

      try {
        const res = await fetch(`/api/content/${project}/${chapter}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
        if (data.metadata) {
          setTitle(data.metadata.title || '');
          setSection(data.metadata.section || '');
        }
      } catch (e) {
        console.error('Error loading content:', e);
      }
    }
    init();
  }, [params, router]);

  const handleSave = async (project: string, chapter: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          chapter,
          content: content,
          metadata: {
            title: title,
            section: section,
          }
        }),
      });

      if (response.ok) {
        alert('Changes committed to GitHub successfully!');
      } else {
        const err = await response.text();
        alert(`Error saving: ${err}`);
      }
    } catch (e) {
      alert('Network error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const projectSlug = pathSegments[2];
  const chapterSlug = pathSegments[3];

  return (
    <main className="min-h-screen bg-background text-maroon flex flex-col relative overflow-hidden">
      {/* Background Layer */}
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
            {projectSlug} / {chapterSlug}
          </span>
        </div>
        <button
          onClick={() => handleSave(projectSlug, chapterSlug)}
          disabled={isSaving}
          className={`px-6 py-2 rounded-sm font-bold transition-all ${
            isSaving
              ? 'bg-maroon/20 text-maroon/50 cursor-not-allowed'
              : 'bg-maroon text-background hover:bg-maroon/90'
          }`}
        >
          {isSaving ? 'Committing...' : 'Save Changes'}
        </button>
      </header>

      <div className="flex-1 p-6 flex justify-center relative z-10">
        <div className="max-w-4xl w-full h-full flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-maroon/60 uppercase tracking-widest">Chapter Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-background/60 backdrop-blur-sm border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors font-serif text-xl text-maroon"
                placeholder="Enter title..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-maroon/60 uppercase tracking-widest">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3 bg-background/60 backdrop-blur-sm border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors font-serif text-xl text-maroon"
                placeholder="Enter section..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-bold text-maroon/60 uppercase tracking-widest">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-8 bg-background/60 backdrop-blur-sm border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors font-serif text-xl leading-relaxed resize-none text-maroon"
              placeholder="Upload Markdown Here.."
            />
          </div>
          <p className="text-maroon/50 text-xs text-right italic">
            Supports Markdown.
          </p>
        </div>
      </div>
    </main>
  );
}
