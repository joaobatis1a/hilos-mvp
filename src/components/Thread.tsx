"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type Point = { x: number; y: number };
type Geometry = { width: number; height: number; d: string; top: number };

// Each [data-thread] element lists points as "x:y" pairs (fractions of the
// container width / the element height). A third ":loop" field ties a knot.
function parseAnchors(container: HTMLElement, mobile: boolean): Point[] {
  const width = container.offsetWidth;
  const base = container.getBoundingClientRect().top;
  const loopRadius = mobile ? 16 : 46;
  const points: Point[] = [];

  container.querySelectorAll<HTMLElement>("[data-thread]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top - base;
    const spec = (mobile && el.dataset.threadMobile) || el.dataset.thread || "";

    spec
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => {
        const [fx, fy, flag] = token.split(":");
        const x = Number(fx) * width;
        const y = top + Number(fy) * rect.height;
        if (flag === "loop") {
          const r = loopRadius;
          points.push(
            { x, y },
            { x: x + r, y: y + r * 0.9 },
            { x, y: y + r * 1.9 },
            { x: x - r, y: y + r * 0.9 },
            { x: x + r * 0.15, y: y + r * 0.15 },
            { x: x + r * 0.6, y: y + r * 2.6 },
          );
        } else {
          points.push({ x, y });
        }
      });
  });

  return points;
}

function toPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function Thread({
  containerRef,
  ready,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  ready: boolean;
}) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [total, setTotal] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);
  const lutRef = useRef<{ lengths: Float32Array; maxY: Float32Array } | null>(null);

  const target = useMotionValue(0);
  const drawn = useSpring(target, { stiffness: 70, damping: 22, mass: 0.6 });
  const needleX = useMotionValue(-100);
  const needleY = useMotionValue(-100);
  const needleRotate = useMotionValue(90);
  const dashOffset = useTransform(drawn, (v) => Math.max(lengthRef.current - v, 0));
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const mobile = container.offsetWidth < 768;
    const points = parseAnchors(container, mobile);
    setGeometry({
      width: container.offsetWidth,
      height: container.scrollHeight,
      d: toPath(points),
      top: container.getBoundingClientRect().top + window.scrollY,
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    window.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [containerRef, measure]);

  const sync = useCallback(
    (scroll: number) => {
      const lut = lutRef.current;
      if (!lut || !geometry) return;
      const focusY = scroll + window.innerHeight * 0.62 - geometry.top;
      const { lengths, maxY } = lut;
      let lo = 0;
      let hi = maxY.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (maxY[mid] < focusY) lo = mid + 1;
        else hi = mid;
      }
      target.set(lengths[lo]);
    },
    [geometry, target],
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geometry?.d) return;
    const total = path.getTotalLength();
    lengthRef.current = total;
    const step = 6;
    const count = Math.ceil(total / step) + 1;
    const lengths = new Float32Array(count);
    const maxY = new Float32Array(count);
    let running = -Infinity;
    for (let i = 0; i < count; i++) {
      const l = Math.min(i * step, total);
      running = Math.max(running, path.getPointAtLength(l).y);
      lengths[i] = l;
      maxY[i] = running;
    }
    lutRef.current = { lengths, maxY };
    setTotal(total);
    sync(window.scrollY);
  }, [geometry, sync]);

  useMotionValueEvent(scrollY, "change", sync);

  useMotionValueEvent(drawn, "change", (value) => {
    const path = pathRef.current;
    if (!path || !lengthRef.current) return;
    const l = Math.min(Math.max(value, 1), lengthRef.current);
    const p = path.getPointAtLength(l);
    const prev = path.getPointAtLength(Math.max(l - 3, 0));
    needleX.set(p.x);
    needleY.set(p.y);
    needleRotate.set((Math.atan2(p.y - prev.y, p.x - prev.x) * 180) / Math.PI);
  });

  if (!geometry?.d) return null;

  return (
    <motion.svg
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: ready && total ? 1 : 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      className="pointer-events-none absolute top-0 left-0 z-30 overflow-visible"
    >
      <path
        d={geometry.d}
        fill="none"
        stroke="var(--color-terracotta)"
        strokeOpacity={0.4}
        strokeWidth={1.2}
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
      <motion.path
        d={geometry.d}
        fill="none"
        stroke="var(--color-terracotta)"
        strokeOpacity={0.16}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={total || 1}
        style={{ strokeDashoffset: dashOffset }}
      />
      <motion.path
        ref={pathRef}
        d={geometry.d}
        fill="none"
        stroke="var(--color-terracotta)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={total || 1}
        style={{ strokeDashoffset: dashOffset }}
      />
      <motion.g style={{ x: needleX, y: needleY, rotate: needleRotate }}>
        <circle r={14} fill="var(--color-terracotta)" opacity={0.12} />
        <line x1={-30} y1={0} x2={10} y2={0} stroke="var(--color-ink)" strokeWidth={2.2} strokeLinecap="round" />
        <ellipse cx={-23} cy={0} rx={4} ry={1.6} fill="none" stroke="var(--color-cream)" strokeWidth={1.2} />
        <circle r={3.2} fill="var(--color-terracotta)" />
      </motion.g>
    </motion.svg>
  );
}
