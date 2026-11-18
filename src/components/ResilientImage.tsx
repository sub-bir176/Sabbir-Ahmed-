import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200/70 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800/70 dark:to-zinc-900 text-zinc-500 dark:text-zinc-400 p-6 text-center ${className}`}
      >
        <Layers className="w-7 h-7 mb-2 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-display text-sm font-medium text-zinc-700 dark:text-zinc-200 tracking-tight">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
