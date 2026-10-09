"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type Ref } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TAG_MAP = {
  h1: motion.h1,
  h2: motion.h2,
  div: motion.div,
} as const;

type RevealLinesProps = {
  lines: string[];
  as?: keyof typeof TAG_MAP;
  className?: string;
  lineClassName?: string;
  trigger?: "scroll" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
};

function MountReveal({
  lines,
  as = "div",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  duration = 0.85,
}: Omit<RevealLinesProps, "trigger">) {
  const MotionTag = TAG_MAP[as];

  return (
    <MotionTag className={className}>
      {lines.map((text, i) => (
        <span key={text} className={`block overflow-hidden ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration, ease: EASE, delay: delay + i * stagger }}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

function ScrollLine({
  text,
  lineClassName,
  progress,
  start,
  end,
}: {
  text: string;
  lineClassName: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  return (
    <span className={`block overflow-hidden ${lineClassName}`}>
      <motion.span style={{ y }} className="block will-change-transform">
        {text}
      </motion.span>
    </span>
  );
}

function ScrollReveal({
  lines,
  as = "div",
  className = "",
  lineClassName = "",
}: Omit<RevealLinesProps, "trigger" | "delay" | "stagger" | "duration">) {
  const MotionTag = TAG_MAP[as];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.55"],
  });

  return (
    <MotionTag ref={ref as Ref<never>} className={className}>
      {lines.map((text, i) => {
        const start = Math.min(i * 0.18, 0.6);
        const end = Math.min(start + 0.45, 1);
        return (
          <ScrollLine
            key={text}
            text={text}
            lineClassName={lineClassName}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </MotionTag>
  );
}

export function RevealLines({ trigger = "scroll", ...props }: RevealLinesProps) {
  return trigger === "mount" ? <MountReveal {...props} /> : <ScrollReveal {...props} />;
}
