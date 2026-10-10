"use client";

import { useRef } from "react";
import { Collection } from "@/components/Collection";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InstagramSection } from "@/components/InstagramSection";
import { Locations } from "@/components/Locations";
import { Manifesto } from "@/components/Manifesto";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Thread } from "@/components/Thread";
import { Wholesale } from "@/components/Wholesale";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SmoothScroll>
      <div aria-hidden className="grain" />
      <Header />
      <div ref={containerRef} className="relative">
        <Thread containerRef={containerRef} />
        <main>
          <Hero />
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
