"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Magnetic } from "./Magnetic";
import { useLenis, scrollToHash } from "./SmoothScroll";
import { photos } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useCollapseAfterPass, useLatched } from "@/lib/motion";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollYProgress = useLatched(raw);
  const collapsed = useCollapseAfterPass(ref, scrollYProgress);

  const clip = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["inset(16% 22% 16% 22% round 2.5rem)", "inset(0% 0% 0% 0% round 0rem)"],
  );
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.35, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.65], [80, 0]);
  const lineOneX = useTransform(scrollYProgress, [0.3, 0.7], ["-20%", "0%"]);
  const lineTwoX = useTransform(scrollYProgress, [0.3, 0.7], ["20%", "0%"]);

  return (
    <section
      ref={ref}
      data-thread="0.95:0.02 0.96:0.3 0.96:0.5:loop 0.95:0.86 0.035:0.995"
      data-thread-mobile="0.975:0.02 0.84:0.08:loop 0.975:0.4 0.975:0.85 0.025:0.995"
      className={collapsed ? "relative h-[100svh]" : "relative h-[220vh]"}
    >
      <div className={`${collapsed ? "relative" : "sticky top-0"} h-[100svh] overflow-hidden`}>
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-ink">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0">
            <Image
              src={photos.vestidoFluido}
              alt="Modelo com vestido fluido HILOS"
              fill
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[50%_30%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-ink/45" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative flex h-full flex-col items-center justify-center px-5 text-center text-cream"
        >
          <p className="eyebrow mb-6 text-rose">Pronta para o próximo passo?</p>
          <h2 className="font-display text-[17vw] leading-[0.85] font-medium md:text-[10vw]">
            <motion.span style={{ x: lineOneX }} className="block">
              Qual é o
            </motion.span>
            <motion.span style={{ x: lineTwoX }} className="block text-terracotta italic">
              seu estilo?
            </motion.span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <a
                href={buildWhatsAppLink("Olá! Vi o site da HILOS e quero conversar.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("final_cta_whatsapp_click")}
                className="eyebrow group relative inline-flex overflow-hidden rounded-full bg-cream px-8 py-5 text-ink"
              >
                <span className="absolute inset-0 translate-y-full bg-terracotta transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-cream">Falar com a HILOS</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#movimento"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent("final_cta_northway_click");
                  scrollToHash(lenis, "#movimento");
                }}
                className="eyebrow inline-flex rounded-full border border-cream/50 px-8 py-5 transition-colors hover:border-terracotta hover:bg-terracotta"
              >
                Visitar o North Way
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
