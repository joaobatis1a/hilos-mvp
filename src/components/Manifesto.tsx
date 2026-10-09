"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";

const lines = [
  "Um fio se transforma em tecido.",
  "O tecido ganha movimento.",
  "O movimento encontra quem o veste.",
];

function ScrollLine({
  text,
  index,
  total,
  progress,
}: {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 0.6 / total;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const x = useTransform(progress, [start, end], [-18, 0]);

  return (
    <motion.p
      style={{ opacity, x }}
      className="font-display text-xl text-ink-soft italic md:text-2xl"
    >
      {text}
    </motion.p>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  return (
    <section ref={ref} className="relative py-24 md:py-36">
      <SectionDot />
      <div className="rail-gutter container-hilos max-w-3xl">
        <p className="eyebrow mb-6 text-terracotta">Manifesto</p>
        <RevealLines
          as="h2"
          lines={["Cada peça começa por um fio."]}
          className="font-display mb-10 text-3xl leading-tight font-medium md:text-5xl"
        />

        <div className="space-y-2">
          {lines.map((line, i) => (
            <ScrollLine
              key={line}
              text={line}
              index={i}
              total={lines.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 max-w-xl text-base text-ink-soft md:text-lg"
        >
          A HILOS nasce da ideia de criar peças que acompanham diferentes
          momentos, estilos e histórias.
        </motion.p>
      </div>
    </section>
  );
}
