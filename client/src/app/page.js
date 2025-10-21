'use client';

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen">

      <section className="px-6 py-10">
        <h1 className="text-2xl font-semibold">Blank Page</h1>
        <p className="mt-2 opacity-70">
            consectetur velit deserunt veniam Lorem in adipisicing tempor sint enim do amet veniam sunt in duis laboris nisi cupidatat reprehenderit culpa aliqua amet dolore laborum nostrud magna pariatur duis consequat laborum non ipsum adipisicing sunt exercitation pariatur sit est cupidatat enim cillum sunt eiusmod duis Lorem commodo quis do esse consequat laboris culpa enim laboris cillum consectetur duis incididunt adipisicing et laborum eiusmod ea velit aute aliquip aliquip minim Lorem et veniam pariatur in do irure deserunt pariatur enim ut fugiat ad voluptate enim ad cupidatat quis qui eu velit aliquip adipisicing aliquip velit adipisicing laborum nisi aute consectetur in reprehenderit non aliqua culpa culpa laboris exercitation laborum amet magna qui duis incididunt eu aliqua excepteur ipsum magna sunt minim est aliquip irure commodo excepteur cillum ad laborum elit elit consectetur pariatur cillum elit et aliquip tempor in sit deserunt elit nulla laboris elit reprehenderit laborum pariatur laborum ullamco laboris ut laboris magna mollit adipisicing sit non deserunt adipisicing sit aliquip nisi et amet cillum ipsum duis nostrud esse amet nostrud id enim velit amet reprehenderit non et tempor laboris irure sit ea in excepteur minim ex proident nostrud in ipsum consequat dolore ullamco adipisicing veniam ea mollit occaecat mollit est veniam ex laboris et occaecat non enim exercitation nisi culpa incididunt elit nostrud cupidatat Lorem enim cupidatat consequat voluptate voluptate nostrud nulla culpa in eu nisi mollit Lorem ad do minim aute adipisicing laborum eiusmod eiusmod cillum do aute aliqua anim cillum ipsum esse in duis ea nulla pariatur Lorem nisi proident ad cillum ipsum sit ad excepteur ullamco irure pariatur sunt ullamco dolore veniam ut velit deserunt aliquip consectetur commodo laborum nostrud enim aliqua consequat tempor nulla irure dolore ullamco eiusmod non cupidatat qui eiusmod exercitation est pariatur fugiat nostrud consequat pariatur et cupidatat tempor sint eiusmod aliquip
        </p>
        <Image
                      src="/demo/cover.jpg"
                      alt="Cover of The Adventures of Sherlock Holmes"
                      width={200}      // pick a reasonable intrinsic size
                      height={600}    // keep the aspect ratio
                      priority
                      className="mx-auto rounded-xl shadow"
                      sizes="(max-width: 900px) 90vw, 800px"
                    />


      </section>
    </main>
  );
}
//      <Image src="/default.jpg" alt="One bite" width={800} height={600} />
