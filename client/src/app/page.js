'use client';
import PopularBooksCarousel from "@/components/home/PopularBooksCarousel";

export default function HomePage() {
  return (
    <main className="min-h-screen">

      <section className="px-6 py-10">
        <h1 className="text-2xl font-semibold">Always Free. Always open.</h1>
        <p className="mt-2 opacity-70">
          ReadingRm is a web applicaiton that builds upon the Project Gutenberg repository
          and Gutendex web API. 
          ReadingRm makes it easy to search, discover, and read thousands of public domain books
          for free.
          Create an account and start building your own digital library.
        </p>

        {/* <Image
          src="/demo/cover.jpg"
          alt="Cover of The Adventures of Sherlock Holmes"
          width={200}      // pick a reasonable intrinsic size
          height={600}    // keep the aspect ratio
          priority
          className="mx-auto rounded-xl shadow"
          sizes="(max-width: 900px) 90vw, 800px"
        /> */}
      </section>
      <PopularBooksCarousel />

    </main>
  );
}
//      <Image src="/default.jpg" alt="One bite" width={800} height={600} />
