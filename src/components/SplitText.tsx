"use client";

import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

export function SplitText({
  text,
  play,
  delay = 0,
  stagger = 0.025,
  className = "",
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(" ");
  let index = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const i = index++;
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%", rotate: 8 }}
                  animate={play ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 8 }}
                  transition={{ duration: 0.9, ease: EASE, delay: delay + i * stagger }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
