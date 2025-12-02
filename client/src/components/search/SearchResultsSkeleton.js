// src/components/search/SearchResultsSkeleton.js
import Skeleton from '@/components/ui/Skeleton';

export default function SearchResultsSkeleton({ count = 6 }) {
  return (
    <div className="mt-4 space-y-4" role="status" aria-label="Loading search results">
      {/* List of fake results */}
      <ul className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            className="flex gap-4 border-b border-black/10 dark:border-white/10 pb-4"
          >
            {/* Cover placeholder */}
            <div className="shrink-0">
              <Skeleton className="h-24 w-16" />
            </div>

            {/* Text/meta */}
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="mt-3 h-8 w-28 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
