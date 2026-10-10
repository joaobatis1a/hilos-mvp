"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { photos } from "@/lib/content";
import { useCollapseAfterPass, useLatched } from "@/lib/motion";

const TEXT =
  "Um fio se transforma em tecido. O tecido ganha movimento. O movimento encontra quem o veste.";
const HIGHLIGHT = new Set(["fio", "tecido.", "movimento.", "veste."]);

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = 0.08 + (index / total) * 0.62;
  const end = start + 0.62 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const highlight = HIGHLIGHT.has(word);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.25em] inline-block ${highlight ? "text-terracotta italic" : ""}`}
    >
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollYProgress = useLatched(raw);
  const collapsed = useCollapseAfterPass(ref, scrollYProgress);
  const words = TEXT.split(" ");

  const imageScale = useTransform(scrollYProgress, [0, 0.8], [0.55, 1]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.8], [-8, 0]);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const outroOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.72, 0.85], [30, 0]);
  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.min(3, Math.floor(v * 3.6) + 1)).padStart(2, "0"),
  );

  return (
    <section
      id="manifesto"
      ref={ref}
      data-thread="0.035:0.04 0.06:0.35 0.025:0.7 0.05:0.98"
      data-thread-mobile="0.025:0.04 0.04:0.5 0.022:0.98"
      className={collapsed ? "relative" : "relative h-[260vh]"}
    >
      <div
        className={
          collapsed
            ? "flex items-center overflow-hidden py-24 md:py-32"
            : "sticky top-0 flex h-[100svh] items-center overflow-hidden"
        }
      >
        <div className="container-hilos grid grid-cols-1 items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-16">
          <div className="order-2 md:order-1">
            <p className="eyebrow mb-6 flex items-center gap-3 text-terracotta">
              Manifesto
              <span className="h-px w-10 bg-terracotta" />
              <motion.span className="tabular-nums">{counter}</motion.span>
              <span className="text-ink/30">/ 03</span>
            </p>
            <p className="font-display text-[2.2rem] leading-[1.08] font-medium md:text-[4.4vw]">
              {words.map((word, i) => (
                <Word key={`${word}-${i}`} word={word} index={i} total={words.length} progress={scrollYProgress} />
              ))}
            </p>
            <motion.p
              style={{ opacity: outroOpacity, y: outroY }}
              className="mt-8 max-w-md text-base text-ink-soft md:text-lg"
            >
              A HILOS nasce da ideia de criar peças que acompanham diferentes momentos, estilos e
              histórias.
            </motion.p>
          </div>

          <motion.div
            style={{ scale: imageScale, rotate: imageRotate }}
            className="relative order-1 mx-auto aspect-[3/4] h-[34vh] overflow-hidden rounded-t-full md:order-2 md:h-[72vh]"
          >
            <motion.div style={{ scale: innerScale }} className="absolute inset-0">
              <Image
                src={photos.tecidoMovimento}
                alt="Tecido leve em movimento"
                fill
                sizes="(min-width: 768px) 40vw, 60vw"
                placeholder="blur"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-5 text-cream">
              <span className="eyebrow">O tecido ganha movimento</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
