import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function VariableProximity({
  label,
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings = "'wght' 800, 'opsz' 40",
  radius = 90,
  falloff = "linear",
  className = "",
  containerRef,
}) {
  const letters = label.split("");
  const charsRef = useRef([]);
  const mx = useMotionValue(99999);
  const my = useMotionValue(99999);
  const sx = useSpring(mx, { stiffness: 200, damping: 30 });
  const sy = useSpring(my, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const el = containerRef?.current ?? document;
    const handle = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, [containerRef, mx, my]);

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {letters.map((ch, i) => (
        <Letter
          key={i}
          ch={ch}
          mx={sx}
          my={sy}
          radius={radius}
          falloff={falloff}
          fromFVS={fromFontVariationSettings}
          toFVS={toFontVariationSettings}
          ref={(el) => (charsRef.current[i] = el)}
        />
      ))}
    </span>
  );
}

import { forwardRef, useState } from "react";
const Letter = forwardRef(function Letter(
  { ch, mx, my, radius, falloff, fromFVS, toFVS },
  ref
) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!ref?.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [ref]);

  const t = useTransform([mx, my], ([x, y]) => {
    const d = Math.hypot(x - pos.x, y - pos.y);
    if (d >= radius) return 0;
    const n = 1 - d / radius;
    return falloff === "exponential" ? n * n : n;
  });
  const fvs = useTransform(t, (v) => interpolateFVS(fromFVS, toFVS, v));

  return (
    <motion.span ref={ref} style={{ fontVariationSettings: fvs, display: "inline-block" }}>
      {ch === " " ? "\u00A0" : ch}
    </motion.span>
  );
});

function interpolateFVS(a, b, t) {
  const pa = parseFVS(a);
  const pb = parseFVS(b);
  const out = Object.keys(pa)
    .map((k) => `'${k}' ${Math.round(pa[k] + (pb[k] - pa[k]) * t)}`)
    .join(", ");
  return out;
}
function parseFVS(s) {
  const o = {};
  s.match(/'(\w+)'\s+(\d+)/g)?.forEach((m) => {
    const [, k, v] = m.match(/'(\w+)'\s+(\d+)/);
    o[k] = +v;
  });
  return o;
}
