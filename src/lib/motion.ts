"use client";

import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useLenis } from "@/components/SmoothScroll";

// Reveals only move forward: once a section has been seen, scrolling back
// never replays the animation in reverse.
export function useLatched(value: MotionValue<number>) {
  const latched = useMotionValue(value.get());
  useMotionValueEvent(value, "change", (v) => {
    if (v > latched.get()) latched.set(v);
  });
  return latched;
}

// Pinned scroll scenes play once. After the first full pass, as soon as the
// section is off screen it collapses to a normal-height section, and the
// scroll position is compensated so the visible content does not jump.
export function useCollapseAfterPass(
  ref: RefObject<HTMLElement | null>,
  progress: MotionValue<number>,
) {
  const lenis = useLenis();
  const [collapsed, setCollapsed] = useState(false);
  const finished = useRef(false);
  const bottomBefore = useRef<number | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(progress, "change", (v) => {
    if (v >= 0.995) finished.current = true;
  });

  useMotionValueEvent(scrollY, "change", () => {
    if (!finished.current || collapsed) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const above = rect.bottom <= 0;
    const below = rect.top >= window.innerHeight;
    if (!above && !below) return;
    bottomBefore.current = above ? rect.bottom : null;
    setCollapsed(true);
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!collapsed || !el || bottomBefore.current === null) return;
    const shift = el.getBoundingClientRect().bottom - bottomBefore.current;
    bottomBefore.current = null;
    if (Math.abs(shift) < 1) return;
    const target = window.scrollY + shift;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      window.scrollTo(0, target);
    }
  }, [collapsed, lenis, ref]);

  return collapsed;
}
