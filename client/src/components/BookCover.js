'use client';

import Image from 'next/image';

export default function BookCover({ src, title, width = 256, height = 384, className = '' }) {
  // width/height prevent layout shift; tweak to your card size
  return (
    <Image
      src={src}
      alt={`Cover of ${title}`}
      width={width}
      height={height}
      className={`rounded-md object-cover ${className}`}
      // Optional niceties:
      // placeholder="blur"
      // blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACw=" // 1×1
      // sizes="(max-width: 640px) 64px, 96px"
      priority={false} // set true for above-the-fold images
    />
  );
}
