"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { categories, menuLinks } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site";

const EASE = [0.76, 0, 0.24, 1] as const;
const ORIGIN = "2.6rem 2.4rem";

export function MenuOverlay({
  open,
  onNavigate,
  onClose,
}: {
  open: boolean;
  onNavigate: (hash: string) => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          initial={{ clipPath: `circle(0% at ${ORIGIN})` }}
          animate={{ clipPath: `circle(150% at ${ORIGIN})` }}
          exit={{ clipPath: `circle(0% at ${ORIGIN})` }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-40 overflow-y-auto bg-ink text-cream"
        >
          <svg
            aria-hidden
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <motion.path
              d="M-20 120 C 260 40, 380 300, 620 220 S 980 40, 1080 260 S 900 620, 1220 700"
              fill="none"
              stroke="var(--color-terracotta)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
            />
          </svg>

          <div className="container-hilos relative grid min-h-full grid-cols-1 gap-10 pt-28 pb-10 md:grid-cols-[1.4fr_1fr] md:pt-32">
            <nav className="flex flex-col justify-center">
              <ul>
                {menuLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.href);
                      }}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                      className="group flex items-baseline gap-4 py-1 md:gap-6"
                    >
                      <span className="eyebrow w-8 text-cream/40 transition-colors group-hover:text-terracotta">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-[2.1rem] leading-[1.1] transition-all duration-500 md:text-[3.4rem] ${
                          active === i
                            ? "translate-x-3 text-terracotta italic"
                            : "text-cream"
                        }`}
                      >
                        {link.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-10 flex flex-wrap gap-2"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onNavigate("#colecao")}
                    className="eyebrow rounded-full border border-cream/25 px-4 py-2 text-cream/80 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            </nav>

            <div className="relative hidden md:block">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active}
                  initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
                  animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="absolute inset-0 overflow-hidden rounded-t-full"
                >
                  <Image
                    src={menuLinks[active].image}
                    alt=""
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/15" />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-4 border-t border-cream/15 pt-6 text-cream/60 md:col-span-2 md:flex-row md:items-center md:justify-between"
            >
              <span className="eyebrow">HILOS • Pernambuco</span>
              <div className="eyebrow flex gap-6">
                <a
                  href={buildWhatsAppLink("Olá! Vim pelo site da HILOS.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta"
                >
                  WhatsApp
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta"
                >
                  Instagram
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
