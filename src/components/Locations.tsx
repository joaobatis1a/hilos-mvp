"use client";

import { motion } from "framer-motion";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";

const locations = [
  { name: "North Way", badge: "Ponto HILOS" },
  { name: "Eventos", badge: "Evento" },
  { name: "Aldeia", badge: "Pop-up" },
  { name: "Patteo Olinda", badge: "Próxima edição" },
];

export function Locations() {
  return (
    <section id="movimento" className="relative py-24 md:py-32">
      <SectionDot />
      <div className="rail-gutter container-hilos">
        <p className="eyebrow mb-4 text-terracotta">HILOS em movimento</p>
        <RevealLines
          as="h2"
          lines={["A HILOS também está", "perto de você."]}
          className="font-display mb-12 max-w-xl text-3xl font-medium md:mb-16 md:text-5xl"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ x: 8 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative flex items-center justify-between gap-4 overflow-hidden border-b border-ink/15 py-6"
            >
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08 + 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-terracotta"
              />
              <span className="font-display text-2xl transition-colors group-hover:text-terracotta md:text-3xl">
                {loc.name}
              </span>
              <motion.span
                whileHover={{ scale: 1.08 }}
                className="eyebrow rounded-full border border-terracotta/40 px-3 py-1.5 text-terracotta"
              >
                {loc.badge}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-soft/70">
          * presença e datas sujeitas a confirmação — atualize com a agenda real da HILOS.
        </p>
      </div>
    </section>
  );
}
