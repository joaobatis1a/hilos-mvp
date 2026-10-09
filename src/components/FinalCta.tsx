"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";
import { Magnetic } from "./Magnetic";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function FinalCta() {
  const whatsappLink = buildWhatsAppLink("Olá! Vi o site da HILOS e quero conversar.");

  return (
    <section className="relative py-24 md:py-32">
      <SectionDot />
      <div className="rail-gutter container-hilos">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:order-2"
          >
            <ImagePlaceholder
              label="Coleção HILOS completa"
              tone="rose"
              ambient
              className="aspect-[4/5] w-full rounded-sm"
            />
          </motion.div>

          <div className="md:order-1">
            <RevealLines
              as="h2"
              lines={["Qual é o", "seu estilo?"]}
              className="font-display text-4xl font-medium md:text-6xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Magnetic>
                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("final_cta_whatsapp_click")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="eyebrow inline-block rounded-full bg-ink px-7 py-4 text-cream transition-colors hover:bg-terracotta"
                >
                  Falar com a HILOS
                </motion.a>
              </Magnetic>
              <Magnetic>
                <motion.a
                  href="#movimento"
                  onClick={() => trackEvent("final_cta_northway_click")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="eyebrow inline-block rounded-full border border-ink/30 px-7 py-4 text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Visitar o North Way
                </motion.a>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-14 flex items-center gap-3 text-ink-soft"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-10 origin-left bg-terracotta"
              />
              <span className="font-display text-lg">HILOS</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
