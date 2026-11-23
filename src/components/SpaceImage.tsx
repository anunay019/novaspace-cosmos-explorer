import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SpaceImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function SpaceImage({ src, alt, className = '', imgClassName = '' }: SpaceImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#0a0f1e] ${className}`}>
      {!loaded && !errored && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#131b35] to-[#090d1a] animate-pulse"
        />
      )}

      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0d1428] via-[#161233] to-[#080c18] p-4 text-center">
          <Sparkles className="h-6 w-6 text-cyan-400/70" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-300">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full object-cover transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
