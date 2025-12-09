'use client';

import PopularBooksCarousel from '@/components/home/PopularBooksCarousel';
import LinkButton from '@/components/ui/LinkButton';
import { Link } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* 1. Hero */}
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold">
          Always Free. Always Open.
        </h1>
        <p className="mt-3 text-base sm:text-lg opacity-80 leading-relaxed">
          Discover thousands of public-domain classics in a modern, inclusive reading interface.
        </p>
        <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
          ReadingRm is a web application built on top of the Project Gutenberg repository and the Gutendex web
          API. It makes it easy to search, discover, and read thousands of public-domain books for free.
          Create an account to save your progress and build your own digital library.
        </p>
      </section>

      {/* 2. Popular Books Carousel */}
      <PopularBooksCarousel />

      {/* 4. Feature Highlights / Why ReadingRm */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Why ReadingRm?</h2>
        <p className="opacity-80 mb-8 max-w-3xl">
          An accessibility-first reading experience designed for modern browsers, mobile devices,
          and readers who need more control over how they read.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide opacity-80">
              Accessibility First
            </h3>
            <p className="text-sm opacity-80">
              Adjust fonts, colors, spacing, and width to match your visual comfort and reading needs.
            </p>
          </div>

          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide opacity-80">
              Effortless Reading
            </h3>
            <p className="text-sm opacity-80">
              A clean, distraction-free interface that adapts naturally to desktop, tablet, and mobile.
            </p>
          </div>

          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide opacity-80">
              Save Your Progress
            </h3>
            <p className="text-sm opacity-80">
              Create a free account to sync reading progress and personal book lists across sessions.
            </p>
          </div>

          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide opacity-80">
              Open Collection
            </h3>
            <p className="text-sm opacity-80">
              Powered by Project Gutenberg and Gutendex, with a modern UX built on top.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Reader Preview */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">A Reader Built for Comfort</h2>
            <p className="opacity-80 mb-3">
              Switch themes, adjust text size, tweak column width, and choose your preferred font.
              ReadingRm is designed so you can focus on the words—not the interface.
            </p>
            <p className="opacity-80 text-sm">
              Try the demo reader to experience the customizable layout and action rail without
              needing to create an account.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <LinkButton 
                href="/demo_page"
              >
                Demo Reader
              </LinkButton>
            </div>

            
          </div>
          <Image
            src="/demo/cover.jpg"
            alt="Preview of the ReadingRm book reader interface"
            className="object-cover"
            width={300}
            height={100}
          />

        </div>
      </section>

      {/* 6. How It Works */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">How it works</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">
              Step 1
            </p>
            <h3 className="font-semibold mb-2">Search</h3>
            <p className="text-sm opacity-80">
              Find books by title, author, subject, or keyword using the built-in search tools.
            </p>
          </div>

          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">
              Step 2
            </p>
            <h3 className="font-semibold mb-2">Read</h3>
            <p className="text-sm opacity-80">
              Open any book in a clean, customizable reader with options for themes, fonts, and width.
            </p>
          </div>

          <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">
              Step 3
            </p>
            <h3 className="font-semibold mb-2">Save</h3>
            <p className="text-sm opacity-80">
              Sign in to track your progress, build book lists, and pick up where you left off.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Mission / Project Blurb */}
      <section className="px-6 pb-12 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-3">An Accessibility-First Reading Project</h2>
          <p className="text-sm sm:text-base opacity-80 leading-relaxed">
            ReadingRm is an independent project focused on making public-domain literature more
            usable, discoverable, and inclusive. By combining open book collections with a
            thoughtful, accessibility-centered design, ReadingRm aims to give more readers
            a comfortable way to engage with classic texts online.
          </p>
        </div>
      </section>

    </main>
  );
}
