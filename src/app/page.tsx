"use client";

import { useRef, useState } from "react";
import { Collection } from "@/components/Collection";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InstagramSection } from "@/components/InstagramSection";
import { Locations } from "@/components/Locations";
import { Manifesto } from "@/components/Manifesto";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Thread } from "@/components/Thread";
import { Wholesale } from "@/components/Wholesale";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setReady(true)} />
      <div aria-hidden className="grain" />
      <Header ready={ready} />
      <div ref={containerRef} className="relative">
        <Thread containerRef={containerRef} ready={ready} />
        <main>
          <Hero ready={ready} />
          <Manifesto />
          <Collection />
          <FeaturedProduct />
          <Locations />
          <Wholesale />
          <InstagramSection />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
