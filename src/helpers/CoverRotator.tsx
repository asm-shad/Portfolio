"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  covers: string[];
  /** initial index chosen by the server so we start consistent */
  initialIndex?: number;
  /** how often to rotate (ms). default: 10 minutes */
  intervalMs?: number;
  /** className passed to wrapper (for height/positioning) */
  className?: string;
};

export default function CoverRotator({
  covers,
  initialIndex = 0,
  intervalMs = 10 * 60 * 1000, // 10 minutes
  className,
}: Props) {
  const safeCovers = useMemo(
    () => (Array.isArray(covers) ? covers : []),
    [covers]
  );
  const [idx, setIdx] = useState(
    safeCovers.length > 0 ? initialIndex % safeCovers.length : 0
  );

  useEffect(() => {
    if (safeCovers.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % safeCovers.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [safeCovers.length, intervalMs]);

  const current = safeCovers.length > 0 ? safeCovers[idx] : undefined;

  return (
    <div className={className}>
      {current ? (
        <>
          <Image
            key={current}
            src={current}
            alt="Cover"
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
    </div>
  );
}
