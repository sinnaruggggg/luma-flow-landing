import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

const fill = {
  position: "absolute",
  inset: 0,
};

const rootStyle = {
  ...fill,
  overflow: "hidden",
  borderRadius: "inherit",
};

const glassBox = (extra = {}) => ({
  position: "absolute",
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.08)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  ...extra,
});

function usePointer(ref) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, inside: false, vx: 0, vy: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let last = null;

    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const now = performance.now();
      let vx = 0;
      let vy = 0;

      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 18;
        vy = ((y - last.y) / dt) * 18;
      }

      last = { x, y, t: now };
      setPointer({ x, y, inside: true, vx, vy });
    };

    const onLeave = () => {
      setPointer((prev) => ({ ...prev, inside: false, vx: 0, vy: 0 }));
      last = null;
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);

  return pointer;
}

function stageCounts(density) {
  return density === "hero"
    ? { dots: 32, lines: 16, nodes: 22, grains: 46, bars: 72 }
    : { dots: 18, lines: 10, nodes: 14, grains: 28, bars: 42 };
}

function MagneticField({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);
  const dots = useMemo(
    () =>
      Array.from({ length: counts.dots }, (_, index) => ({
        x: 0.08 + ((index * 17) % 84) / 100,
        y: 0.12 + ((index * 11) % 70) / 100,
      })),
    [counts.dots],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div
        style={{
          ...fill,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 24%), linear-gradient(135deg, rgba(35,64,255,0.12), rgba(255,255,255,0.02))",
        }}
      />
      {dots.map((dot, index) => {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.max(0.08, Math.hypot(dx, dy));
        const push = pointer.inside ? Math.min(0.09, 0.028 / distance) : 0;
        const x = dot.x + (dx / distance) * push;
        const y = dot.y + (dy / distance) * push;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: density === "hero" ? 7 : 5,
              height: density === "hero" ? 7 : 5,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.86)",
              boxShadow: "0 0 20px rgba(255,255,255,0.48)",
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 28}px`, y: `${(pointer.y - 0.5) * 18}px` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        style={glassBox({ left: "18%", top: "24%", width: "34%", height: "24%", borderRadius: "24px" })}
      />
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * -18}px`, y: `${(pointer.y - 0.5) * -14}px` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        style={glassBox({ right: "14%", top: "52%", width: "24%", height: "18%", borderRadius: "999px" })}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: density === "hero" ? 260 : 180,
          height: density === "hero" ? 260 : 180,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background: "rgba(120,90,255,0.14)",
          filter: "blur(48px)",
        }}
      />
    </div>
  );
}

function FluidDrift({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const blobs = useMemo(
    () =>
      Array.from({ length: density === "hero" ? 16 : 10 }, (_, index) => ({
        x: 10 + ((index * 13) % 78),
        y: 14 + ((index * 17) % 68),
        s: 44 + (index % 4) * 16,
      })),
    [density],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div
        style={{
          ...fill,
          background: `radial-gradient(circle at ${pointer.x * 100}% ${pointer.y * 100}%, rgba(120,255,255,0.18), transparent 18%), linear-gradient(135deg, rgba(59,130,246,0.14), rgba(255,255,255,0.03) 42%, rgba(120,255,255,0.08))`,
        }}
      />
      {blobs.map((blob, index) => {
        const ox = Math.sin((pointer.x + index) * 4) * 24;
        const oy = Math.cos((pointer.y + index) * 4) * 18;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: blob.s + ox * 0.25,
              height: blob.s + oy * 0.25,
              transform: "translate(-50%, -50%)",
              borderRadius: "999px",
              background: "rgba(125,211,252,0.12)",
              filter: "blur(28px)",
            }}
          />
        );
      })}
      <div style={glassBox({ left: "32%", top: "34%", width: "34%", height: "24%", borderRadius: "28px" })} />
      <div style={glassBox({ right: "14%", top: "56%", width: "26%", height: "18%", borderRadius: "999px" })} />
    </div>
  );
}

function GravityRain({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const drops = useMemo(
    () =>
      Array.from({ length: density === "hero" ? 38 : 22 }, (_, index) => ({
        x: 4 + ((index * 7) % 92),
        delay: (index % 9) * 0.18,
      })),
    [density],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div style={glassBox({ left: "28%", top: "40%", width: "38%", height: "20%", borderRadius: "22px" })} />
      <div style={glassBox({ right: "12%", top: "20%", width: "18%", height: "24%", borderRadius: "20px" })} />
      {drops.map((drop, index) => {
        const bend = pointer.inside ? (pointer.x - 0.5) * 22 : 0;
        return (
          <Motion.div
            key={index}
            style={{
              position: "absolute",
              top: "-10%",
              left: `${drop.x}%`,
              width: 2,
              height: density === "hero" ? 34 : 24,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.64)",
            }}
            animate={{ y: ["0%", "80%", "120%"], x: [0, bend * 0.2, bend * 0.32], opacity: [0, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: drop.delay }}
          />
        );
      })}
    </div>
  );
}

function AvoidanceMesh({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);
  const nodes = useMemo(
    () => Array.from({ length: counts.nodes }, (_, index) => ({ x: 10 + (index % 4) * 22, y: 16 + Math.floor(index / 4) * 16 })),
    [counts.nodes],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <svg style={{ ...fill, width: "100%", height: "100%" }}>
        {nodes.map((node, index) => {
          const centerX = 52;
          const centerY = 48;
          const distance = dist(node.x, node.y, centerX, centerY);
          const avoid = distance < 28 ? (28 - distance) * 0.8 : 0;
          const angle = Math.atan2(node.y - centerY, node.x - centerX);
          const x = node.x + Math.cos(angle) * avoid + (pointer.x - 0.5) * 4;
          const y = node.y + Math.sin(angle) * avoid + (pointer.y - 0.5) * 3;
          const next = nodes[(index + 1) % nodes.length];

          return (
            <g key={index}>
              <line x1={`${x}%`} y1={`${y}%`} x2={`${next.x}%`} y2={`${next.y}%`} stroke="rgba(255,255,255,0.24)" strokeWidth="1.2" />
              <circle cx={`${x}%`} cy={`${y}%`} r={density === "hero" ? "3.2" : "2.4"} fill="rgba(255,255,255,0.9)" />
            </g>
          );
        })}
      </svg>
      <div style={glassBox({ left: "36%", top: "42%", width: "34%", height: "22%", borderRadius: "24px" })} />
    </div>
  );
}

function JellySurface({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const size = density === "hero" ? 220 : 160;

  return (
    <div ref={ref} style={{ ...rootStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Motion.div
        animate={{
          scaleX: pointer.inside ? 1 + Math.abs(pointer.vx) * 0.42 : 1,
          scaleY: pointer.inside ? 1 + Math.abs(pointer.vy) * 0.42 : 1,
          borderRadius: pointer.inside ? "38% 62% 53% 47% / 44% 38% 62% 56%" : "50%",
        }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        style={{
          width: size,
          height: size,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "linear-gradient(135deg, rgba(251,113,133,0.32), rgba(167,139,250,0.16))",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
        }}
      />
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 44}px`, y: `${(pointer.y - 0.5) * 24}px` }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        style={glassBox({ width: "28%", height: "16%", borderRadius: "999px" })}
      />
    </div>
  );
}

function WaveRefraction({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const rings = density === "hero" ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];

  return (
    <div ref={ref} style={rootStyle}>
      {rings.map((ring) => (
        <Motion.div
          key={ring}
          style={{
            position: "absolute",
            left: `${pointer.x * 100}%`,
            top: `${pointer.y * 100}%`,
            width: density === "hero" ? 90 : 64,
            height: density === "hero" ? 90 : 64,
            transform: "translate(-50%, -50%)",
            borderRadius: "999px",
            border: "1px solid rgba(186,230,253,0.2)",
          }}
          animate={{ scale: [0.25, 1.9], opacity: [0.7, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: ring * 0.46 }}
        />
      ))}
      <div style={glassBox({ left: "26%", top: "38%", width: "38%", height: "22%", borderRadius: "24px" })} />
    </div>
  );
}

function SmokeEscape() {
  const ref = useRef(null);
  const pointer = usePointer(ref);

  return (
    <div ref={ref} style={rootStyle}>
      <div
        style={{
          ...fill,
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.14), transparent 22%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.10), transparent 20%), radial-gradient(circle at 40% 72%, rgba(255,255,255,0.08), transparent 18%)",
          filter: "blur(24px)",
        }}
      />
      <div
        style={{
          ...fill,
          background: `radial-gradient(circle at ${pointer.x * 100}% ${pointer.y * 100}%, transparent 0 10%, rgba(255,255,255,0.08) 22%, transparent 35%)`,
        }}
      />
      <div style={glassBox({ left: "34%", top: "40%", width: "32%", height: "20%", borderRadius: "22px" })} />
    </div>
  );
}

function MagneticLines({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);

  return (
    <div ref={ref} style={rootStyle}>
      <svg style={{ ...fill, width: "100%", height: "100%" }}>
        {Array.from({ length: counts.lines }, (_, index) => {
          const y = 16 + index * (density === "hero" ? 5.2 : 7.2);
          const curve = (pointer.x - 0.5) * 90;
          return (
            <path
              key={index}
              d={`M0 ${y}% C 28% ${y + curve * 0.03}%, 60% ${y - curve * 0.03}%, 100% ${y}%`}
              fill="none"
              stroke="rgba(196,181,253,0.34)"
              strokeWidth="1.4"
            />
          );
        })}
      </svg>
      <div style={glassBox({ left: "38%", top: "30%", width: "20%", height: "28%", borderRadius: "26px" })} />
    </div>
  );
}

function GlassLens({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const lensSize = density === "hero" ? 140 : 96;

  return (
    <div ref={ref} style={rootStyle}>
      <div
        style={{
          ...fill,
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(34,211,238,0.1), rgba(255,255,255,0.04)), radial-gradient(circle at 18% 18%, rgba(255,255,255,0.14), transparent 24%), radial-gradient(circle at 72% 70%, rgba(255,255,255,0.1), transparent 28%)",
        }}
      />
      <div style={glassBox({ left: "24%", top: "34%", width: "44%", height: "28%", borderRadius: "30px" })} />
      <Motion.div
        animate={{ left: `${pointer.x * 100}%`, top: `${pointer.y * 100}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        style={{
          position: "absolute",
          width: lensSize,
          height: lensSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.28)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.18)",
        }}
      />
    </div>
  );
}

function RepulsionCloud({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);
  const particles = useMemo(
    () =>
      Array.from({ length: counts.dots + 10 }, (_, index) => ({
        x: 8 + ((index * 9) % 84),
        y: 12 + ((index * 15) % 72),
      })),
    [counts.dots],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div style={glassBox({ left: "34%", top: "38%", width: "36%", height: "22%", borderRadius: "22px" })} />
      {particles.map((particle, index) => {
        const centerX = 52;
        const centerY = 48;
        const centerDistance = Math.max(10, dist(particle.x, particle.y, centerX, centerY));
        const x = particle.x + ((particle.x - centerX) / centerDistance) * 10 + (pointer.x - 0.5) * 8;
        const y = particle.y + ((particle.y - centerY) / centerDistance) * 10 + (pointer.y - 0.5) * 6;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: density === "hero" ? 6 : 4,
              height: density === "hero" ? 6 : 4,
              borderRadius: "999px",
              background: "rgba(167,243,208,0.84)",
              left: `${x}%`,
              top: `${y}%`,
            }}
          />
        );
      })}
    </div>
  );
}

function SlimeFlow({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);

  return (
    <div ref={ref} style={rootStyle}>
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 20}px` }}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
        style={{
          position: "absolute",
          left: "12%",
          top: "20%",
          width: density === "hero" ? "34%" : "30%",
          height: density === "hero" ? "34%" : "30%",
          borderRadius: "40% 60% 50% 50% / 45% 35% 65% 55%",
          background: "rgba(190,242,100,0.18)",
          filter: "blur(18px)",
        }}
      />
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * -18}px`, y: `${(pointer.y - 0.5) * 12}px` }}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
        style={{
          position: "absolute",
          left: "44%",
          top: "42%",
          width: density === "hero" ? "28%" : "26%",
          height: density === "hero" ? "28%" : "26%",
          borderRadius: "52% 48% 42% 58% / 54% 42% 58% 46%",
          background: "rgba(132,204,22,0.16)",
          filter: "blur(20px)",
        }}
      />
      <div style={glassBox({ right: "12%", top: "28%", width: "22%", height: "28%", borderRadius: "30px" })} />
    </div>
  );
}

function LightRails({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);

  return (
    <div ref={ref} style={rootStyle}>
      <div style={glassBox({ left: "22%", top: "32%", width: "42%", height: "28%", borderRadius: "28px" })} />
      <Motion.div
        animate={{ x: `${pointer.x * (density === "hero" ? 260 : 180)}px` }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        style={{
          position: "absolute",
          left: "-10%",
          top: "42%",
          width: density === "hero" ? 220 : 160,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.82), transparent)",
          boxShadow: "0 0 20px rgba(255,255,255,0.6)",
        }}
      />
      <Motion.div
        animate={{ y: `${pointer.y * (density === "hero" ? 150 : 100)}px` }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        style={{
          position: "absolute",
          left: "62%",
          top: "-12%",
          width: 2,
          height: density === "hero" ? 200 : 140,
          background: "linear-gradient(180deg, transparent, rgba(253,224,71,0.84), transparent)",
          boxShadow: "0 0 20px rgba(253,224,71,0.55)",
        }}
      />
    </div>
  );
}

function DepthParallax() {
  const ref = useRef(null);
  const pointer = usePointer(ref);

  return (
    <div ref={ref} style={rootStyle}>
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 12}px`, y: `${(pointer.y - 0.5) * 8}px` }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        style={{ position: "absolute", inset: "6%", borderRadius: 40, background: "rgba(255,255,255,0.05)" }}
      />
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 22}px`, y: `${(pointer.y - 0.5) * 16}px` }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        style={{ position: "absolute", inset: "14%", borderRadius: 32, background: "rgba(96,165,250,0.1)" }}
      />
      <Motion.div
        animate={{ x: `${(pointer.x - 0.5) * 38}px`, y: `${(pointer.y - 0.5) * 24}px` }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        style={{ position: "absolute", inset: "24%", borderRadius: 24, background: "rgba(125,211,252,0.12)" }}
      />
      <div style={glassBox({ left: "34%", top: "38%", width: "34%", height: "22%", borderRadius: "24px" })} />
    </div>
  );
}

function WindVector({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const streaks = useMemo(() => Array.from({ length: density === "hero" ? 22 : 14 }, (_, index) => index), [density]);

  return (
    <div ref={ref} style={rootStyle}>
      {streaks.map((streak) => (
        <Motion.div
          key={streak}
          animate={{ x: `${pointer.vx * 120}px`, y: `${pointer.vy * 80}px` }}
          transition={{ type: "spring", stiffness: 40, damping: 18 }}
          style={{
            position: "absolute",
            left: `${(streak * 7) % 100}%`,
            top: `${18 + ((streak * 11) % 62)}%`,
            width: `${18 + (streak % 6) * 14}px`,
            height: 2,
            borderRadius: 999,
            background: "rgba(255,255,255,0.4)",
          }}
        />
      ))}
      <div style={glassBox({ right: "18%", top: "36%", width: "28%", height: "18%", borderRadius: "999px" })} />
    </div>
  );
}

function EnergyLinks({ density }) {
  const ref = useRef(null);
  usePointer(ref);
  const boxes = [
    { x: "18%", y: "30%" },
    { x: "42%", y: "50%" },
    { x: "72%", y: "28%" },
    { x: "76%", y: "68%" },
  ];

  return (
    <div ref={ref} style={rootStyle}>
      <svg style={{ ...fill, width: "100%", height: "100%" }}>
        <path d="M60 72 C 120 122, 182 110, 250 74" fill="none" stroke="rgba(192,132,252,0.68)" strokeWidth="2" strokeDasharray="6 8" />
        <path d="M120 122 C 184 144, 220 160, 270 170" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="1.5" strokeDasharray="8 10" />
      </svg>
      {boxes.map((box, index) => (
        <Motion.div
          key={index}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
          style={glassBox({
            left: box.x,
            top: box.y,
            width: density === "hero" ? "18%" : "20%",
            height: density === "hero" ? "16%" : "18%",
            borderRadius: "24px",
            transform: "translate(-50%, -50%)",
          })}
        />
      ))}
    </div>
  );
}

function PhysicsBoxes({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const boxes = useMemo(() => Array.from({ length: density === "hero" ? 14 : 10 }, (_, index) => index), [density]);

  return (
    <div ref={ref} style={rootStyle}>
      {boxes.map((box) => (
        <Motion.div
          key={box}
          animate={{
            x: `${Math.sin(box + pointer.x * 4) * 18}px`,
            y: `${Math.cos(box + pointer.y * 4) * 14}px`,
            rotate: (pointer.x - 0.5) * 22 + box * 4,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          style={glassBox({
            left: `${14 + ((box * 8) % 72)}%`,
            top: `${18 + ((box * 13) % 58)}%`,
            width: `${24 + (box % 4) * 12}px`,
            height: `${24 + (box % 4) * 12}px`,
            borderRadius: "20px",
          })}
        />
      ))}
    </div>
  );
}

function InkSpread({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const size = density === "hero" ? 180 : 132;

  return (
    <div ref={ref} style={rootStyle}>
      <Motion.div
        animate={{ left: `${pointer.x * 100}%`, top: `${pointer.y * 100}%`, scale: pointer.inside ? 1.16 : 0.82 }}
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background: "rgba(251,113,133,0.2)",
          filter: "blur(26px)",
        }}
      />
      <Motion.div
        animate={{ left: `${60 - pointer.x * 20}%`, top: `${56 - pointer.y * 10}%` }}
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: "999px",
          background: "rgba(217,70,239,0.16)",
          filter: "blur(24px)",
        }}
      />
      <div style={glassBox({ left: "34%", top: "40%", width: "36%", height: "22%", borderRadius: "24px" })} />
    </div>
  );
}

function GlitchStable({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);

  return (
    <div ref={ref} style={rootStyle}>
      {Array.from({ length: counts.bars }, (_, index) => {
        const near = dist((index * 13) % 100, (index * 17) % 100, 52, 48) < 24;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${(index * 13) % 100}%`,
              top: `${(index * 17) % 100}%`,
              width: near ? 4 : 10,
              height: 1 + (index % 3),
              opacity: near ? 0.12 : 0.42,
              background: "rgba(255,255,255,0.28)",
              transform: `translateX(${(pointer.x - 0.5) * (near ? 4 : 12)}px)`,
            }}
          />
        );
      })}
      <div style={glassBox({ left: "36%", top: "38%", width: "36%", height: "22%", borderRadius: "24px" })} />
    </div>
  );
}

function SandStack({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);
  const grains = useMemo(
    () => Array.from({ length: counts.grains }, (_, index) => ({ x: 16 + index * 2, y: 72 + (index % 4) * 2 })),
    [counts.grains],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div style={glassBox({ left: "30%", top: "36%", width: "36%", height: "22%", borderRadius: "22px" })} />
      {grains.map((grain, index) => (
        <Motion.div
          key={index}
          animate={{ x: `${(pointer.x - 0.5) * ((index % 6) - 3) * 4}px`, y: `${-Math.abs(pointer.vy) * 10}px` }}
          style={{
            position: "absolute",
            left: `${grain.x}%`,
            top: `${grain.y}%`,
            width: density === "hero" ? 3.2 : 2.4,
            height: density === "hero" ? 3.2 : 2.4,
            borderRadius: "999px",
            background: "rgba(252,211,77,0.9)",
          }}
        />
      ))}
    </div>
  );
}

function BlackHole({ density }) {
  const ref = useRef(null);
  const pointer = usePointer(ref);
  const counts = useMemo(() => stageCounts(density), [density]);
  const points = useMemo(
    () => Array.from({ length: counts.dots + 6 }, (_, index) => ({ x: 15 + index * 3.3, y: 20 + ((index * 2.2) % 56) })),
    [counts.dots],
  );

  return (
    <div ref={ref} style={rootStyle}>
      <div
        style={{
          position: "absolute",
          left: "44%",
          top: "42%",
          width: density === "hero" ? 110 : 72,
          height: density === "hero" ? 110 : 72,
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background: "rgba(139,92,246,0.24)",
          filter: "blur(12px)",
          boxShadow: "0 0 50px rgba(139,92,246,0.5)",
        }}
      />
      {points.map((point, index) => {
        const targetX = 44 + (point.x - 44) * (pointer.inside ? 0.54 : 1);
        const targetY = 42 + (point.y - 42) * (pointer.inside ? 0.54 : 1);

        return (
          <Motion.div
            key={index}
            animate={{ left: `${targetX}%`, top: `${targetY}%`, scale: pointer.inside ? 0.7 : 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: index * 0.01 }}
            style={{
              position: "absolute",
              width: density === "hero" ? 6 : 4,
              height: density === "hero" ? 6 : 4,
              borderRadius: "999px",
              background: "rgba(237,233,254,0.88)",
            }}
          />
        );
      })}
    </div>
  );
}

const effectMap = {
  magnetic: MagneticField,
  fluid: FluidDrift,
  rain: GravityRain,
  mesh: AvoidanceMesh,
  jelly: JellySurface,
  wave: WaveRefraction,
  smoke: SmokeEscape,
  lines: MagneticLines,
  lens: GlassLens,
  cloud: RepulsionCloud,
  slime: SlimeFlow,
  rails: LightRails,
  parallax: DepthParallax,
  wind: WindVector,
  links: EnergyLinks,
  boxes: PhysicsBoxes,
  ink: InkSpread,
  glitch: GlitchStable,
  sand: SandStack,
  hole: BlackHole,
};

export function EffectStage({ kind, density = "card", className = "", style = {} }) {
  const Component = effectMap[kind] ?? MagneticField;

  return (
    <div className={className} style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", ...style }}>
      <Component density={density} />
    </div>
  );
}
