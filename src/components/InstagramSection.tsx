"use client";

import Image, { type StaticImageData } from "next/image";
import { Magnetic } from "./Magnetic";
import { RevealLines } from "./RevealLines";
import { VelocityMarquee } from "./VelocityMarquee";
import { instagramShots } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

function Shot({ src }: { src: StaticImageData }) {
  return (
    <a
      href={siteConfig.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative mx-3 block aspect-[4/5] w-48 shrink-0 overflow-hidden rounded-2xl md:w-64`}
    >
      <Image src={src} alt="Look HILOS no Instagram" fill sizes="16rem" placeholder="blur" className="object-cover" />
      <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="eyebrow text-cream">{siteConfig.instagramHandle}</span>
      </span>
    </a>
  );
}

export function InstagramSection() {
  const firstRow = [...instagramShots.slice(0, 5), ...instagramShots.slice(0, 5)];
  const secondRow = [...instagramShots.slice(5), ...instagramShots.slice(5)];

  return (
    <section
      id="comunidade"
      data-thread="0.03:0.05 0.035:0.3 0.5:0.52 0.97:0.68 0.95:0.97"
      data-thread-mobile="0.025:0.04 0.025:0.45 0.5:0.6 0.975:0.75 0.975:0.98"
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

      <div className="pause-on-hover space-y-6 py-4">
        <VelocityMarquee duration={45}>
          {firstRow.map((src, i) => (
            <Shot key={i} src={src} />
          ))}
        </VelocityMarquee>
        <VelocityMarquee duration={50} reverse>
          {secondRow.map((src, i) => (
            <Shot key={i} src={src} />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
