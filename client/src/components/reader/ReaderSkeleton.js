// src/components/reader/ReaderSkeleton.js
import Skeleton from '@/components/ui/Skeleton';

export default function ReaderSkeleton({ isFullscreen }) {
  return (
    <>
      {/* Header (hidden in fullscreen) */}
      {!isFullscreen && (
        <header className="mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center">
          <div className="relative mx-auto aspect-[2/3] w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 overflow-hidden rounded-md">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="mt-4 flex flex-col items-center space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </header>
      )}

      {/* 3-column layout with placeholder text */}
      <section className="flex min-h-0 flex-1">
        {!isFullscreen && (
          <aside
            className="w-[clamp(0px,8vw,240px)]"
            aria-hidden="true"
          />
        )}

        <div
          className={
            isFullscreen
              ? 'reader-content mx-auto w-screen max-w-none px-6 sm:px-10 py-6 min-h-[100dvh]'
              : 'reader-content mx-auto w-full max-w-[var(--reader-max)] px-4 py-4'
          }
        >
          <div className="space-y-4" role="status" aria-label="Loading book">
            {/* Several blocks of lines to mimic paragraphs */}
            {Array.from({ length: 4 }).map((_, blockIdx) => (
              <div key={blockIdx} className="space-y-2">
                {Array.from({ length: 6 }).map((_, lineIdx) => (
                  <Skeleton
                    key={lineIdx}
                    className={`h-3 ${
                      lineIdx % 3 === 0
                        ? 'w-11/12'
                        : lineIdx % 3 === 1
                        ? 'w-9/12'
                        : 'w-10/12'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {!isFullscreen && (
          <div
            className="w-[clamp(0px,8vw,240px)]"
            aria-hidden="true"
          />
        )}
      </section>
    </>
  );
}
