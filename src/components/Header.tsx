"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#colecao", label: "Coleção" },
  { href: "#movimento", label: "Locais" },
  { href: "#atacado", label: "Atacado" },
];

export function Header() {
  const whatsappLink = buildWhatsAppLink(
    "Olá! Vim pelo site da HILOS e queria saber mais.",
  );

  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 140],
    ["rgba(247,242,233,0.4)", "rgba(247,242,233,0.95)"],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 140],
    ["rgba(22,19,13,0)", "rgba(22,19,13,0.12)"],
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 140],
    ["0 1px 0 rgba(22,19,13,0)", "0 10px 30px -14px rgba(22,19,13,0.25)"],
  );

  return (
    <motion.header
      style={{ backgroundColor: background, boxShadow }}
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm"
    >
      <motion.div
        style={{ borderBottomColor: borderColor }}
        className="container-hilos flex h-16 items-center justify-between border-b md:h-20"
      >
        <a
          href="#top"
          className="font-display text-xl tracking-wide transition-transform duration-300 hover:scale-105 md:text-2xl"
        >
          HILOS
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="eyebrow group relative py-1 text-ink-soft transition-colors hover:text-terracotta"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-terracotta transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <Magnetic strength={0.3}>
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("header_whatsapp_click")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="eyebrow inline-block rounded-full bg-ink px-4 py-2 text-cream transition-colors hover:bg-terracotta md:px-5 md:py-2.5"
          >
            Falar no WhatsApp
          </motion.a>
        </Magnetic>
      </motion.div>
    </motion.header>
  );
}
