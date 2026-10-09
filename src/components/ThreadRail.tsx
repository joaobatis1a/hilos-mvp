"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type RefObject } from "react";

export function ThreadRail({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.3,
  });

  const cometTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-[22px] z-20 h-full w-px md:left-[46px]"
    >
      <div className="absolute inset-0 bg-ink/10" />
      <motion.div
        className="absolute inset-0 origin-top bg-terracotta shadow-[0_0_0_0.5px_rgba(247,242,233,0.25)]"
        style={{ scaleY: progress }}
      />
      <motion.div
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta"
        style={{ top: cometTop }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-terracotta"
          animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

export function SectionDot({ tone = "cream" }: { tone?: "cream" | "ink" }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-2 left-[22px] z-20 -translate-x-1/2 md:left-[46px]"
    >
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={`block h-[9px] w-[9px] rounded-full ring-4 ${
          tone === "ink" ? "ring-ink" : "ring-cream"
        } bg-terracotta`}
      />
    </div>
  );
}
