"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {
  const [isLibOpen, setIsLibOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-maroon p-6 md:p-12 lg:p-24 flex flex-col items-center relative overflow-hidden">

      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none blur-[5.5px] scale-110"
        style={{
          backgroundImage: 'url(/images/backgrounds/background_clouds.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 pointer-events-none">
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsLibOpen(!isLibOpen)}
            className="text-maroon font-bold text-lg hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            Library
            <span className={`transition-transform duration-200 ${isLibOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {isLibOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-maroon/20 shadow-lg rounded-sm py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/library"
                className="block px-4 py-2 hover:bg-pastel-green transition-colors text-maroon"
                onClick={() => setIsLibOpen(false)}
              >
                All Books
              </Link>
              <div className="h-px bg-maroon/10 my-1" />
              <Link
                href="/book/the-creed"
                className="block px-4 py-2 hover:bg-pastel-green transition-colors text-maroon"
                onClick={() => setIsLibOpen(false)}
              >
                The Creed
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-4xl w-full space-y-16 md:space-y-24 relative z-20 mt-12">

        {/* Title Section */}
        <header className="text-left">
          <h1 className="text-6xl md:text-8xl font-bold text-maroon tracking-tight">
            My Belief.
          </h1>
        </header>

        {/* Section 1: Left Aligned, Rugged Edge */}
        <section className="flex flex-col items-start space-y-6">
          <p className="text-2xl md:text-3xl leading-relaxed smooth-edge max-w-2xl font-medium text-maroon">
            The world in which I was born, you&apos;d expect that belief would be made derivative of truth,
            after all, the word 'belief' points to an acceptance of something as truth. However,
            all that belief requires is acceptance, truth often does not. What is the ideal correlation
            between these two? Should whatever you accept be considered true, or should truth be accepted?
            Can truth be accepted even if it is against the favour of humanity, or at a much smaller scale,
            against yourself?
          </p>
          <div className="flex flex-col items-start gap-2">
            <div className="relative w-auto max-w-lg rounded-sm border border-maroon/20 overflow-hidden flex justify-center">
              <Image
                src="/images/home/home-section-1.jpg"
                alt="A reflection of truth vs acceptance"
                width={800}
                height={450}
                className="w-auto h-auto max-w-full"
              />
            </div>
            <p className="text-base font-medium italic text-maroon font-serif max-w-[300px]">
              Friedrich, C. D. (c. 1818). Wanderer above the sea of fog [Painting]. Hamburger Kunsthalle, Hamburg, Germany.
            </p>
          </div>
        </section>

        {/* Section 2: Right Aligned, Smooth Edge */}
        <section className="flex flex-col items-end space-y-6">
          <p className="text-2xl md:text-3xl leading-relaxed rugged-edge max-w-2xl font-medium text-emerald-green">
            Do you choose what to believe in? Or was it chosen for you, before you? Believing what
            those before you meant for you, allows you to be in a state of repose, so choosing to
            believe what was set before you, without the search for truth, is really the choice to conform;
            and conform I did.
          </p>
          <div className="flex flex-col items-end gap-2">
            <div className="relative w-auto max-w-lg rounded-sm border border-maroon/20 overflow-hidden flex justify-center">
              <Image
                src="/images/home/home-section-2.jpg"
                alt="The weight of inherited belief"
                width={800}
                height={450}
                className="w-auto h-auto max-w-full"
              />
            </div>
            <p className="text-base font-medium italic text-maroon font-serif text-right max-w-[300px] ml-auto">
              Cabanel, A. (1847). The fallen angel [Painting]. Musée Fabre, Montpellier, France.
            </p>
          </div>
        </section>

        {/* Section 3: Left Aligned */}
        <section className="flex flex-col items-start space-y-6">
          <p className="text-2xl md:text-3xl leading-relaxed smooth-edge max-w-2xl font-medium text-maroon">
            Did conformity grant me repose? I mean, for a time. The good I encountered persuaded me
            to point to my beliefs, so speaking, my beliefs became the cause of the good. Logically,
            however, the good was responsible for affirming my beliefs and In realization of this,
            I was overwhelmed by the vastness of beliefs that had previously been invalidated, beliefs
            of other cultures and religions suddenly earned a small sense of recognition. That If I
            lived in the context of those people, I would be no different. Accepting doctrines as
            nothing but truth, in a kind of passionate faith; which would be, acceptance without the
            need for evidence. I would live with repose in exchange for possible truth.
          </p>
          <div className="flex flex-col items-start gap-2">
            <div className="relative w-auto max-w-lg rounded-sm border border-maroon/20 overflow-hidden flex justify-center">
              <Image
                src="/images/home/home-section-3.jpg"
                alt="The realization of diverse truths"
                width={800}
                height={450}
                className="w-auto h-auto max-w-full"
              />
            </div>
            <p className="text-base font-medium italic text-maroon font-serif max-w-[300px]">
              Van Gogh, V. (1888). Café terrace at night [Painting]. Kröller-Müller Museum, Otterlo, Netherlands.
            </p>
          </div>
        </section>

        {/* Section 4: The Need - Center Aligned */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-maroon">
            The Need.
          </h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-medium text-center">
            There is need to cure the curse of truth. Truth beckons me to serve it&apos;s will.
            Even if it means having the ground on which I stand shaken. Even if truth seeks
            not to serve or even to punish. Truth needs me, not only to know it, but to love it.
            For I as a being, am derivative of truths, and a derivative also of the rightful
            negation of truths. I am part of the emerging of apparent truths, and the overcoming
            of those truths by the truth itself. Such I believe is the essence of life. The
            commitment and love, and the forsaking of such, to find other ends to commit to,
            and live by.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-bold text-maroon">
            That is why I seek to write that which I live by. That I may make my contribution to
            truth as a conscious source, and not only live to affirm it by the testimonies
            of it&apos;s prevailing good. This is My Creed.
          </p>
        </section>

        {/* Call to Action */}
        <footer className="flex justify-center pt-12 pb-24">
          <Link
            href="/library"
            className="px-10 py-4 bg-maroon text-background font-bold rounded-sm hover:bg-maroon/90 transition-colors text-xl"
          >
            Library
          </Link>
        </footer>
      </div>
    </main>
  );
}
