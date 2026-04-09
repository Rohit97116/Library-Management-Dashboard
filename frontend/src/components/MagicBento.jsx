import { motion } from "framer-motion";
import { useMemo, useState } from "react";

function buildParticles(count, glowColor) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    size: 2 + (index % 3),
    left: `${6 + ((index * 11) % 88)}%`,
    top: `${10 + ((index * 17) % 76)}%`,
    delay: index * 0.18,
    opacity: 0.16 + (index % 4) * 0.08,
    color: `rgba(${glowColor}, ${0.2 + (index % 4) * 0.12})`,
  }));
}

export default function MagicBento({
  items,
  renderItem,
  className = "",
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = "132, 0, 255",
  disableAnimations = false,
}) {
  const [spotlight, setSpotlight] = useState({ x: -9999, y: -9999 });
  const [burst, setBurst] = useState([]);
  const particles = useMemo(
    () => buildParticles(particleCount, glowColor),
    [particleCount, glowColor]
  );

  function handlePointerMove(event) {
    if (!enableSpotlight) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handlePointerLeave() {
    setSpotlight({ x: -9999, y: -9999 });
  }

  function handleClick(event) {
    if (!clickEffect) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();
    setBurst((current) => [...current, { id, x, y }]);
    window.setTimeout(() => {
      setBurst((current) => current.filter((entry) => entry.id !== id));
    }, 550);
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/50 bg-white/60 p-1 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 ${className}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handleClick}
      style={{
        boxShadow: enableBorderGlow
          ? `0 0 0 1px rgba(${glowColor}, 0.1), 0 24px 60px rgba(${glowColor}, 0.08)`
          : undefined,
      }}
    >
      {enableSpotlight ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${glowColor}, 0.18), transparent 46%)`,
          }}
        />
      ) : null}

      {enableStars ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
              }}
              animate={
                disableAnimations
                  ? undefined
                  : {
                      y: [0, -10, 0],
                      opacity: [
                        particle.opacity,
                        particle.opacity + 0.2,
                        particle.opacity,
                      ],
                    }
              }
              transition={{
                duration: 3.6 + particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      ) : null}

      {clickEffect ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {burst.map((entry) => (
            <motion.span
              key={entry.id}
              className="absolute block rounded-full border"
              style={{
                left: entry.x,
                top: entry.y,
                borderColor: `rgba(${glowColor}, 0.8)`,
              }}
              initial={{
                width: 0,
                height: 0,
                opacity: 0.8,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: 220,
                height: 220,
                opacity: 0,
                x: "-50%",
                y: "-50%",
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.key || item.title || index}
            className={`relative overflow-hidden rounded-lg border border-white/60 bg-white/72 p-5 dark:border-white/10 dark:bg-slate-900/70 ${
              textAutoHide ? "group" : ""
            }`}
            whileHover={
              disableAnimations
                ? undefined
                : enableTilt
                  ? { rotateX: -3, rotateY: index % 2 === 0 ? 3 : -3, y: -4 }
                  : { y: -4 }
            }
            transition={{ duration: 0.2 }}
            style={{
              transformStyle: enableTilt ? "preserve-3d" : undefined,
            }}
          >
            {enableBorderGlow ? (
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background: `linear-gradient(140deg, rgba(${glowColor}, 0.16), transparent 35%, transparent 65%, rgba(${glowColor}, 0.1))`,
                }}
              />
            ) : null}

            {enableMagnetism ? (
              <div className="pointer-events-none absolute inset-0 bg-transparent" />
            ) : null}

            <div className="relative z-10">{renderItem(item, index)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
