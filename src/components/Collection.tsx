"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type WheelEvent } from "react";
import { useCollapseAfterPass, useLatched } from "@/lib/motion";
import { products, type Product } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const TAG_SHAPE = "polygon(14% 0, 86% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)";

function ProductCard({
  product,
  index,
  velocity,
}: {
  product: Product;
  index: number;
  velocity: MotionValue<number>;
}) {
  const swing = useSpring(
    useTransform(velocity, [-3000, 0, 3000], [16, 0, -16], { clamp: true }),
    { stiffness: 60 + index * 12, damping: 6, mass: 0.8 },
  );
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative w-[74vw] shrink-0 pb-28 sm:w-[46vw] md:w-[24vw]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-sand">
        <Image
          src={product.image}
          alt={`${product.name} HILOS`}
          fill
          draggable={false}
          sizes="(min-width: 768px) 24vw, 74vw"
          placeholder="blur"
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-5 font-display text-7xl leading-none text-outline-cream md:text-8xl">
          {number}
        </span>
        <span className="eyebrow absolute top-[18%] left-1/2 -translate-x-1/2 rounded-full bg-cream/85 px-3 py-1.5 text-[0.62rem] text-ink backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <motion.div
        style={{ rotate: swing, transformOrigin: "50% 0%" }}
        whileHover={{ rotate: -6 }}
        className="absolute right-4 bottom-0 w-48 md:right-6"
      >
        <svg aria-hidden viewBox="0 0 40 60" className="absolute -top-14 left-1/2 h-16 w-10 -translate-x-1/2 overflow-visible">
          <path
            d="M20 60 C 6 44, 34 30, 18 14 S 22 2, 22 -6"
            fill="none"
            stroke="var(--color-terracotta)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{ clipPath: TAG_SHAPE }}
          className="relative bg-cream px-5 pt-7 pb-5 shadow-[0_18px_40px_-20px_rgba(22,19,13,0.45)] ring-1 ring-ink/10"
        >
          <span className="absolute top-2.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sand ring-1 ring-ink/25" />
          <p className="eyebrow text-[0.6rem] text-terracotta">N° {number} · HILOS</p>
          <h3 className="mt-1 font-display text-2xl leading-tight">{product.name}</h3>
          <p className="mt-1 text-xs text-ink-soft">
            {product.fabric} · {product.sizes}
          </p>
          <a
            href={buildWhatsAppLink(
              `Olá! Vi o ${product.name} no site da HILOS e quero saber tamanhos e disponibilidade.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("product_whatsapp_click", { product: product.name })}
            className="eyebrow mt-4 flex items-center justify-between border-t border-ink/15 pt-3 text-[0.62rem] transition-colors hover:text-terracotta"
          >
            Quero essa peça <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </motion.div>
    </article>
  );
}

export function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress: raw } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const scrollYProgress = useLatched(raw);
  const collapsed = useCollapseAfterPass(sectionRef, scrollYProgress);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });
  const freeX = useMotionValue(0);
  const trackProgress = useMotionValue(0);
  const count = useTransform(trackProgress, (v) =>
    String(Math.min(products.length, Math.round(v * (products.length - 1)) + 1)).padStart(2, "0"),
  );
  const titleX = useTransform(trackProgress, [0, 1], ["0%", "-12%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!collapsed) trackProgress.set(Math.min(Math.max((v - 0.04) / 0.92, 0), 1));
  });
  useMotionValueEvent(freeX, "change", (v) => {
    if (collapsed && distance) trackProgress.set(Math.min(Math.max(-v / distance, 0), 1));
  });

  useEffect(() => {
    if (collapsed) freeX.set(smoothX.get());
  }, [collapsed, freeX, smoothX]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const clamp = (v: number) => Math.min(Math.max(v, -distance), 0);

  function step(direction: 1 | -1) {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    const width = card ? card.offsetWidth + 40 : window.innerWidth * 0.3;
    animate(freeX, clamp(freeX.get() - direction * width), {
      type: "spring",
      stiffness: 140,
      damping: 24,
    });
  }

  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (!collapsed || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    freeX.set(clamp(freeX.get() - e.deltaX));
  }

  return (
    <section
      id="colecao"
      ref={sectionRef}
      data-thread="0.05:0.02 0.022:0.3 0.045:0.62 0.02:0.97"
      data-thread-mobile="0.022:0.02 0.035:0.4 0.022:0.97"
      className={collapsed ? "relative bg-cream" : "relative h-[420vh] bg-cream"}
    >
      <div
        className={
          collapsed
            ? "relative flex flex-col gap-8 overflow-hidden py-20 md:gap-10 md:py-24"
            : "sticky top-0 flex h-[100svh] flex-col justify-center gap-8 overflow-hidden md:gap-10"
        }
      >
        <motion.span
          aria-hidden
          style={{ x: titleX }}
          className="pointer-events-none absolute top-[9vh] left-0 font-display text-[22vw] leading-none whitespace-nowrap text-outline-ink opacity-[0.12] select-none"
        >
          Coleção Verão Coleção Verão
        </motion.span>

        <div className="container-hilos relative flex flex-wrap items-end justify-between gap-4 pt-14">
          <div>
            <p className="eyebrow mb-3 text-terracotta">Coleção · Verão</p>
            <h2 className="font-display text-4xl leading-none font-medium md:text-7xl">
              Encontre seu <span className="text-terracotta italic">movimento.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-3xl tabular-nums md:text-4xl">
              <motion.span>{count}</motion.span>
              <span className="text-ink/30"> / {String(products.length).padStart(2, "0")}</span>
            </span>
            <svg viewBox="0 0 160 20" className="hidden w-40 md:block" aria-hidden>
              <path d="M2 10 C 30 0, 50 20, 80 10 S 130 0, 158 10" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
              <motion.path
                d="M2 10 C 30 0, 50 20, 80 10 S 130 0, 158 10"
                fill="none"
                stroke="var(--color-terracotta)"
                strokeWidth="2"
                style={{ pathLength: trackProgress }}
              />
            </svg>
            {collapsed && (
              <div className="flex gap-2">
                {([-1, 1] as const).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => step(dir)}
                    aria-label={dir === 1 ? "Próximas peças" : "Peças anteriores"}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream"
                  >
                    {dir === 1 ? "→" : "←"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x: collapsed ? freeX : smoothX }}
          drag={collapsed ? "x" : false}
          dragConstraints={{ left: -distance, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={() => {
            window.setTimeout(() => {
              dragged.current = false;
            }, 50);
          }}
          onClickCapture={(e) => {
            if (dragged.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onWheel={onWheel}
          className={`flex w-max items-end gap-6 px-5 md:gap-10 md:px-16 ${collapsed ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} velocity={velocity} />
          ))}

          <div className="relative flex aspect-[3/4] w-[74vw] shrink-0 flex-col items-center justify-center gap-6 self-start rounded-t-full bg-ink p-10 text-center text-cream sm:w-[46vw] md:w-[24vw]">
            <p className="eyebrow text-rose">Tem muito mais</p>
            <p className="font-display text-4xl leading-tight">
              Peça o catálogo <span className="text-terracotta italic">completo</span>
            </p>
            <a
              href={buildWhatsAppLink("Olá! Quero receber o catálogo completo da HILOS.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("catalog_whatsapp_click")}
              className="eyebrow rounded-full bg-terracotta px-6 py-3.5 transition-colors hover:bg-cream hover:text-ink"
            >
              Receber no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
