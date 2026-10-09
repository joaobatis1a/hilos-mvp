"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RevealLines } from "./RevealLines";
import { Magnetic } from "./Magnetic";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  const whatsappLink = buildWhatsAppLink(
    "Olá! Vi o site da HILOS e quero saber onde encontrar as peças.",
  );

  return (
    <section id="top" className="relative pt-16 md:pt-20">
      <div className="rail-gutter container-hilos grid min-h-[92vh] grid-cols-1 items-center gap-10 py-10 md:min-h-screen md:grid-cols-2 md:gap-16 md:py-16">
        <div className="order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="eyebrow mb-5 text-terracotta"
          >
            HILOS • Pernambuco
          </motion.p>

          <RevealLines
            as="h1"
            trigger="mount"
            delay={0.2}
            stagger={0.1}
            lines={["Fios que vestem", "seus passos."]}
            className="font-display text-[2.6rem] leading-[1.08] font-medium md:text-6xl lg:text-[4.2rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 max-w-md text-base text-ink-soft md:text-lg"
          >
            Peças leves, autênticas e feitas para acompanhar cada movimento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Magnetic>
              <motion.a
                href="#colecao"
                onClick={() => trackEvent("hero_cta_colecao_click")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="eyebrow inline-block rounded-full bg-ink px-6 py-3.5 text-cream transition-colors hover:bg-terracotta"
              >
                Conheça a coleção
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a
                href="#movimento"
                onClick={() => trackEvent("hero_cta_locais_click")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="eyebrow inline-block rounded-full border border-ink/30 px-6 py-3.5 text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Onde encontrar
              </motion.a>
            </Magnetic>
          </motion.div>

          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("hero_whatsapp_click")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="eyebrow mt-8 inline-block text-ink-soft underline decoration-terracotta/50 decoration-2 underline-offset-4 hover:text-terracotta"
          >
            ou fale direto no WhatsApp
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="order-1 md:order-2"
        >
          <ImagePlaceholder
            label="Modelo com pantalona HILOS em movimento"
            tone="rose"
            ambient
            className="aspect-[4/5] w-full rounded-sm md:aspect-[3/4]"
          />
        </motion.div>
      </div>
    </section>
  );
}
