/**
 * The model as an object: an LQFP-style microcontroller package (the STM32
 * look — black mould, gull-wing leads on four sides, laser-marked top) that
 * hovers and turns on a turntable. Pure CSS 3D. The 3D pose is static; only
 * the turn and the bob are animated, so it still reads as a chip when the
 * OS has "reduce motion" on.
 */
const Chip = ({ size = 170 }: { size?: number }) => {
  const d = Math.round(size * 0.13); // body thickness
  const lead = Math.round(size * 0.09); // lead length beyond the body
  const pitch = Math.max(6, Math.round(size * 0.052));
  const pinW = Math.max(2, Math.round(pitch * 0.42));
  const gold = "hsl(42 45% 62%)";
  const goldDark = "hsl(42 35% 40%)";
  const rowH = `repeating-linear-gradient(90deg, transparent 0 ${(pitch - pinW) / 2}px, ${gold} ${(pitch - pinW) / 2}px ${(pitch + pinW) / 2}px, transparent ${(pitch + pinW) / 2}px ${pitch}px)`;
  const rowV = `repeating-linear-gradient(180deg, transparent 0 ${(pitch - pinW) / 2}px, ${gold} ${(pitch - pinW) / 2}px ${(pitch + pinW) / 2}px, transparent ${(pitch + pinW) / 2}px ${pitch}px)`;
  const sideH = `repeating-linear-gradient(90deg, transparent 0 ${(pitch - pinW) / 2}px, ${goldDark} ${(pitch - pinW) / 2}px ${(pitch + pinW) / 2}px, transparent ${(pitch + pinW) / 2}px ${pitch}px)`;
  const sideV = `repeating-linear-gradient(180deg, transparent 0 ${(pitch - pinW) / 2}px, ${goldDark} ${(pitch - pinW) / 2}px ${(pitch + pinW) / 2}px, transparent ${(pitch + pinW) / 2}px ${pitch}px)`;
  const inset = Math.round(size * 0.1); // leads start this far from the corners
  const body = "hsl(40 6% 9%)";
  const bodyLight = "hsl(40 6% 13%)";

  return (
    <div className="relative" style={{ width: size, height: size, perspective: 1400 }} aria-hidden>
      {/* warm glow behind */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 2.6,
          height: size * 2.6,
          background: "radial-gradient(circle, hsl(45 80% 55% / 0.26) 0%, hsl(45 80% 50% / 0.10) 38%, transparent 68%)",
        }}
      />
      {/* shadow on the ground */}
      <div
        className="absolute left-1/2 top-[80%] rounded-[50%] animate-bob-shadow pointer-events-none"
        style={{ width: size * 1.4, height: size * 0.5, background: "radial-gradient(ellipse, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%)" }}
      />

      {/* bob (translate only) → static isometric pose → turntable spin */}
      <div className="absolute inset-0 animate-bob" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(60deg)" }}>
          <div className="absolute inset-0 animate-turn" style={{ transformStyle: "preserve-3d" }}>
            {/* leads, at the base level, sticking out on four sides */}
            <div className="absolute" style={{ left: inset, right: inset, top: -lead, height: lead, transform: `translateZ(${-d / 2 + 2}px)`, backgroundImage: rowH }} />
            <div className="absolute" style={{ left: inset, right: inset, bottom: -lead, height: lead, transform: `translateZ(${-d / 2 + 2}px)`, backgroundImage: rowH }} />
            <div className="absolute" style={{ top: inset, bottom: inset, left: -lead, width: lead, transform: `translateZ(${-d / 2 + 2}px)`, backgroundImage: rowV }} />
            <div className="absolute" style={{ top: inset, bottom: inset, right: -lead, width: lead, transform: `translateZ(${-d / 2 + 2}px)`, backgroundImage: rowV }} />

            {/* body: top */}
            <div
              className="absolute inset-0 rounded-[3px]"
              style={{
                transform: `translateZ(${d / 2}px)`,
                background: `linear-gradient(135deg, ${bodyLight}, ${body} 55%, hsl(40 6% 11%))`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* mould ring, like a real package */}
              <div className="absolute rounded-full border border-white/[0.07]" style={{ inset: "9%" }} />
              {/* pin 1 dimple */}
              <div className="absolute rounded-full" style={{ left: "8%", top: "8%", width: "6.5%", height: "6.5%", background: "radial-gradient(circle at 35% 35%, hsl(40 6% 20%), hsl(40 6% 5%))" }} />
              {/* laser marking */}
              <div className="absolute left-[13%] right-[10%] top-[24%] font-mono text-white/80 leading-[1.5]" style={{ fontSize: size * 0.062, letterSpacing: "0.06em" }}>
                <div className="font-serif tracking-normal" style={{ fontSize: size * 0.12, lineHeight: 1 }}>
                  Noeti
                </div>
                <div style={{ marginTop: size * 0.03 }}>PHYS1F407</div>
                <div className="text-white/55">RIGA 26 · RL</div>
                <div className="text-white/55">ΔV ΔI · 1 PASS</div>
              </div>
            </div>
            {/* body: bottom */}
            <div className="absolute inset-0 rounded-[3px]" style={{ transform: `translateZ(${-d / 2}px) rotateY(180deg)`, background: "hsl(40 6% 6%)" }} />
            {/* body: four sides, with the lead stubs where they leave the mould */}
            <div className="absolute left-0 right-0" style={{ height: d, top: "100%", transformOrigin: "top", transform: `translateZ(${d / 2}px) rotateX(-90deg)`, background: "hsl(40 6% 7%)", backgroundImage: sideH, backgroundSize: `${pitch}px 55%`, backgroundPosition: `${inset}px bottom`, backgroundRepeat: "repeat-x" }} />
            <div className="absolute left-0 right-0" style={{ height: d, bottom: "100%", transformOrigin: "bottom", transform: `translateZ(${d / 2}px) rotateX(90deg)`, background: "hsl(40 6% 7%)", backgroundImage: sideH, backgroundSize: `${pitch}px 55%`, backgroundPosition: `${inset}px top`, backgroundRepeat: "repeat-x" }} />
            <div className="absolute top-0 bottom-0" style={{ width: d, left: "100%", transformOrigin: "left", transform: `translateZ(${d / 2}px) rotateY(90deg)`, background: "hsl(40 6% 6%)", backgroundImage: sideV, backgroundSize: `55% ${pitch}px`, backgroundPosition: `right ${inset}px`, backgroundRepeat: "repeat-y" }} />
            <div className="absolute top-0 bottom-0" style={{ width: d, right: "100%", transformOrigin: "right", transform: `translateZ(${d / 2}px) rotateY(-90deg)`, background: "hsl(40 6% 8%)", backgroundImage: sideV, backgroundSize: `55% ${pitch}px`, backgroundPosition: `left ${inset}px`, backgroundRepeat: "repeat-y" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chip;
