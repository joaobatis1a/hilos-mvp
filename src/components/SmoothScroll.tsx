"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: -40 },
      lerp: 0.13,
      respectReducedMotion: true,
    });
    // Lenis is an external system; exposing it after construction is the subscription pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    return () => instance.destroy();
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function scrollToHash(lenis: Lenis | null, hash: string) {
  if (lenis) {
    lenis.scrollTo(hash, { offset: -40, duration: 1.6 });
    return;
  }
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}
