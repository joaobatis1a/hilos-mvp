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
type Lut = { len: Float32Array; x: Float32Array; y: Float32Array; maxY: Float32Array };
type Geometry = { width: number; height: number; d: string; top: number; total: number; lut: Lut };

// Each [data-thread] element lists points as "x:y" pairs (fractions of the
// container width / the element height). A third ":loop" field ties a knot.
function parseAnchors(container: HTMLElement, mobile: boolean): Point[] {
  const width = container.offsetWidth;
  const base = container.getBoundingClientRect().top;
  const loopRadius = mobile ? 30 : 46;
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
          points.push(...loopPoints(x, y, loopRadius));
        } else {
          points.push({ x, y });
        }
      });
  });

  return addWaves(points, width, mobile);
}

// A round cursive loop: a curtate trochoid travelling downwards, sampled
// densely. It enters and leaves heading straight down, tangent to the thread,
// so the curl reads as one continuous circle with no kink.
function loopPoints(x: number, y: number, r: number): Point[] {
  const drift = r * 0.45;
  const samples = 28;
  const out: Point[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = Math.PI + (i / samples) * Math.PI * 2;
    out.push({
      x: x - r * (1 + Math.cos(t)),
      y: y + drift * (t - Math.PI) - r * Math.sin(t),
    });
  }
  return out;
}

// Long runs get a smooth sine sway (densely sampled, faded in and out at the
// anchors) so the thread never falls in a straight line. Near the edges the
// sway is clamped to stay inside the gutter.
function addWaves(points: Point[], width: number, mobile: boolean): Point[] {
  if (points.length < 2) return points;
  const wavelength = mobile ? 380 : 620;
  const spacing = wavelength / 8;
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dy = b.y - a.y;
    if (dy > wavelength * 0.75) {
      const n = Math.floor(dy / spacing);
      for (let k = 1; k < n; k++) {
        const t = k / n;
        const x = a.x + (b.x - a.x) * t;
        const edge = Math.min(x, width - x);
        const amp =
          edge < width * 0.1
            ? Math.max(Math.min(edge - 3, mobile ? 10 : 26), 0)
            : width * (mobile ? 0.07 : 0.035);
        const ramp = Math.min(1, t / 0.18, (1 - t) / 0.18);
        const envelope = ramp * ramp * (3 - 2 * ramp);
        const sway = Math.sin((2 * Math.PI * dy * t) / wavelength);
        out.push({ x: x + amp * envelope * sway, y: a.y + dy * t });
      }
    }
    out.push(b);
  }
  return out;
}

const SAMPLES_PER_SEGMENT = 10;

// Builds the SVG path (Catmull-Rom through the points, as cubic Béziers) and,
// in the same pass, an arc-length lookup table sampled from those curves.
// Everything is computed in plain JS, so scrolling never has to query the DOM
// for path geometry.
function buildPath(points: Point[]): { d: string; total: number; lut: Lut } | null {
  if (points.length < 2) return null;
  const count = (points.length - 1) * SAMPLES_PER_SEGMENT + 1;
  const len = new Float32Array(count);
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const maxY = new Float32Array(count);
  xs[0] = points[0].x;
  ys[0] = points[0].y;
  maxY[0] = points[0].y;
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  let idx = 1;

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

    for (let k = 1; k <= SAMPLES_PER_SEGMENT; k++) {
      const t = k / SAMPLES_PER_SEGMENT;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const e = t * t * t;
      const x = a * p1.x + b * c1x + c * c2x + e * p2.x;
      const y = a * p1.y + b * c1y + c * c2y + e * p2.y;
      len[idx] = len[idx - 1] + Math.hypot(x - xs[idx - 1], y - ys[idx - 1]);
      xs[idx] = x;
      ys[idx] = y;
      maxY[idx] = Math.max(maxY[idx - 1], y);
      idx++;
    }
  }

  return { d, total: len[count - 1], lut: { len, x: xs, y: ys, maxY } };
}

function search(arr: Float32Array, value: number) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function Thread({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const frame = useRef(0);

  const target = useMotionValue(0);
  const drawn = useSpring(target, { stiffness: 140, damping: 28, mass: 0.5 });
  const needleX = useMotionValue(-100);
  const needleY = useMotionValue(-100);
  const needleRotate = useMotionValue(90);
  const dashOffset = useTransform(drawn, (v) => Math.max((geometryRef.current?.total ?? 0) - v, 0));
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const mobile = container.offsetWidth < 768;
    const built = buildPath(parseAnchors(container, mobile));
    if (!built) return;
    const top = container.getBoundingClientRect().top + window.scrollY;
    const prev = geometryRef.current;
    if (prev && prev.d === built.d && Math.abs(prev.top - top) < 1) return;
    const next = { width: container.offsetWidth, height: container.offsetHeight, top, ...built };
    geometryRef.current = next;
    setGeometry(next);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const schedule = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    window.addEventListener("load", schedule);
    return () => {
      cancelAnimationFrame(frame.current);
      observer.disconnect();
      window.removeEventListener("load", schedule);
    };
  }, [containerRef, measure]);

  const sync = useCallback(
    (scroll: number) => {
      const g = geometryRef.current;
      if (!g) return;
      const focusY = scroll + window.innerHeight * 0.62 - g.top;
      target.set(g.lut.len[search(g.lut.maxY, focusY)]);
    },
    [target],
  );

  useEffect(() => {
    if (geometry) sync(window.scrollY);
  }, [geometry, sync]);

  useMotionValueEvent(scrollY, "change", sync);

  useMotionValueEvent(drawn, "change", (value) => {
    const g = geometryRef.current;
    if (!g) return;
    const { len, x, y } = g.lut;
    const i = Math.max(search(len, Math.min(Math.max(value, 0), g.total)), 1);
    const span = len[i] - len[i - 1] || 1;
    const f = Math.min(Math.max((value - len[i - 1]) / span, 0), 1);
    needleX.set(x[i - 1] + (x[i] - x[i - 1]) * f);
    needleY.set(y[i - 1] + (y[i] - y[i - 1]) * f);
    needleRotate.set((Math.atan2(y[i] - y[i - 1], x[i] - x[i - 1]) * 180) / Math.PI);
  });

  if (!geometry) return null;

  return (
    <motion.svg
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
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
        pathLength={geometry.total}
        fill="none"
        stroke="var(--color-terracotta)"
        strokeOpacity={0.16}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={geometry.total}
        style={{ strokeDashoffset: dashOffset }}
      />
      <motion.path
        d={geometry.d}
        pathLength={geometry.total}
        fill="none"
        stroke="var(--color-terracotta)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={geometry.total}
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
