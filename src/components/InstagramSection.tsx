"use client";

import Image, { type StaticImageData } from "next/image";
import { Magnetic } from "./Magnetic";
import { RevealLines } from "./RevealLines";
import { instagramShots } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

function Shot({ src }: { src: StaticImageData }) {
  return (
    <a
      href={siteConfig.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      className="group relative mx-2 block aspect-[4/5] w-44 shrink-0 overflow-hidden rounded-2xl md:mx-3 md:w-64"
    >
      <Image
        src={src}
        alt="Look HILOS no Instagram"
        fill
        sizes="16rem"
        placeholder="blur"
        draggable={false}
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="eyebrow text-cream">{siteConfig.instagramHandle}</span>
      </span>
    </a>
  );
}

function Row({ shots, reverse, duration }: { shots: StaticImageData[]; reverse?: boolean; duration: number }) {
  const loop = [...shots, ...shots];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {loop.map((src, i) => (
              <Shot key={i} src={src} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstagramSection() {
  return (
    <section
      id="comunidade"
      data-thread="0.03:0.05 0.035:0.3 0.5:0.52 0.97:0.68 0.95:0.97"
      data-thread-mobile="0.025:0.04 0.025:0.4 0.5:0.58:loop 0.975:0.82 0.975:0.98"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="container-hilos mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4 text-terracotta">Comunidade</p>
          <RevealLines
            as="h2"
            lines={["Vista HILOS.", "Marque HILOS."]}
            className="font-display text-5xl leading-[0.95] font-medium md:text-7xl"
          />
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <span className="font-display text-6xl text-terracotta italic md:text-8xl">#usehilos</span>
          <Magnetic>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("instagram_follow_click")}
              className="eyebrow inline-flex rounded-full border border-ink px-6 py-3.5 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream"
            >
              Seguir {siteConfig.instagramHandle}
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <Row shots={instagramShots.slice(0, 5)} duration={55} />
        <Row shots={instagramShots.slice(5)} duration={60} reverse />
      </div>
    </section>
  );
}
