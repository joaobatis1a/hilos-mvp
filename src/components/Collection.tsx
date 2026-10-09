"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";
import { TiltCard } from "./TiltCard";

const items = [
  { name: "Pantalonas", label: "Pantalona HILOS em caimento fluido" },
  { name: "Vestidos", label: "Vestido leve HILOS" },
  { name: "Conjuntos", label: "Conjunto HILOS" },
  { name: "Novidades", label: "Nova coleção HILOS" },
];

export function Collection() {
  return (
    <section id="colecao" className="relative py-24 md:py-32">
      <SectionDot />
      <div className="rail-gutter container-hilos">
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow mb-4 text-terracotta">Coleção</p>
            <RevealLines
              as="h2"
              lines={["Encontre seu movimento."]}
              className="font-display text-3xl font-medium md:text-5xl"
            />
          </div>
        </div>

        <div className="no-scrollbar -mx-6 flex snap-x gap-5 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[72vw] shrink-0 snap-start md:w-auto"
            >
              <TiltCard max={6}>
                <a href="#" className="block">
                  <ImagePlaceholder
                    label={item.label}
                    className="aspect-[3/4] w-full rounded-sm"
                  />
                  <p className="font-display mt-4 text-xl">{item.name}</p>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
