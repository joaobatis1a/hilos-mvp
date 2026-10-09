"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SectionDot } from "./ThreadRail";
import { RevealLines } from "./RevealLines";
import { Magnetic } from "./Magnetic";
import { TiltCard } from "./TiltCard";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const features = [
  "Viscolinho",
  "Caimento fluido",
  "Cintura confortável",
  "Estampas exclusivas",
];

export function FeaturedProduct() {
  const whatsappLink = buildWhatsAppLink(
    "Olá! Vi a Pantalona HILOS no site e gostaria de saber tamanhos e disponibilidade.",
  );

  return (
    <section className="relative py-24 md:py-32">
      <SectionDot />
      <div className="rail-gutter container-hilos grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={5}>
            <ImagePlaceholder
              label="Pantalona HILOS — frente inteira"
              tone="sand"
              className="aspect-[4/5] w-full rounded-sm"
            />
          </TiltCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-4 text-terracotta">Produto destaque</p>
          <RevealLines
            as="h2"
            lines={["Pantalona HILOS"]}
            className="font-display text-3xl font-medium md:text-5xl"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display mt-4 text-xl text-ink-soft italic"
          >
            Leve. Fluida. Autêntica.
          </motion.p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-2 text-sm text-ink-soft md:text-base"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.35 + i * 0.08,
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-terracotta"
                />
                {feature}
              </motion.li>
            ))}
          </ul>

          <Magnetic className="mt-10 inline-block">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("product_whatsapp_click", { product: "pantalona_hilos" })
              }
              whileHover={{ scale: 1.045 }}
              whileTap={{ scale: 0.95 }}
              className="eyebrow inline-block rounded-full bg-ink px-7 py-4 text-cream transition-colors hover:bg-terracotta"
            >
              Quero essa peça
            </motion.a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
