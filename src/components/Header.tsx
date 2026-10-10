"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { MenuOverlay } from "./MenuOverlay";
import { Magnetic } from "./Magnetic";
import { useLenis, scrollToHash } from "./SmoothScroll";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const EASE = [0.76, 0, 0.24, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setSolid(current > 60);
    setHidden(current > 320 && current > previous && !open);
  });

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) lenis?.stop();
    else lenis?.start();
  }

  function navigate(hash: string) {
    setOpen(false);
    lenis?.start();
    window.setTimeout(() => scrollToHash(lenis, hash), 500);
  }

  const light = open;

  return (
    <>
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed top-0 right-0 left-0 z-50"
      >
        <motion.div
          animate={{
            backgroundColor: solid && !open ? "rgba(247,242,233,0.82)" : "rgba(247,242,233,0)",
            borderColor: solid && !open ? "rgba(22,19,13,0.1)" : "rgba(22,19,13,0)",
          }}
          className="border-b backdrop-blur-[2px]"
        >
          <div className="container-hilos grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-20">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="menu-overlay"
              className={`group flex items-center gap-3 justify-self-start transition-colors duration-500 ${
                light ? "text-cream" : "text-ink"
              }`}
            >
              <span className="relative block h-3 w-7">
                <motion.span
                  className="absolute left-0 h-[1.5px] w-full bg-current"
                  animate={open ? { top: "50%", rotate: 45 } : { top: "0%", rotate: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
                <motion.span
                  className="absolute left-0 h-[1.5px] bg-current"
                  animate={
                    open
                      ? { top: "50%", rotate: -45, width: "100%" }
                      : { top: "100%", rotate: 0, width: "65%" }
                  }
                  transition={{ duration: 0.45, ease: EASE }}
                />
              </span>
              <span className="eyebrow relative hidden h-4 overflow-hidden sm:block">
                <motion.span
                  className="block"
                  animate={{ y: open ? "-100%" : "0%" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="block h-4">Menu</span>
                  <span className="block h-4">Fechar</span>
                </motion.span>
              </span>
            </button>

            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                if (open) navigate("#top");
                else scrollToHash(lenis, "#top");
              }}
              className={`justify-self-center font-display text-xl tracking-[0.22em] transition-colors md:text-3xl md:tracking-[0.32em] duration-500 ${
                light ? "text-cream" : "text-ink"
              }`}
            >
              HILOS
            </a>

            <div className="justify-self-end">
              <Magnetic strength={0.08}>
                <a
                  href={buildWhatsAppLink("Olá! Vim pelo site da HILOS e queria saber mais.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("header_whatsapp_click")}
                  className={`eyebrow group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 transition-colors duration-500 md:px-5 ${
                    light
                      ? "border-cream/40 text-cream"
                      : "border-ink text-ink hover:text-cream"
                  }`}
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-terracotta transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-terracotta transition-colors group-hover:bg-cream" />
                  <span className="relative">
                    <span className="hidden sm:inline">Comprar no </span>WhatsApp
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </motion.header>

      <MenuOverlay open={open} onNavigate={navigate} onClose={toggle} />
    </>
  );
}
