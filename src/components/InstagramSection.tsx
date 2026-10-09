"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";
import { Magnetic } from "./Magnetic";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function InstagramSection() {
  return (
    <section className="relative py-24 md:py-32">
      <SectionDot />
      <div className="rail-gutter container-hilos">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow mb-4 text-terracotta">Comunidade</p>
            <RevealLines
              as="h2"
              lines={["Vista HILOS. Marque HILOS."]}
              className="font-display text-3xl font-medium md:text-5xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-display mt-3 text-xl text-terracotta italic"
            >
              #usehilos
            </motion.p>
          </div>
          <Magnetic>
            <motion.a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("instagram_follow_click")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="eyebrow inline-block rounded-full border border-ink/30 px-6 py-3 transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Seguir no Instagram
            </motion.a>
          </Magnetic>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ImagePlaceholder
                label="UGC"
                tone={i % 2 === 0 ? "sand" : "rose"}
                className="aspect-square w-full rounded-sm"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
