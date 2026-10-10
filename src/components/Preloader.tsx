"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useLenis } from "./SmoothScroll";

const EASE = [0.76, 0, 0.24, 1] as const;
const LETTERS = ["H", "I", "L", "O", "S"];
const THREAD =
  "M0 70 C80 70 110 20 160 40 C210 60 200 112 160 102 C118 92 150 28 222 40 C300 52 340 92 420 72 C480 56 530 40 600 60";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const lenis = useLenis();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    if (visible) lenis?.stop();
  }, [lenis, visible]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const controls = animate(count, 100, { duration: 2, ease: [0.65, 0, 0.35, 1] });
    const timer = window.setTimeout(() => setVisible(false), 2350);
    return () => {
      controls.stop();
      window.clearTimeout(timer);
    };
  }, [count]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        lenis?.start();
        onDone();
      }}
    >
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[95] flex flex-col items-center justify-center overflow-hidden bg-ink text-cream"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <svg viewBox="0 0 600 130" className="w-[min(560px,80vw)] overflow-visible" aria-hidden>
            <motion.path
              d={THREAD}
              fill="none"
              stroke="var(--color-terracotta)"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>

          <div className="mt-6 flex overflow-hidden font-display text-6xl tracking-[0.18em] md:text-8xl">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.07 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="eyebrow mt-4 text-cream/50"
          >
            Fios em movimento
          </motion.p>

          <motion.span className="absolute right-6 bottom-6 font-display text-5xl text-terracotta tabular-nums md:right-12 md:bottom-10 md:text-7xl">
            {rounded}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
