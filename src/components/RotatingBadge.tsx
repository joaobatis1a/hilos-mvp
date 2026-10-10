"use client";

import { useId } from "react";

export function RotatingBadge({
  text,
  className = "",
  children,
}: {
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id={`circle-${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current text-[15px] font-semibold tracking-[0.32em] uppercase">
          <textPath href={`#circle-${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
