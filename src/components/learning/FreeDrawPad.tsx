import { useRef, useState, useEffect } from "react";
import { RotateCcw, Check, Sparkles } from "lucide-react";

type Props = {
  letter?: string;
  onSuccess?: () => void;
  onFail?: () => void;
  color?: string;
  size?: number;
};

const FreeDrawPad = ({
  letter,
  onSuccess,
  onFail,
  color = "hsl(var(--kid-blue))",
  size = 320,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const strokeCount = useRef(0);

  const getPointerPos = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * size,
      y: ((e.clientY - rect.top) / rect.height) * size,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    lastPoint.current = getPointerPos(e);
    strokeCount.current += 1;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d", { willReadFrequently: true });
    if (!ctx || !lastPoint.current) return;

    const p = getPointerPos(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = 16; // Thinner line
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
  };

  const onPointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
  };

  const reset = () => {
    setSucceeded(false);
    strokeCount.current = 0;
    clearCanvas();
  };

  const complete = () => {
    if (!letter) {
      setSucceeded(true);
      onSuccess?.();
      return;
    }

    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Evaluate drawing accuracy using offscreen canvas
    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const octx = offscreen.getContext("2d");
    if (!octx) return;

    // Draw the target letter
    octx.font = `bold ${size * 0.6}px sans-serif`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(letter, size / 2, size / 2);

    const targetData = octx.getImageData(0, 0, size, size).data;
    const userData = ctx.getImageData(0, 0, size, size).data;

    let targetPixels = 0;
    let overlappingPixels = 0;
    let errantPixels = 0;

    for (let i = 3; i < targetData.length; i += 4) {
      const isTarget = targetData[i] > 100;
      const isUser = userData[i] > 50;

      if (isTarget) {
        targetPixels++;
        if (isUser) {
          overlappingPixels++;
        }
      } else {
        // Pixel is not part of the target letter
        if (isUser) {
          errantPixels++;
        }
      }
    }

    const coverage = targetPixels === 0 ? 1 : overlappingPixels / targetPixels;
    const errantRatio = targetPixels === 0 ? 0 : errantPixels / targetPixels;

    // Must cover at least 45% of the letter, and cannot scribble excessively outside
    if (coverage > 0.45 && errantRatio < 0.8) {
      setSucceeded(true);
      onSuccess?.();
    } else {
      onFail?.();
      // Flash red briefly to indicate failure?
    }
  };

  // Draw background letter once
  useEffect(() => {
    if (!letter) return;
    const bgC = document.getElementById("bg-canvas-" + letter) as HTMLCanvasElement;
    if (!bgC) return;
    const ctx = bgC.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${size * 0.6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(150, 150, 150, 0.2)"; // text-muted-foreground/20 equivalent
    ctx.fillText(letter, size / 2, size / 2);
  }, [letter, size]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        className="relative bg-card rounded-3xl shadow-inner border-2 border-dashed border-border overflow-hidden"
        style={{ width: size, height: size, maxWidth: "100%" }}
      >
        {letter && (
          <canvas
            id={"bg-canvas-" + letter}
            width={size}
            height={size}
            className="absolute inset-0 pointer-events-none select-none"
          />
        )}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="relative w-full h-full touch-none z-10"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {succeeded && (
          <div className="pointer-events-none absolute z-20 top-2 right-2 flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-4 h-4" />
            <span className="font-display font-bold text-sm">Great Job!</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full font-display font-semibold shadow hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {!succeeded && (
          <button
            onClick={complete}
            className="flex items-center gap-2 bg-kid-green text-white px-4 py-2 rounded-full font-display font-semibold shadow hover:scale-105 transition-transform"
          >
            <Check className="w-4 h-4" />
            <span>I'm Done!</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FreeDrawPad;
