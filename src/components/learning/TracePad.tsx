// Tracing canvas — dotted glyph guide with pointer-driven drawing overlay.
// Coverage is measured by sampling every stroke path into points and
// checking how many fall near the user's ink.

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Check, Sparkles } from "lucide-react";
import type { Glyph } from "@/lib/glyphs";

type Props = {
  glyph: Glyph;
  onSuccess?: () => void;
  onIdleHint?: () => void;
  onProgress?: (pct: number) => void;
  color?: string;
  successThreshold?: number; // 0-1
  proximityPx?: number; // in canvas px
};

const CANVAS_SIZE = 320;
const IDLE_MS = 5000;

type StrokeSample = {
  points: Array<{ x: number; y: number; hit: boolean }>;
  endpoint: { x: number; y: number; hit: boolean };
};

const TracePad = ({
  glyph,
  onSuccess,
  onIdleHint,
  onProgress,
  color = "hsl(var(--kid-blue))",
  successThreshold = 0.65,
  proximityPx = 32,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const guideRef = useRef<SVGSVGElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const strokesRef = useRef<StrokeSample[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [coverage, setCoverage] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  // Sample every stroke path into points in canvas space.
  useEffect(() => {
    // Wait for SVG to mount, then sample using getPointAtLength on invisible measurers
    const svg = guideRef.current;
    if (!svg) return;
    const [, , vw, vh] = glyph.viewBox.split(/\s+/).map(Number);
    const scaleX = CANVAS_SIZE / vw;
    const scaleY = CANVAS_SIZE / vh;
    const samples: StrokeSample[] = [];
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-sample='1']");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      const step = Math.max(4, len / 40);
      const pts: StrokeSample["points"] = [];
      for (let d = 0; d <= len; d += step) {
        const pt = p.getPointAtLength(d);
        pts.push({ x: pt.x * scaleX, y: pt.y * scaleY, hit: false });
      }
      const endPt = p.getPointAtLength(len);
      samples.push({
        points: pts,
        endpoint: { x: endPt.x * scaleX, y: endPt.y * scaleY, hit: false },
      });
    });
    strokesRef.current = samples;
    setCoverage(0);
    setSucceeded(false);
    clearCanvas();
  }, [glyph]);

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!succeeded && coverage < successThreshold) onIdleHint?.();
    }, IDLE_MS);
  };

  const getPointerPos = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const markHits = (x: number, y: number) => {
    const strokes = strokesRef.current;
    if (!strokes.length) return;
    const r2 = proximityPx * proximityPx;
    const endR2 = proximityPx * 1.3 * (proximityPx * 1.3);
    let newlyHit = 0;
    for (const s of strokes) {
      for (const p of s.points) {
        if (p.hit) continue;
        const dx = p.x - x,
          dy = p.y - y;
        if (dx * dx + dy * dy <= r2) {
          p.hit = true;
          newlyHit++;
        }
      }
      if (!s.endpoint.hit) {
        const dx = s.endpoint.x - x,
          dy = s.endpoint.y - y;
        if (dx * dx + dy * dy <= endR2) {
          s.endpoint.hit = true;
          newlyHit++;
        }
      }
    }
    if (newlyHit === 0) return;

    // Per-stroke coverage — every stroke must clear the threshold AND touch
    // its endpoint before we call the tracing complete.
    let totalPts = 0,
      totalHits = 0;
    let allStrokesPassed = true;
    for (const s of strokes) {
      totalPts += s.points.length;
      const hits = s.points.reduce((n, p) => n + (p.hit ? 1 : 0), 0);
      totalHits += hits;
      const strokeCov = hits / s.points.length;
      if (strokeCov < successThreshold || !s.endpoint.hit) allStrokesPassed = false;
    }
    const cov = totalPts ? totalHits / totalPts : 0;
    setCoverage(cov);
    onProgress?.(cov);
    if (allStrokesPassed && !succeeded) {
      setSucceeded(true);
      onSuccess?.();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = getPointerPos(e);
    lastPoint.current = p;
    markHits(p.x, p.y);
    resetIdleTimer();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx || !lastPoint.current) return;
    const p = getPointerPos(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
    markHits(p.x, p.y);
    resetIdleTimer();
  };
  const onPointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const reset = () => {
    strokesRef.current.forEach((s) => {
      s.points.forEach((p) => (p.hit = false));
      s.endpoint.hit = false;
    });
    setCoverage(0);
    setSucceeded(false);
    clearCanvas();
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(coverage * 100);
  const [, , vw, vh] = useMemo(() => glyph.viewBox.split(/\s+/).map(Number), [glyph]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative bg-card rounded-3xl shadow-inner border-2 border-dashed border-border overflow-hidden"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: "100%" }}
      >
        {/* Dotted guide */}
        <svg
          ref={guideRef}
          viewBox={`0 0 ${vw} ${vh}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          {glyph.strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              data-sample="1"
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.55}
              strokeWidth={10}
              strokeDasharray="2 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
        {/* Drawing surface */}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="relative w-full h-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {succeeded && (
          <div className="pointer-events-none absolute top-2 right-2 flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-4 h-4" />
            <span className="font-display font-bold text-sm">Great Job!</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kid-green to-kid-teal rounded-full transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1 font-body">
          {succeeded ? "You traced it!" : `Tracing… ${pct}%`}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={reset}
          aria-label="Reset tracing"
          className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full font-display font-semibold shadow hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {succeeded && (
          <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full font-display font-semibold shadow">
            <Check className="w-4 h-4" />
            <span>Complete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TracePad;
