'use client';

import Image from 'next/image';

export default function BookCover({ src, title, width = 256, height = 384, className = '' }) {
  return (
    <Image
      src={src}
      alt={`Cover of ${title}`}
      width={width}
      height={height}
      className={`rounded-md object-cover ${className}`}
      priority={false} 
    />
  );
}
