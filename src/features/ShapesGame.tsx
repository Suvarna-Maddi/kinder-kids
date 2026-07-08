import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Volume2, Trophy, Check, X as XIcon, RotateCcw, PenLine, Eye, Pencil } from "lucide-react";
import { playClick, playPop, playSuccess, playError } from "@/lib/sounds";
import { recordAndSpeak, speak, praise, retryHint, cancelSpeech } from "@/lib/tts";
import { awardCoin, awardStar, recordAttempt } from "@/lib/progress";
import { createPersistentQuizDeck, sampleUnique } from "@/lib/quizEngine";
import SettingsBar from "@/components/learning/SettingsBar";

type ShapeName =
  // 2D
  | "circle" | "square" | "triangle" | "rectangle" | "star" | "heart"
  | "pentagon" | "hexagon" | "oval" | "diamond" | "rhombus"
  | "parallelogram" | "trapezium" | "semicircle" | "octagon"
  | "arrow" | "cross" | "crescent"
  // 3D
  | "cube" | "cuboid" | "sphere" | "cylinder" | "cone" | "pyramid";

type ShapeDef = {
  name: ShapeName;
  label: string;
  description: string;
  category: "2d" | "3d";
  color: string;
  // Fill rendering used for the display card / MCQ tiles.
  render: (fill: string, stroke: string) => ReactElement;
  // Stroke paths for tracing mode (viewBox 0 0 100 100).
  strokes: string[];
};

const S = 100;

// Path helper strings used in both render + tracing.
const PATH_TRIANGLE = "M 50 12 L 88 86 L 12 86 Z";
const PATH_STAR =
  "M 50 10 L 61 38 L 92 38 L 66 56 L 76 86 L 50 68 L 24 86 L 34 56 L 8 38 L 39 38 Z";
const PATH_HEART =
  "M 50 84 C 18 62 8 42 24 26 C 34 16 46 22 50 32 C 54 22 66 16 76 26 C 92 42 82 62 50 84 Z";
const PATH_PENTAGON = "M 50 10 L 90 40 L 74 84 L 26 84 L 10 40 Z";
const PATH_HEXAGON = "M 30 12 L 70 12 L 92 50 L 70 88 L 30 88 L 8 50 Z";
const PATH_DIAMOND = "M 50 8 L 92 50 L 50 92 L 8 50 Z";
const PATH_RHOMBUS = "M 30 15 L 90 15 L 70 85 L 10 85 Z";
const PATH_PARA = "M 20 20 L 92 20 L 80 82 L 8 82 Z";
const PATH_TRAPEZIUM = "M 25 20 L 75 20 L 92 82 L 8 82 Z";
const PATH_OCTAGON =
  "M 30 8 L 70 8 L 92 30 L 92 70 L 70 92 L 30 92 L 8 70 L 8 30 Z";
const PATH_ARROW =
  "M 8 40 L 55 40 L 55 20 L 92 50 L 55 80 L 55 60 L 8 60 Z";
const PATH_CROSS =
  "M 40 10 L 60 10 L 60 40 L 90 40 L 90 60 L 60 60 L 60 90 L 40 90 L 40 60 L 10 60 L 10 40 L 40 40 Z";
const PATH_CRESCENT =
  "M 70 15 A 40 40 0 1 0 70 85 A 30 30 0 1 1 70 15 Z";
const PATH_SEMI =
  "M 10 60 A 40 40 0 0 1 90 60 L 90 62 L 10 62 Z";

// 3D — simple isometric-style outlines
const PATH_CUBE_FRONT = "M 20 40 L 60 40 L 60 90 L 20 90 Z";
const PATH_CUBE_TOP = "M 20 40 L 45 15 L 85 15 L 60 40 Z";
const PATH_CUBE_SIDE = "M 60 40 L 85 15 L 85 65 L 60 90 Z";
const PATH_CUBOID_FRONT = "M 15 35 L 65 35 L 65 88 L 15 88 Z";
const PATH_CUBOID_TOP = "M 15 35 L 40 15 L 90 15 L 65 35 Z";
const PATH_CUBOID_SIDE = "M 65 35 L 90 15 L 90 68 L 65 88 Z";
const PATH_CYL_TOP = "M 20 25 A 30 8 0 0 1 80 25 A 30 8 0 0 1 20 25 Z";
const PATH_CYL_BODY = "M 20 25 L 20 80 A 30 8 0 0 0 80 80 L 80 25";
const PATH_CONE_BODY = "M 50 12 L 82 82 A 32 8 0 0 1 18 82 Z";
const PATH_CONE_BASE = "M 18 82 A 32 8 0 0 0 82 82";
const PATH_PYR_FRONT = "M 50 12 L 18 82 L 82 82 Z";
const PATH_PYR_SIDE = "M 50 12 L 82 82 L 90 68 Z";

const shape = (label: string, desc: string, cat: "2d" | "3d", color: string,
  render: ShapeDef["render"], strokes: string[]): Omit<ShapeDef, "name"> =>
  ({ label, description: desc, category: cat, color, render, strokes });

const SHAPES: ShapeDef[] = [
  // 2D
  { name: "circle", ...shape("Circle", "A round shape with no corners.", "2d", "text-kid-blue",
    (f, s) => <circle cx={S/2} cy={S/2} r={40} fill={f} stroke={s} strokeWidth={4} />,
    ["M 50 10 A 40 40 0 1 1 49.9 10 Z"]) },
  { name: "square", ...shape("Square", "Four equal sides and four corners.", "2d", "text-kid-green",
    (f, s) => <rect x={15} y={15} width={70} height={70} fill={f} stroke={s} strokeWidth={4} rx={4} />,
    ["M 15 15 L 85 15 L 85 85 L 15 85 Z"]) },
  { name: "triangle", ...shape("Triangle", "Three sides and three corners.", "2d", "text-kid-orange",
    (f, s) => <path d={PATH_TRIANGLE} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_TRIANGLE]) },
  { name: "rectangle", ...shape("Rectangle", "Two long sides and two short sides.", "2d", "text-kid-purple",
    (f, s) => <rect x={8} y={25} width={84} height={50} fill={f} stroke={s} strokeWidth={4} rx={4} />,
    ["M 8 25 L 92 25 L 92 75 L 8 75 Z"]) },
  { name: "star", ...shape("Star", "A shape with five sparkling points.", "2d", "text-kid-yellow",
    (f, s) => <path d={PATH_STAR} fill={f} stroke={s} strokeWidth={3} strokeLinejoin="round" />,
    [PATH_STAR]) },
  { name: "heart", ...shape("Heart", "A shape that shows love.", "2d", "text-kid-pink",
    (f, s) => <path d={PATH_HEART} fill={f} stroke={s} strokeWidth={3} />,
    [PATH_HEART]) },
  { name: "pentagon", ...shape("Pentagon", "Five equal sides.", "2d", "text-kid-teal",
    (f, s) => <path d={PATH_PENTAGON} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_PENTAGON]) },
  { name: "hexagon", ...shape("Hexagon", "Six sides like a honeycomb.", "2d", "text-kid-blue",
    (f, s) => <path d={PATH_HEXAGON} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_HEXAGON]) },
  { name: "oval", ...shape("Oval", "Like a stretched circle, like an egg.", "2d", "text-kid-red",
    (f, s) => <ellipse cx={50} cy={50} rx={44} ry={30} fill={f} stroke={s} strokeWidth={4} />,
    ["M 50 20 A 44 30 0 1 1 49.9 20 Z"]) },
  { name: "diamond", ...shape("Diamond", "A square standing on its point.", "2d", "text-kid-purple",
    (f, s) => <path d={PATH_DIAMOND} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_DIAMOND]) },
  { name: "rhombus", ...shape("Rhombus", "Four equal sides, tilted like a kite.", "2d", "text-kid-pink",
    (f, s) => <path d={PATH_RHOMBUS} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_RHOMBUS]) },
  { name: "parallelogram", ...shape("Parallelogram", "A slanted rectangle.", "2d", "text-kid-teal",
    (f, s) => <path d={PATH_PARA} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_PARA]) },
  { name: "trapezium", ...shape("Trapezium", "Two parallel sides, one long, one short.", "2d", "text-kid-orange",
    (f, s) => <path d={PATH_TRAPEZIUM} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_TRAPEZIUM]) },
  { name: "semicircle", ...shape("Semicircle", "Half of a circle.", "2d", "text-kid-blue",
    (f, s) => <path d={PATH_SEMI} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_SEMI]) },
  { name: "octagon", ...shape("Octagon", "Eight sides like a stop sign.", "2d", "text-kid-red",
    (f, s) => <path d={PATH_OCTAGON} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_OCTAGON]) },
  { name: "arrow", ...shape("Arrow", "A shape that points the way.", "2d", "text-kid-green",
    (f, s) => <path d={PATH_ARROW} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_ARROW]) },
  { name: "cross", ...shape("Cross", "A plus-sign shape.", "2d", "text-kid-purple",
    (f, s) => <path d={PATH_CROSS} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_CROSS]) },
  { name: "crescent", ...shape("Crescent", "A moon shape.", "2d", "text-kid-yellow",
    (f, s) => <path d={PATH_CRESCENT} fill={f} stroke={s} strokeWidth={4} strokeLinejoin="round" />,
    [PATH_CRESCENT]) },

  // 3D
  { name: "cube", ...shape("Cube", "A 3D box with six equal square faces.", "3d", "text-kid-blue",
    (f, s) => (
      <g>
        <path d={PATH_CUBE_FRONT} fill={f} stroke={s} strokeWidth={3} />
        <path d={PATH_CUBE_TOP} fill={f} stroke={s} strokeWidth={3} opacity={0.85} />
        <path d={PATH_CUBE_SIDE} fill={f} stroke={s} strokeWidth={3} opacity={0.7} />
      </g>
    ),
    [PATH_CUBE_FRONT, PATH_CUBE_TOP, PATH_CUBE_SIDE]) },
  { name: "cuboid", ...shape("Cuboid", "A 3D rectangular box.", "3d", "text-kid-teal",
    (f, s) => (
      <g>
        <path d={PATH_CUBOID_FRONT} fill={f} stroke={s} strokeWidth={3} />
        <path d={PATH_CUBOID_TOP} fill={f} stroke={s} strokeWidth={3} opacity={0.85} />
        <path d={PATH_CUBOID_SIDE} fill={f} stroke={s} strokeWidth={3} opacity={0.7} />
      </g>
    ),
    [PATH_CUBOID_FRONT, PATH_CUBOID_TOP, PATH_CUBOID_SIDE]) },
  { name: "sphere", ...shape("Sphere", "A perfectly round 3D ball.", "3d", "text-kid-pink",
    (f, s) => (
      <g>
        <circle cx={50} cy={50} r={38} fill={f} stroke={s} strokeWidth={3} />
        <ellipse cx={50} cy={50} rx={38} ry={12} fill="none" stroke={s} strokeWidth={2} opacity={0.6} strokeDasharray="3 3" />
      </g>
    ),
    ["M 50 12 A 38 38 0 1 1 49.9 12 Z"]) },
  { name: "cylinder", ...shape("Cylinder", "A tube with round ends, like a can.", "3d", "text-kid-orange",
    (f, s) => (
      <g>
        <path d={PATH_CYL_BODY} fill={f} stroke={s} strokeWidth={3} />
        <path d={PATH_CYL_TOP} fill={f} stroke={s} strokeWidth={3} />
      </g>
    ),
    [PATH_CYL_TOP, "M 20 25 L 20 80", "M 80 25 L 80 80", "M 20 80 A 30 8 0 0 0 80 80"]) },
  { name: "cone", ...shape("Cone", "A pointy top on a round base, like an ice-cream cone.", "3d", "text-kid-yellow",
    (f, s) => (
      <g>
        <path d={PATH_CONE_BODY} fill={f} stroke={s} strokeWidth={3} strokeLinejoin="round" />
        <path d={PATH_CONE_BASE} fill="none" stroke={s} strokeWidth={2} strokeDasharray="3 3" opacity={0.6} />
      </g>
    ),
    [PATH_CONE_BODY]) },
  { name: "pyramid", ...shape("Pyramid", "Triangle faces meeting at a point.", "3d", "text-kid-purple",
    (f, s) => (
      <g>
        <path d={PATH_PYR_FRONT} fill={f} stroke={s} strokeWidth={3} strokeLinejoin="round" />
        <path d={PATH_PYR_SIDE} fill={f} stroke={s} strokeWidth={3} strokeLinejoin="round" opacity={0.7} />
      </g>
    ),
    [PATH_PYR_FRONT, PATH_PYR_SIDE]) },
];

const GRADIENTS = [
  "from-kid-blue to-kid-teal", "from-kid-green to-kid-teal", "from-kid-orange to-kid-yellow",
  "from-kid-purple to-kid-pink", "from-kid-pink to-kid-red", "from-kid-teal to-kid-green",
  "from-kid-red to-kid-orange", "from-kid-yellow to-kid-green", "from-kid-blue to-kid-purple",
  "from-kid-purple to-kid-blue",
];

type Mode = "learn" | "quiz" | "trace" | "draw";

const ShapeSvg = ({ shape, size = 120 }: { shape: ShapeDef; size?: number }) => (
  <svg viewBox={`0 0 ${S} ${S}`} width={size} height={size} role="img" aria-label={shape.label}>
    {shape.render("hsl(var(--primary) / 0.15)", "hsl(var(--primary))")}
  </svg>
);

// ------- Trace pad specialized for shape strokes -------
const CANVAS_SIZE = 320;
const ShapeTracePad = ({ shape, showGuide, onSuccess }: { shape: ShapeDef; showGuide: boolean; onSuccess?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const guideRef = useRef<SVGSVGElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const samplesRef = useRef<Array<{ x: number; y: number; hit: boolean }>>([]);
  const [coverage, setCoverage] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    const svg = guideRef.current;
    if (!svg) { samplesRef.current = []; return; }
    const scale = CANVAS_SIZE / S;
    const pts: Array<{ x: number; y: number; hit: boolean }> = [];
    svg.querySelectorAll<SVGPathElement>("path[data-sample='1']").forEach((p) => {
      const len = p.getTotalLength();
      const step = Math.max(4, len / 60);
      for (let d = 0; d <= len; d += step) {
        const pt = p.getPointAtLength(d);
        pts.push({ x: pt.x * scale, y: pt.y * scale, hit: false });
      }
    });
    samplesRef.current = pts;
    setCoverage(0);
    setSucceeded(false);
    clearCanvas();
  }, [shape]);

  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * CANVAS_SIZE, y: ((e.clientY - r.top) / r.height) * CANVAS_SIZE };
  };

  const mark = (x: number, y: number) => {
    const pts = samplesRef.current; if (!pts.length) return;
    const r2 = 32 * 32;
    let newHits = 0;
    for (const p of pts) {
      if (p.hit) continue;
      const dx = p.x - x, dy = p.y - y;
      if (dx * dx + dy * dy <= r2) { p.hit = true; newHits++; }
    }
    if (!newHits) return;
    const hits = pts.reduce((n, p) => n + (p.hit ? 1 : 0), 0);
    const cov = hits / pts.length;
    setCoverage(cov);
    if (cov >= (showGuide ? 0.6 : 0.5) && !succeeded) {
      setSucceeded(true);
      playSuccess();
      awardStar(1); awardCoin(2);
      onSuccess?.();
    }
  };

  const down = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = pos(e); last.current = p; mark(p.x, p.y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx || !last.current) return;
    const p = pos(e);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "hsl(var(--kid-blue))"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last.current = p; mark(p.x, p.y);
  };
  const up = () => { drawing.current = false; last.current = null; };

  const reset = () => { samplesRef.current.forEach((p) => (p.hit = false)); setCoverage(0); setSucceeded(false); clearCanvas(); };
  const pct = Math.round(coverage * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative bg-card rounded-3xl shadow-inner border-2 border-dashed border-border overflow-hidden"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: "100%" }}>
        <svg ref={guideRef} viewBox={`0 0 ${S} ${S}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {shape.strokes.map((d, i) => (
            <path key={i} d={d} data-sample="1" fill="none"
              stroke={showGuide ? "hsl(var(--muted-foreground))" : "transparent"}
              strokeOpacity={0.55} strokeWidth={10} strokeDasharray="2 8"
              strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE}
          className="relative w-full h-full touch-none"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} />
        {succeeded && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute top-2 right-2 flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="font-display font-bold text-sm">Great Job!</span>
          </motion.div>
        )}
      </div>
      <div className="w-full max-w-xs">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-kid-green to-kid-teal rounded-full" animate={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1 font-body">
          {succeeded ? (showGuide ? "You traced it!" : "You drew it!") : `${showGuide ? "Tracing" : "Drawing"}… ${pct}%`}
        </p>
      </div>
      <button onClick={reset}
        className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full font-display font-semibold shadow hover:scale-105 transition-transform">
        <RotateCcw className="w-4 h-4" /><span>Reset</span>
      </button>
    </div>
  );
};

const ShapesGame = () => {
  const [mode, setMode] = useState<Mode>("learn");
  const [selected, setSelected] = useState<ShapeDef>(SHAPES[0]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [pick, setPick] = useState<ShapeName | null>(null);

  // Persistent deck so questions differ across page reloads / sessions.
  const deck = useMemo(
    () => createPersistentQuizDeck("plh:shapes:quiz", SHAPES, (s) => s.name),
    []
  );
  const [quiz, setQuiz] = useState<{ target: ShapeDef; options: ShapeDef[] } | null>(null);

  const nextQuiz = () => {
    const target = deck.next();
    const distractors = sampleUnique(SHAPES, 3, [target]);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    setQuiz({ target, options });
    setPick(null);
    setShowResult(false);
  };

  useEffect(() => () => cancelSpeech(), []);
  useEffect(() => { if (mode === "quiz") nextQuiz(); /* eslint-disable-next-line */ }, [mode]);
  useEffect(() => {
    if (mode === "quiz" && quiz) speak(`Find the ${quiz.target.label}.`, { profile: "girl" });
  }, [quiz, mode]);

  const handlePickShape = (s: ShapeDef) => {
    playPop(); setSelected(s); cancelSpeech();
    recordAndSpeak([
      { text: `${s.label}.`, profile: "girl", pauseAfterMs: 150 },
      { text: s.description, profile: "girl" },
    ]);
  };

  const handleQuizPick = (s: ShapeDef) => {
    if (showResult || !quiz) return;
    setPick(s.name); setShowResult(true); setTotal((p) => p + 1);
    const correct = s.name === quiz.target.name;
    recordAttempt(correct);
    if (correct) {
      setScore((p) => p + 1); playSuccess(); awardStar(1); awardCoin(2);
      recordAndSpeak([
        { text: praise(), profile: "girl", pauseAfterMs: 120 },
        { text: `That's the ${quiz.target.label}.`, profile: "girl" },
      ]);
      setTimeout(nextQuiz, 1400);
    } else {
      playError(); speak(retryHint(), { profile: "girl" });
      setTimeout(() => { setPick(null); setShowResult(false); }, 1200);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
            <Sparkles className="w-8 h-8 text-kid-yellow" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">Shapes! 🔷</h1>
          {mode === "quiz" && (
            <div className="ml-auto flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg border border-border">
              <Trophy className="w-5 h-5 text-kid-yellow" />
              <span className="font-display font-bold text-foreground">{score}/{total}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { id: "learn", label: "Learn", icon: Eye },
            { id: "quiz", label: "Quiz", icon: Trophy },
            { id: "trace", label: "Trace", icon: PenLine },
            { id: "draw", label: "Draw", icon: Pencil },
          ] as { id: Mode; label: string; icon: typeof Eye }[]).map((m) => {
            const Icon = m.icon;
            return (
              <button key={m.id} onClick={() => { playClick(); setMode(m.id); }}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-display font-semibold text-sm md:text-base transition-colors ${
                  mode === m.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="w-4 h-4" />{m.label}
              </button>
            );
          })}
        </div>

        {(mode === "learn" || mode === "trace" || mode === "draw") && (
          <>
            <AnimatePresence>
              <motion.div key={selected.name + mode}
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="mb-8 bg-card rounded-bubble shadow-2xl p-6 md:p-10 border border-border text-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[SHAPES.indexOf(selected) % GRADIENTS.length]} opacity-10 pointer-events-none`} />
                <div className="relative z-10">
                  {mode === "learn" ? (
                    <>
                      <motion.div animate={{ rotate: [0, 5, -5, 0], y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex justify-center mb-4">
                        <ShapeSvg shape={selected} size={180} />
                      </motion.div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{selected.label}
                        <span className="ml-2 text-sm font-body text-muted-foreground align-middle">
                          {selected.category === "3d" ? "3D" : "2D"}
                        </span>
                      </h2>
                      <p className="text-lg md:text-xl font-body text-muted-foreground max-w-md mx-auto">{selected.description}</p>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handlePickShape(selected)}
                        aria-label={`Hear about the ${selected.label}`}
                        className="mt-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Volume2 className="w-6 h-6" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                        {mode === "trace" ? "Trace the" : "Draw the"} {selected.label}
                      </h2>
                      <ShapeTracePad shape={selected} showGuide={mode === "trace"} />
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mb-2 text-sm font-body text-muted-foreground font-semibold">2D Shapes</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 mb-6">
              {SHAPES.filter((s) => s.category === "2d").map((s, i) => (
                <motion.button key={s.name}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { playPop(); setSelected(s); if (mode === "learn") handlePickShape(s); }}
                  className={`bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-lg ${
                    selected.name === s.name ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}>
                  <ShapeSvg shape={s} size={64} />
                  <span className="font-display font-bold text-foreground text-xs">{s.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="mb-2 text-sm font-body text-muted-foreground font-semibold">3D Shapes</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {SHAPES.filter((s) => s.category === "3d").map((s, i) => (
                <motion.button key={s.name}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -4, rotate: 3 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { playPop(); setSelected(s); if (mode === "learn") handlePickShape(s); }}
                  className={`bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-lg ${
                    selected.name === s.name ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}>
                  <ShapeSvg shape={s} size={64} />
                  <span className="font-display font-bold text-foreground text-xs">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {mode === "quiz" && quiz && (
          <motion.div key={`quiz-${quiz.target.name}-${total}`}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-bubble shadow-2xl p-6 md:p-10 border border-border text-center">
            <p className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
              Which one is a <span className="text-primary">{quiz.target.label}</span>?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
              {quiz.options.map((s) => {
                const isPicked = pick === s.name;
                const isCorrectPick = showResult && s.name === quiz.target.name;
                return (
                  <motion.button key={s.name}
                    whileHover={!showResult ? { scale: 1.05 } : {}} whileTap={!showResult ? { scale: 0.95 } : {}}
                    onClick={() => handleQuizPick(s)}
                    className={`bg-card border-2 rounded-2xl p-4 flex flex-col items-center shadow-md transition-colors ${
                      isCorrectPick ? "border-accent bg-accent/10"
                        : isPicked ? "border-destructive bg-destructive/10"
                        : "border-border hover:border-primary/60"
                    }`}>
                    <ShapeSvg shape={s} size={90} />
                    {showResult && s.name === quiz.target.name && <Check className="w-5 h-5 text-accent mt-1" />}
                    {showResult && isPicked && s.name !== quiz.target.name && <XIcon className="w-5 h-5 text-destructive mt-1" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      <SettingsBar />
    </div>
  );
};

export default ShapesGame;
