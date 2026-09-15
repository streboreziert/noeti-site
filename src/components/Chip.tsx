/**
 * The model, as an object: a small IC that hovers and turns. Pure CSS 3D —
 * six faces, a glow and a shadow — so it costs the GPU a handful of layers
 * and nothing on the main thread.
 */
const Chip = ({ size = 170 }: { size?: number }) => {
  const d = size * 0.24; // thickness
  const face = "absolute inset-0 rounded-[6px]";
  const pins =
    "repeating-linear-gradient(90deg, transparent 0 7px, hsl(45 60% 55%) 7px 11px, transparent 11px 18px)";
  const pinsV =
    "repeating-linear-gradient(180deg, transparent 0 7px, hsl(45 60% 55%) 7px 11px, transparent 11px 18px)";
  return (
    <div className="relative" style={{ width: size, height: size, perspective: 1100 }} aria-hidden>
      {/* glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 2.6,
          height: size * 2.6,
          background: "radial-gradient(circle, hsl(45 80% 55% / 0.28) 0%, hsl(45 80% 50% / 0.10) 38%, transparent 68%)",
        }}
      />
      {/* shadow on the ground */}
      <div
        className="absolute left-1/2 top-[78%] rounded-[50%] animate-bob-shadow pointer-events-none"
        style={{ width: size * 1.35, height: size * 0.5, background: "radial-gradient(ellipse, rgba(0,0,0,0.75), rgba(0,0,0,0) 70%)" }}
      />
      <div className="absolute inset-0 animate-bob" style={{ transformStyle: "preserve-3d" }}>
        {/* top */}
        <div
          className={`${face} flex flex-col justify-between p-[9%] border border-white/15`}
          style={{
            transform: `translateZ(${d / 2}px)`,
            background: "linear-gradient(145deg, hsl(50 8% 16%), hsl(50 8% 8%) 60%, hsl(50 8% 11%))",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -12px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-start justify-between">
            <span className="h-[7%] w-[7%] min-h-[6px] min-w-[6px] rounded-full bg-primary" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/55">RIGA · 26</span>
          </div>
          <div>
            <div className="font-serif text-[21px] leading-none text-white/90 tracking-tight">Noeti</div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-primary mt-1.5">PHYS-1 · CLOSED</div>
          </div>
          <div className="flex justify-between font-mono text-[8px] tracking-[0.18em] text-white/35">
            <span>ΔV · ΔI</span>
            <span>1 PASS</span>
          </div>
        </div>
        {/* bottom */}
        <div className={face} style={{ transform: `translateZ(${-d / 2}px) rotateY(180deg)`, background: "hsl(50 8% 6%)" }} />
        {/* sides (pins) */}
        <div className="absolute left-0 right-0" style={{ height: d, top: "100%", transformOrigin: "top", transform: `translateZ(${d / 2}px) rotateX(-90deg)`, background: `hsl(50 8% 9%)`, backgroundImage: pins, backgroundPosition: "center", backgroundSize: "18px 60%", backgroundRepeat: "repeat-x" }} />
        <div className="absolute left-0 right-0" style={{ height: d, bottom: "100%", transformOrigin: "bottom", transform: `translateZ(${d / 2}px) rotateX(90deg)`, background: `hsl(50 8% 8%)`, backgroundImage: pins, backgroundPosition: "center", backgroundSize: "18px 60%", backgroundRepeat: "repeat-x" }} />
        <div className="absolute top-0 bottom-0" style={{ width: d, left: "100%", transformOrigin: "left", transform: `translateZ(${d / 2}px) rotateY(90deg)`, background: `hsl(50 8% 7%)`, backgroundImage: pinsV, backgroundPosition: "center", backgroundSize: "60% 18px", backgroundRepeat: "repeat-y" }} />
        <div className="absolute top-0 bottom-0" style={{ width: d, right: "100%", transformOrigin: "right", transform: `translateZ(${d / 2}px) rotateY(-90deg)`, background: `hsl(50 8% 10%)`, backgroundImage: pinsV, backgroundPosition: "center", backgroundSize: "60% 18px", backgroundRepeat: "repeat-y" }} />
      </div>
    </div>
  );
};

export default Chip;
