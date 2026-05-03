import { useEffect, useRef } from "react";

export default function ClickSpark({
  sparkColor = "#D4AF37",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 9,
  duration = 420,
  easing = "ease-out",
  extraScale = 1,
  children,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ease = (t) =>
      easing === "linear" ? t : easing === "ease-in" ? t * t : 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => {
        const t = (now - s.start) / duration;
        if (t >= 1) return false;
        const r = sparkRadius * ease(t) * extraScale;
        const a = 1 - t;
        const x1 = s.x + Math.cos(s.angle) * r;
        const y1 = s.y + Math.sin(s.angle) * r;
        const x2 = s.x + Math.cos(s.angle) * (r + sparkSize);
        const y2 = s.y + Math.sin(s.angle) * (r + sparkSize);
        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = a;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [duration, easing, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / sparkCount,
        start: now,
      });
    }
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
      {children}
    </div>
  );
}
