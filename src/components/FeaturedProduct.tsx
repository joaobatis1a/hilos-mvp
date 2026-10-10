"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Magnetic } from "./Magnetic";
import { RevealLines } from "./RevealLines";
import { photos } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useLatched } from "@/lib/motion";

const HOTSPOTS = [
  { x: 52, y: 40, title: "Cintura confortável", text: "Cós que acompanha o corpo o dia inteiro." },
  { x: 38, y: 64, title: "Caimento fluido", text: "A perna abre e balança a cada passo." },
  { x: 60, y: 82, title: "Viscolinho", text: "Leve, fresco e feito para o calor de Pernambuco." },
];
const SIZES = ["P", "M", "G", "GG"];

export function FeaturedProduct() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(0);
  const [size, setSize] = useState("M");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const revealed = useLatched(scrollYProgress);
  const clip = useTransform(revealed, [0.05, 0.4], ["inset(18% 14% 18% 14% round 999px 999px 0 0)", "inset(0% 0% 0% 0% round 999px 999px 0 0)"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const bigWordX = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);

  const message = `Olá! Vi a Pantalona HILOS no site e quero no tamanho ${size}. Tem disponível?`;

  return (
    <section
      id="destaque"
      ref={ref}
      data-thread="0.97:0.06 0.93:0.45:loop 0.97:0.95"
      data-thread-mobile="0.5:0.015 0.975:0.05 0.78:0.2:loop 0.975:0.55 0.975:0.98"
      className="relative overflow-hidden py-24 md:py-36"
    >
      <motion.span
        aria-hidden
        style={{ x: bigWordX }}
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[26vw] leading-none whitespace-nowrap text-terracotta/[0.07] italic select-none"
      >
        Leve Fluida Autêntica
      </motion.span>

      <div className="container-hilos relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <motion.div style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden bg-sand">
          <motion.div style={{ y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src={photos.pantalonaAlfaiataria}
              alt="Pantalona HILOS vestida por modelo"
              fill
              sizes="(min-width: 768px) 45vw, 92vw"
              placeholder="blur"
              className="object-cover"
            />
          </motion.div>

          {HOTSPOTS.map((spot, i) => (
            <button
              key={spot.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={spot.title}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-terracotta/60" />
                <span className="relative h-3.5 w-3.5 rounded-full border-2 border-cream bg-terracotta" />
              </span>
            </button>
          ))}

          <AnimatePresence mode="wait">
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="absolute right-4 bottom-4 left-4 z-20 rounded-2xl bg-cream/90 p-4 backdrop-blur-md md:right-auto md:max-w-[16rem]"
              >
                <p className="eyebrow text-[0.62rem] text-terracotta">
                  Detalhe {String(active + 1).padStart(2, "0")}
                </p>
                <p className="font-display text-xl">{HOTSPOTS[active].title}</p>
                <p className="text-sm text-ink-soft">{HOTSPOTS[active].text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div>
          <p className="eyebrow mb-5 text-terracotta">Peça assinatura</p>
          <RevealLines
            as="h2"
            lines={["Pantalona", "HILOS"]}
            className="font-display text-6xl leading-[0.9] font-medium md:text-[7.5vw]"
          />
          <p className="mt-6 font-display text-2xl text-ink-soft italic">Leve. Fluida. Autêntica.</p>
          <p className="mt-4 max-w-md text-ink-soft">
            A peça que deu origem à marca: cintura alta, perna ampla e um tecido que se move junto com você.
            Passe o mouse pelos pontos da foto para ver os detalhes.
          </p>

          <div className="mt-10">
            <p className="eyebrow mb-3 text-ink-soft">Escolha seu tamanho</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`relative h-14 w-14 rounded-full font-display text-xl transition-colors ${
                    size === s ? "text-cream" : "border border-ink/20 hover:border-terracotta"
                  }`}
                >
                  {size === s && (
                    <motion.span
                      layoutId="size-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <Magnetic className="mt-10 inline-block">
            <a
              href={buildWhatsAppLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("product_whatsapp_click", { product: "pantalona_hilos", size })}
              className="eyebrow group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-terracotta px-8 py-5 text-cream"
            >
              <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
              <span className="relative">Quero a minha</span>
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-cream font-display text-sm text-ink">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={size}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                  >
                    {size}
                  </motion.span>
                </AnimatePresence>
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
