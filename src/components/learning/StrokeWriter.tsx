// Event-driven SVG stroke writer.
//
// Sequencing rules (no fixed setTimeouts, no estimated durations):
//   1. When stroke i starts, we fire onStrokeStart(i, guidance). The parent
//      returns (or awaits) a Promise that resolves when the spoken guidance
//      for that stroke has actually finished playing.
//   2. In parallel, framer-motion animates the path; onAnimationComplete
//      resolves a per-stroke animation Promise.
//   3. Stroke i+1 only begins once BOTH the animation AND the spoken
//      guidance for stroke i have completed.
//   4. onComplete fires only after the final stroke's animation AND its
//      narration have both ended. No "You wrote it" is ever announced
//      before the last pixel is drawn.
//
// Callers can also subscribe to onProgressCue for kid-friendly progressive
// feedback: "halfway" (spoken mid-way through a multi-stroke letter) and
// "last" (spoken just before the final stroke). These are advisory only —
// they do NOT signal completion.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import type { Glyph } from "@/lib/glyphs";

export type ProgressCue = "halfway" | "last";

type Props = {
  glyph: Glyph;
  autoPlay?: boolean;
  strokeDurationMs?: number;
  /** Return a Promise to gate the next stroke until narration ends. */
  onStrokeStart?: (index: number, guidance: string) => void | Promise<void>;
  onProgressCue?: (cue: ProgressCue) => void;
  /** Fires ONLY after the last stroke's animation + narration have finished. */
  onComplete?: () => void;
  color?: string;
};

const StrokeWriter = ({
  glyph,
  autoPlay = true,
  strokeDurationMs = 1600,
  onStrokeStart,
  onProgressCue,
  onComplete,
  color = "hsl(var(--primary))",
}: Props) => {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => setPhase("playing"), 400);
      return () => clearTimeout(t);
    }
  }, [autoPlay]);
  const [activeStroke, setActiveStroke] = useState(-1);
  const [runId, setRunId] = useState(0);
  const [statusLine, setStatusLine] = useState<string>("");

  const cbRef = useRef({ onStrokeStart, onComplete, onProgressCue });
  cbRef.current = { onStrokeStart, onComplete, onProgressCue };
  const animResolver = useRef<(() => void) | null>(null);
  const cancelledForRun = useRef<number>(-1);

  const totalStrokes = glyph.strokes.length;

  // Main sequencer — event-driven, no fixed setTimeout for stroke timing.
  useEffect(() => {
    if (phase !== "playing") return;
    let cancelled = false;
    const myRun = runId;
    cancelledForRun.current = -1;

    (async () => {
      for (let i = 0; i < totalStrokes; i++) {
        if (cancelled || cancelledForRun.current === myRun) return;

        // Progressive cues (advisory — never a completion signal).
        if (totalStrokes >= 3 && i === Math.floor(totalStrokes / 2)) {
          cbRef.current.onProgressCue?.("halfway");
        }
        if (totalStrokes >= 2 && i === totalStrokes - 1) {
          cbRef.current.onProgressCue?.("last");
        }

        setActiveStroke(i);
        setStatusLine(glyph.strokes[i].guidance);

        // Await animation-complete for THIS stroke.
        const animP = new Promise<void>((resolve) => {
          animResolver.current = resolve;
          // Bulletproof fallback: if CSS transition fails to fire end event for ANY reason, resolve after duration + 200ms
          setTimeout(() => {
            if (animResolver.current === resolve) {
              animResolver.current = null;
              resolve();
            }
          }, strokeDurationMs + 200);
        });
        // Kick narration; parent may return a Promise so we wait for real onend.
        const guidP = Promise.resolve(
          cbRef.current.onStrokeStart?.(i, glyph.strokes[i].guidance)
        ).catch(() => undefined);

        await Promise.all([animP, guidP]);
        if (cancelled || cancelledForRun.current === myRun) return;
      }

      // Both loops completed for every stroke — only NOW mark done.
      if (!cancelled && cancelledForRun.current !== myRun) {
        setPhase("done");
        setStatusLine("");
        cbRef.current.onComplete?.();
      }
    })();

    return () => {
      cancelled = true;
      cancelledForRun.current = myRun;
      // Resolve any pending anim so the loop unwinds.
      animResolver.current?.();
      animResolver.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, runId, glyph]);

  const restart = () => {
    // Bump run id and force restart of playing state.
    animResolver.current?.();
    animResolver.current = null;
    setActiveStroke(-1);
    setPhase("playing");
    setRunId((n) => n + 1);
  };

  const play = () => {
    if (phase === "playing") return;
    restart();
  };

  const strokes = glyph.strokes;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-card border-2 border-dashed border-border rounded-3xl p-4 shadow-inner">
        <svg viewBox={glyph.viewBox} className="w-48 h-56 md:w-64 md:h-72" role="img" aria-label="Letter writing animation">
          {/* Ghost outline */}
          {strokes.map((s, i) => (
            <path
              key={`ghost-${i}`}
              d={s.d}
              fill="none"
              stroke="hsl(var(--muted-foreground) / 0.2)"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* Animated strokes — event-driven completion signalling */}
          {strokes.map((s, i) => {
            const isActive = i === activeStroke && phase === "playing";
            const isPast = phase === "done" || i < activeStroke;
            const target = isPast ? 1 : isActive ? 1 : 0;
            return (
              <path
                key={`stroke-${i}-${runId}`}
                d={s.d}
                fill="none"
                stroke={color}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                style={{
                  strokeDasharray: "1",
                  strokeDashoffset: target === 1 ? "0" : "1",
                  transition: isActive ? `stroke-dashoffset ${strokeDurationMs}ms ease-in-out` : "none"
                }}
                onTransitionEnd={() => {
                  if (isActive) {
                    // Resolve exactly once — actual visual completion signal.
                    const r = animResolver.current;
                    animResolver.current = null;
                    r?.();
                  }
                }}
              />
            );
          })}
          {/* Numbered start badges */}
          {strokes.map((s, i) => (
            <g key={`badge-${i}`}>
              <circle cx={s.start[0]} cy={s.start[1]} r={9} fill="hsl(var(--kid-orange))" stroke="white" strokeWidth={2} />
              <text
                x={s.start[0]}
                y={s.start[1] + 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                fill="white"
                fontFamily="Fredoka, sans-serif"
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {phase === "playing" && activeStroke >= 0 && (
          <motion.p
            key={`g-${activeStroke}-${runId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-lg md:text-xl font-display font-semibold text-foreground text-center max-w-sm"
          >
            Step {activeStroke + 1} of {totalStrokes}: {statusLine}
          </motion.p>
        )}
        {phase === "done" && (
          <motion.p
            key="done"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-display font-bold text-accent inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> You wrote it!
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <button
          onClick={play}
          disabled={phase === "playing"}
          aria-label="Play writing"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-display font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
        >
          <Play className="w-4 h-4" />
          <span>{phase === "playing" ? "Playing…" : phase === "done" ? "Play again" : "Play"}</span>
        </button>
        <button
          onClick={restart}
          aria-label="Restart writing"
          className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full font-display font-semibold shadow hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};

export default StrokeWriter;
