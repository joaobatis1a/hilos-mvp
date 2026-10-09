"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ImagePlaceholder({
  label,
  tone = "sand",
  className = "",
  ambient = false,
}: {
  label: string;
  tone?: "sand" | "ink" | "rose";
  className?: string;
  ambient?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const svgY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  const toneClasses =
    tone === "ink"
      ? "bg-ink text-cream/70"
      : tone === "rose"
        ? "bg-rose text-ink-soft"
        : "bg-sand text-ink-soft";

  return (
    <motion.div
      ref={ref}
      animate={ambient ? { scale: [1, 1.035, 1] } : undefined}
      transition={
        ambient
          ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      whileHover={{
        scale: 1.045,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`relative overflow-hidden ${toneClasses} ${className}`}
    >
      <motion.svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        style={{ y: svgY }}
      >
        <motion.path
          d="M -20 60 C 100 20, 140 160, 260 120 S 380 260, 320 340 S 180 420, 220 500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </motion.svg>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ skewX: -12 }}
        initial={{ x: "-130%" }}
        whileInView={{ x: "130%" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
      />

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="eyebrow opacity-70">{label}</span>
        <span className="eyebrow opacity-40">HILOS</span>
      </div>
    </motion.div>
  );
}
