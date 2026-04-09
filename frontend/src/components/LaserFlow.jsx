import { motion } from "framer-motion";

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const parsed = Number.parseInt(value, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function withAlpha(color, alpha) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function LaserFlow({
  color = "#cf9eff",
  horizontalBeamOffset = 0.1,
  verticalBeamOffset = 0,
  horizontalSizing = 0.5,
  verticalSizing = 2,
  wispDensity = 1,
  wispSpeed = 15,
  wispIntensity = 5,
  flowSpeed = 0.35,
  flowStrength = 0.25,
  fogIntensity = 0.45,
  fogScale = 0.3,
  fogFallSpeed = 0.6,
}) {
  const beamCount = 4 + Math.round(wispDensity * 2);
  const verticalBeams = Array.from({ length: 3 });
  const wisps = Array.from({ length: 5 + Math.round(wispDensity * 3) });
  const baseGlow = withAlpha(color, 0.34);
  const softGlow = withAlpha(color, fogIntensity * 0.26);
  const lineGlow = withAlpha(color, 0.84);
  const haze = withAlpha(color, fogIntensity * 0.12);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#060010]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(196, 106, 255, 0.22), transparent 26%), radial-gradient(circle at 80% 14%, rgba(91, 160, 255, 0.18), transparent 24%), radial-gradient(circle at 50% 84%, rgba(111, 0, 255, 0.2), transparent 28%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 24%, ${softGlow} 0, transparent 26%),
            radial-gradient(circle at 82% 18%, ${haze} 0, transparent 28%),
            radial-gradient(circle at 50% 78%, ${withAlpha(color, fogIntensity * 0.16)} 0, transparent 34%)
          `,
          filter: `blur(${28 + fogScale * 36}px)`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 0.95, 0.7],
        }}
        transition={{
          duration: 12 / Math.max(flowSpeed, 0.1),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-y-0 left-[-12%] w-[44%]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(
            color,
            0.12
          )} 44%, transparent 100%)`,
          filter: "blur(32px)",
          transform: "skewX(-18deg)",
        }}
        animate={{ x: ["-20%", "170%"] }}
        transition={{
          duration: 9 / Math.max(flowSpeed, 0.12),
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(115deg, transparent 0%, ${withAlpha(
            color,
            0.18
          )} 50%, transparent 100%)`,
          filter: "blur(40px)",
        }}
        animate={{ x: ["-14%", "12%", "-14%"] }}
        transition={{
          duration: 16 / Math.max(flowSpeed, 0.1),
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: beamCount }).map((_, index) => (
        <motion.div
          key={`h-${index}`}
          className="absolute left-1/2 top-1/2 h-px -translate-x-1/2"
          style={{
            width: `${70 + horizontalSizing * 55}%`,
            top: `${18 + index * (11 + horizontalBeamOffset * 24)}%`,
            background: `linear-gradient(90deg, transparent 0%, ${lineGlow} 18%, ${withAlpha(
              color,
              0.95
            )} 50%, ${lineGlow} 82%, transparent 100%)`,
            boxShadow: `0 0 ${12 + wispIntensity * 2}px ${withAlpha(
              color,
              0.7
            )}`,
          }}
          animate={{
            x: [
              `${-6 - flowStrength * 12}%`,
              `${8 + flowStrength * 14}%`,
              `${-6 - flowStrength * 12}%`,
            ],
            opacity: [0.42, 1, 0.42],
          }}
          transition={{
            duration: 8 + index * 1.4 - flowSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          delay: index * 0.35,
        }}
      />
      ))}

      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={`diag-${index}`}
          className="absolute left-[-25%] top-1/2 h-px w-[160%] -translate-y-1/2"
          style={{
            transform: `translateY(-50%) rotate(${index === 1 ? -14 : index === 2 ? 12 : -6}deg)`,
            background: `linear-gradient(90deg, transparent 0%, ${withAlpha(
              color,
              0.55
            )} 30%, ${withAlpha(color, 0.98)} 50%, ${withAlpha(
              color,
              0.55
            )} 70%, transparent 100%)`,
            boxShadow: `0 0 18px ${withAlpha(color, 0.45)}`,
            opacity: 0.5,
          }}
          animate={{
            x: ["-6%", "8%", "-6%"],
            opacity: [0.25, 0.8, 0.25],
          }}
          transition={{
            duration: 7 + index * 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        />
      ))}

      {verticalBeams.map((_, index) => (
        <motion.div
          key={`v-${index}`}
          className="absolute top-1/2 w-px -translate-y-1/2"
          style={{
            left: `${24 + index * (24 + verticalBeamOffset * 24)}%`,
            height: `${55 + verticalSizing * 12}%`,
            background: `linear-gradient(180deg, transparent 0%, ${lineGlow} 18%, ${withAlpha(
              color,
              0.94
            )} 50%, ${lineGlow} 82%, transparent 100%)`,
            boxShadow: `0 0 ${14 + wispIntensity * 2}px ${withAlpha(
              color,
              0.62
            )}`,
          }}
          animate={{
            y: [`${-5 - flowStrength * 10}%`, `${6 + flowStrength * 10}%`, `${-5 - flowStrength * 10}%`],
            opacity: [0.28, 0.74, 0.28],
          }}
          transition={{
            duration: 10 + index * 1.7 + fogFallSpeed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.6,
          }}
        />
      ))}

      {wisps.map((_, index) => (
        <motion.div
          key={`w-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${8 + index * 12}%`,
            top: `${10 + (index % 4) * 18}%`,
            width: `${60 + (index % 3) * 42}px`,
            height: `${60 + (index % 3) * 42}px`,
            background: `radial-gradient(circle, ${baseGlow} 0%, transparent 68%)`,
            filter: `blur(${20 + fogScale * 34}px)`,
          }}
          animate={{
            x: [0, 40 + flowStrength * 100, 0],
            y: [0, -28 - fogFallSpeed * 24, 0],
            opacity: [0.18, 0.42, 0.18],
          }}
          transition={{
            duration: Math.max(8, wispSpeed - index * 0.7),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.45,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.16,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,0,16,0.06)_52%,rgba(6,0,16,0.82)_100%)]" />
    </div>
  );
}
