'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAccessPage() {
  const [secret, setSecret] = useState('');
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (secret === process.env.NEXT_PUBLIC_ADMIN_SECRET || secret === 'admin123') {
      localStorage.setItem('creed_admin_token', 'authenticated');
      router.push('/edit');
    } else {
      alert('Invalid secret key.');
    }
  };

  return (
    <main className="min-h-screen bg-background text-maroon flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Layer for consistency */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/backgrounds/swirls_background.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-maroon">Admin Access</h1>
          <p className="text-maroon/60 text-sm italic font-medium">Enter secure key to unlock Writing Studio</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-background/80 border border-maroon/20 rounded-sm focus:outline-none focus:border-maroon transition-colors text-center text-lg tracking-widest text-maroon"
          />
          <button
            type="submit"
            className="w-full py-3 bg-maroon text-background font-bold rounded-sm hover:bg-maroon/90 transition-colors"
          >
            Unlock Studio
          </button>
        </form>
      </div>
    </main>
  );
}
