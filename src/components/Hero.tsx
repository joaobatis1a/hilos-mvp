"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, type PointerEvent } from "react";
import { Magnetic } from "./Magnetic";
import { RotatingBadge } from "./RotatingBadge";
import { SplitText } from "./SplitText";
import { useLenis, scrollToHash } from "./SmoothScroll";
import { photos } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const EASE = [0.76, 0, 0.24, 1] as const;
const WORDMARK = ["H", "I", "L", "O", "S"];

function ParallaxPhoto({
  src,
  alt,
  depth,
  mx,
  my,
  scrollY,
  play,
  delay,
  className,
  imageClassName = "",
  preload = false,
  sizes,
}: {
  src: StaticImageData;
  alt: string;
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scrollY: MotionValue<number>;
  play: boolean;
  delay: number;
  className: string;
  imageClassName?: string;
  preload?: boolean;
  sizes: string;
}) {
  const x = useTransform(mx, (v) => v * depth * 46);
  const y = useTransform([my, scrollY], ([m, s]: number[]) => m * depth * 46 - s * depth * 0.35);

  return (
    <motion.div style={{ x, y }} className={className}>
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={play ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.3, ease: EASE, delay }}
        className={`relative h-full w-full overflow-hidden ${imageClassName}`}
      >
        <motion.div
          initial={{ scale: 1.35 }}
          animate={play ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay }}
          className="absolute inset-0"
        >
          <Image src={src} alt={alt} fill sizes={sizes} preload={preload} placeholder="blur" className="object-cover" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mxRaw.set((e.clientX - rect.left) / rect.width - 0.5);
    myRaw.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      data-thread="0.5:0.045 0.53:0.2 0.5:0.5:loop 0.25:0.86 0.04:0.98"
      data-thread-mobile="0.5:0.03 0.975:0.09 0.975:0.4 0.6:0.6:loop 0.04:0.97"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 pb-16 md:pb-0"
    >
      <motion.div
        aria-hidden
        style={{ y: wordmarkY }}
        className="pointer-events-none absolute inset-x-0 bottom-[11vh] flex justify-center font-display text-[31vw] leading-[0.8] font-medium text-outline-ink opacity-60 select-none md:bottom-[6vh] md:text-[27vw]"
      >
        {WORDMARK.map((letter, i) => (
          <span key={letter} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 + i * 0.08 }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </motion.div>

      <div className="container-hilos relative flex flex-1 flex-col md:block">
        <ParallaxPhoto
          src={photos.conjuntoEstampado}
          alt="Modelo com conjunto estampado HILOS"
          depth={0.6}
          mx={mx}
          my={my}
          scrollY={scrollY}
          play
          delay={0.35}
          preload
          sizes="(min-width: 768px) 32vw, 80vw"
          className="relative z-10 order-2 mx-auto mt-8 aspect-[3/4] w-[82%] md:absolute md:top-[4vh] md:right-[9vw] md:mt-0 md:h-[74vh] md:w-auto"
          imageClassName="rounded-t-full"
        />

        <ParallaxPhoto
          src={photos.pantalonaLinho}
          alt="Pantalona de linho HILOS"
          depth={1.3}
          mx={mx}
          my={my}
          scrollY={scrollY}
          play
          delay={0.6}
          sizes="(min-width: 768px) 14vw, 38vw"
          className="absolute right-2 bottom-[16vh] z-20 aspect-[3/4] w-[36%] md:right-[34vw] md:bottom-[14vh] md:w-[13vw]"
          imageClassName="rounded-full"
        />

        <ParallaxPhoto
          src={photos.vestidoOmbro}
          alt="Vestido HILOS"
          depth={-0.9}
          mx={mx}
          my={my}
          scrollY={scrollY}
          play
          delay={0.8}
          sizes="12vw"
          className="absolute top-[12vh] right-[3vw] z-0 hidden aspect-square w-[11vw] md:block"
          imageClassName="rounded-[2rem] rotate-6"
        />

        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="relative z-30 order-1 pt-6 md:absolute md:top-[18vh] md:left-16 md:max-w-[46vw] md:pt-0"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="eyebrow mb-6 flex items-center gap-3 text-terracotta"
          >
            <span className="h-px w-10 bg-terracotta" />
            Coleção Verão • Pernambuco
          </motion.p>

          <h1 className="font-display text-[3.4rem] leading-[0.92] font-medium tracking-tight md:text-[6.4vw]">
            <SplitText text="Fios que vestem" play delay={0.3} className="block" />
            <span className="block">
              <SplitText text="seus" play delay={0.65} />{" "}
              <SplitText text="passos." play delay={0.75} className="text-terracotta italic" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-6 max-w-sm text-base text-ink-soft md:text-lg"
          >
            Peças leves, autênticas e feitas para acompanhar cada movimento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#colecao"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent("hero_cta_colecao_click");
                  scrollToHash(lenis, "#colecao");
                }}
                className="eyebrow group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-7 py-4 text-cream"
              >
                <span className="absolute inset-0 -translate-x-full bg-terracotta transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0" />
                <span className="relative">Conheça a coleção</span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={buildWhatsAppLink("Olá! Vi o site da HILOS e quero saber onde encontrar as peças.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("hero_whatsapp_click")}
                className="eyebrow inline-flex items-center gap-2 rounded-full border border-ink/30 px-6 py-4 transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Falar no WhatsApp
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[62vh] right-[5vw] z-30 hidden w-32 text-ink md:block"
        >
          <RotatingBadge text="Feito em Pernambuco • Leve • Fluido • ">
            <span className="font-display text-3xl text-terracotta italic">H</span>
          </RotatingBadge>
        </motion.div>
      </div>

    </section>
  );
}
