"use client";

import { useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Collection } from "@/components/Collection";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { Locations } from "@/components/Locations";
import { Wholesale } from "@/components/Wholesale";
import { InstagramSection } from "@/components/InstagramSection";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ThreadRail } from "@/components/ThreadRail";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header />
      <div ref={containerRef} className="relative">
        <ThreadRail containerRef={containerRef} />
        <Hero />
        <Manifesto />
        <Collection />
        <FeaturedProduct />
        <Locations />
        <Wholesale />
        <InstagramSection />
        <FinalCta />
      </div>
      <Footer />
    </>
  );
}
