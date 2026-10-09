"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function TiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRX = useSpring(rx, { stiffness: 220, damping: 22 });
  const springRY = useSpring(ry, { stiffness: 220, damping: 22 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  }

  function handleMouseLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 900 }}
      className={className}
    >
      <motion.div style={{ rotateX: springRX, rotateY: springRY }}>
        {children}
      </motion.div>
    </div>
  );
}
