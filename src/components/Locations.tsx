"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RevealLines } from "./RevealLines";
import { locations } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const EASE = [0.76, 0, 0.24, 1] as const;

export function Locations() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % locations.length), 4200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      id="movimento"
      data-thread="0.03:0.02 0.5:0.05 0.97:0.09 0.975:0.9"
      data-thread-mobile="0.975:0.0 0.5:0.035 0.025:0.075 0.03:0.3 0.55:0.6:loop 0.03:0.97"
      className="relative py-24 md:py-32"
    >
      <div className="container-hilos">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="eyebrow mb-4 text-terracotta">HILOS em movimento</p>
            <RevealLines
              as="h2"
              lines={["A HILOS também", "está perto de você."]}
              className="font-display text-[2.4rem] leading-[0.95] font-medium sm:text-5xl md:text-7xl"
            />
          </div>
          <p className="max-w-xs text-ink-soft">
            Ponto fixo, eventos e pop-ups pela região. Toque em um local para ver mais.
          </p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex h-[78vh] flex-col gap-3 md:h-[68vh] md:flex-row"
        >
          {locations.map((loc, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={loc.name}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={isActive}
                animate={{ flexGrow: isActive ? 5 : 1 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="group relative min-h-[64px] basis-0 overflow-hidden rounded-[2rem] text-left text-cream"
              >
                <motion.div
                  animate={{ scale: isActive ? 1 : 1.25 }}
                  transition={{ duration: 1.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={loc.image}
                    alt={`Loja HILOS em ${loc.name}`}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    placeholder="blur"
                    className={`object-cover transition-[filter] duration-700 ${
                      isActive ? "grayscale-0" : "grayscale"
                    }`}
                  />
                </motion.div>
                <div
                  className={`absolute inset-0 transition-colors duration-700 ${
                    isActive ? "bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" : "bg-ink/55"
                  }`}
                />

                <span className="absolute top-5 left-6 font-display text-xl text-cream/70">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <AnimatePresence>
                  {!isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-6 bottom-5 font-display text-2xl whitespace-nowrap md:right-auto md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:rotate-180 md:text-3xl md:[writing-mode:vertical-rl]"
                    >
                      {loc.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10"
                    >
                      <span className="eyebrow mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta px-3 py-1.5 text-[0.62rem]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cream" />
                        {loc.badge}
                      </span>
                      <p className="font-display text-5xl leading-none md:text-7xl">{loc.name}</p>
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                        <p className="max-w-sm text-cream/80">{loc.description}</p>
                        <a
                          href={buildWhatsAppLink(`Olá! Quero saber como encontrar a HILOS em ${loc.name}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackEvent("location_whatsapp_click", { location: loc.name });
                          }}
                          className="eyebrow rounded-full border border-cream/40 px-5 py-3 transition-colors hover:border-terracotta hover:bg-terracotta"
                        >
                          Como chegar
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isActive && !paused && (
                  <motion.span
                    key={`bar-${active}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4.2, ease: "linear" }}
                    className="absolute inset-x-0 top-0 h-1 origin-left bg-terracotta"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-ink-soft/70">
          * Fotos ilustrativas e agenda sujeitas a confirmação — substituir pelas fotos reais dos pontos HILOS.
        </p>
      </div>
    </section>
  );
}
