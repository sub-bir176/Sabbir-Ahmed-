import { useState } from 'react';
import { PlexusCanvas } from './PlexusCanvas';

export function EditorialRibbon() {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="relative w-full bg-[#04091A] border-0 overflow-hidden select-none"
    >
      {/* Sleek low-profile borderless dark 3D particle ribbon */}
      <div
        onPointerDown={() => setHasInteracted(true)}
        className="relative w-full h-[72px] sm:h-[82px] md:h-[90px] overflow-hidden cursor-crosshair border-0"
      >
        <PlexusCanvas />

        {/* Subtle text-only interaction hint */}
        <div
          className={`pointer-events-none absolute bottom-1.5 right-4 text-[10px] font-mono text-cyan-200/60 transition-opacity duration-500 ${
            hasInteracted ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Move cursor or click to ripple
        </div>
      </div>
    </div>
  );
}
