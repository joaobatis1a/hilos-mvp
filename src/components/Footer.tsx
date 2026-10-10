"use client";

import { Magnetic } from "./Magnetic";
import { RotatingBadge } from "./RotatingBadge";
import { useLenis, scrollToHash } from "./SmoothScroll";
import { locations, menuLinks } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const lenis = useLenis();

  return (
    <footer
      data-thread="0.035:0.0"
      data-thread-mobile="0.025:0.0"
      className="relative overflow-hidden bg-ink pt-24 text-cream md:pt-32"
    >
      <div className="container-hilos">
        <div
          data-thread="0.03:0.45 0.14:1.0 0.6:0.995 0.76:0.5:loop 0.88:0.55"
          data-thread-mobile="0.025:0.6 0.5:1.0 0.96:0.92"
          className="flex flex-col gap-10 border-b border-cream/10 pb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow mb-5 text-rose">HILOS • Pernambuco</p>
            <p className="max-w-xl font-display text-5xl leading-[0.95] md:text-7xl">
              Fios que vestem <span className="text-terracotta italic">seus passos.</span>
            </p>
            <Magnetic className="mt-8 inline-block">
              <a
                href={buildWhatsAppLink("Olá! Vim pelo site da HILOS.")}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow group relative inline-flex overflow-hidden rounded-full bg-terracotta px-7 py-4"
              >
                <span className="absolute inset-0 translate-y-full bg-cream transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-ink">Chamar no WhatsApp</span>
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => scrollToHash(lenis, "#top")}
            aria-label="Voltar ao topo"
            className="group w-32 self-end text-cream/70 transition-colors hover:text-terracotta md:w-40"
          >
            <RotatingBadge text="Voltar ao topo • voltar ao topo • ">
              <span className="text-3xl transition-transform duration-500 group-hover:-translate-y-2">↑</span>
            </RotatingBadge>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div>
            <p className="eyebrow mb-5 text-cream/40">Navegação</p>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(lenis, link.href);
                    }}
                    className="group inline-flex items-center gap-2 font-display text-xl transition-colors hover:text-terracotta"
                  >
                    <span className="h-px w-0 bg-terracotta transition-all duration-300 group-hover:w-5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-cream/40">Onde estamos</p>
            <ul className="space-y-3">
              {locations.map((loc) => (
                <li key={loc.name}>
                  <span className="block font-display text-xl">{loc.name}</span>
                  <span className="eyebrow text-[0.6rem] text-terracotta">{loc.badge}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-cream/40">Contato</p>
            <ul className="space-y-2 font-display text-xl">
              <li>
                <a href={buildWhatsAppLink("Olá! Vim pelo site da HILOS.")} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta">
                  Instagram {siteConfig.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-cream/40">Atacado</p>
            <p className="text-cream/60">Revenda HILOS na sua loja.</p>
            <a
              href="#atacado"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash(lenis, "#atacado");
              }}
              className="mt-3 inline-block font-display text-xl text-terracotta italic hover:text-cream"
            >
              Quero revender →
            </a>
          </div>
        </div>
      </div>


      <div className="container-hilos flex flex-col gap-2 border-t border-cream/10 py-6 text-cream/40 md:flex-row md:justify-between">
        <span className="eyebrow text-[0.6rem]">© 2026 HILOS · Feito em Pernambuco</span>
        <span className="eyebrow text-[0.6rem]">Fotos ilustrativas · Unsplash</span>
      </div>
    </footer>
  );
}
