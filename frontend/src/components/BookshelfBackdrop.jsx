import { motion } from "framer-motion";

const shelfRows = [
  [
    { width: 6.5, height: 78, color: "#1f8a83", accent: "#f59e0b" },
    { width: 4.6, height: 66, color: "#efb0a6", accent: "#7c2d12" },
    { width: 5.8, height: 84, color: "#0f766e", accent: "#facc15" },
    { width: 4.8, height: 71, color: "#7c2d12", accent: "#fda4af" },
    { width: 7.6, height: 82, color: "#8b1e3f", accent: "#f4c430" },
    { width: 4.4, height: 68, color: "#d97706", accent: "#fde68a" },
    { width: 6.8, height: 86, color: "#e6a29c", accent: "#7c2d12" },
    { width: 5.4, height: 72, color: "#6b7280", accent: "#facc15" },
    { width: 7.1, height: 76, color: "#556b2f", accent: "#f59e0b" },
    { width: 5.1, height: 81, color: "#1f8a83", accent: "#fda4af" },
    { width: 6.3, height: 74, color: "#efb0a6", accent: "#7c2d12" },
  ],
  [
    { width: 5.8, height: 76, color: "#1f8a83", accent: "#f59e0b" },
    { width: 7.2, height: 88, color: "#d97706", accent: "#fde68a", rotate: -12 },
    { width: 5.1, height: 68, color: "#0f766e", accent: "#fda4af" },
    { width: 6.5, height: 83, color: "#8b1e3f", accent: "#f4c430" },
    { width: 5.8, height: 72, color: "#efb0a6", accent: "#7c2d12" },
    { width: 4.8, height: 66, color: "#556b2f", accent: "#facc15" },
    { width: 6.9, height: 90, color: "#1f8a83", accent: "#fda4af" },
    { width: 5.6, height: 70, color: "#d97706", accent: "#fef3c7" },
    { width: 7.4, height: 85, color: "#efb0a6", accent: "#b45309" },
    { width: 5.3, height: 62, color: "#7c2d12", accent: "#fde68a", rotate: 10 },
  ],
  [
    { width: 5.2, height: 71, color: "#d97706", accent: "#fef3c7" },
    { width: 6.8, height: 86, color: "#0f766e", accent: "#fda4af" },
    { width: 5.5, height: 73, color: "#efb0a6", accent: "#7c2d12" },
    { width: 4.9, height: 62, color: "#556b2f", accent: "#facc15" },
    { width: 7.3, height: 80, color: "#8b1e3f", accent: "#f4c430" },
    { width: 6.2, height: 89, color: "#1f8a83", accent: "#f59e0b" },
    { width: 5.1, height: 69, color: "#efb0a6", accent: "#7c2d12" },
    { width: 5.7, height: 78, color: "#d97706", accent: "#fde68a" },
    { width: 7.5, height: 88, color: "#0f766e", accent: "#fda4af" },
    { width: 5.4, height: 70, color: "#efb0a6", accent: "#b45309" },
  ],
  [
    { width: 5.7, height: 76, color: "#1f8a83", accent: "#fda4af" },
    { width: 7.4, height: 87, color: "#efb0a6", accent: "#7c2d12" },
    { width: 5.2, height: 67, color: "#7c2d12", accent: "#f4c430", rotate: -8 },
    { width: 6.9, height: 90, color: "#d97706", accent: "#fde68a" },
    { width: 5.9, height: 71, color: "#0f766e", accent: "#fda4af" },
    { width: 7.2, height: 82, color: "#8b1e3f", accent: "#f4c430" },
    { width: 4.8, height: 66, color: "#556b2f", accent: "#facc15" },
    { width: 6.3, height: 80, color: "#1f8a83", accent: "#f59e0b" },
    { width: 5.7, height: 74, color: "#efb0a6", accent: "#7c2d12" },
    { width: 7.1, height: 84, color: "#d97706", accent: "#fde68a" },
  ],
];

const cutouts = [
  { top: "2.5%", height: "17%", width: "45%", left: "36%" },
  { top: "28%", height: "15%", width: "30%", left: "32%" },
  { top: "50%", height: "14%", width: "36%", left: "28%" },
  { top: "74%", height: "18%", width: "40%", left: "24%" },
];

const circles = [
  { top: "18%", left: "49%", size: 70 },
  { top: "81%", left: "44%", size: 86 },
];

function Book({ book, index, left, rowIndex }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-t-[6px] shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
      style={{
        left: `${left}%`,
        width: `${book.width}%`,
        height: `${book.height}%`,
        backgroundColor: book.color,
        transform: `rotate(${book.rotate || 0}deg)`,
        transformOrigin: "bottom center",
      }}
      animate={{ y: [0, -1.5, 0] }}
      transition={{
        duration: 4.5 + ((index + rowIndex) % 4),
        delay: index * 0.08,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div
        className="absolute left-[16%] top-[12%] w-[18%] rounded-full"
        style={{
          height: `${Math.max(6, book.height * 0.12)}%`,
          backgroundColor: book.accent,
          opacity: 0.8,
        }}
      />
      <div
        className="absolute left-[62%] top-[18%] w-[16%] rounded-full"
        style={{
          height: `${Math.max(5, book.height * 0.18)}%`,
          backgroundColor: book.accent,
          opacity: 0.5,
        }}
      />
      <div
        className="absolute inset-x-[14%] top-[40%] h-[6%] rounded-full opacity-80"
        style={{ backgroundColor: book.accent }}
      />
      <div
        className="absolute inset-x-[14%] top-[58%] h-[4%] rounded-full opacity-60"
        style={{ backgroundColor: book.accent }}
      />
    </motion.div>
  );
}

export default function BookshelfBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f8f5e7]">
      <div className="absolute inset-y-0 right-0 w-[92%] bg-[#2f241d] md:w-[64%]" />

      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[92%] md:w-[64%]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        {shelfRows.map((row, rowIndex) => {
          let offset = 4;

          return (
            <div
              key={rowIndex}
              className="absolute left-0 right-0"
              style={{
                top: `${7 + rowIndex * 22.5}%`,
                height: "18%",
              }}
            >
              {row.map((book, index) => {
                const left = offset;
                offset += book.width + 1.1;

                return (
                  <Book
                    key={`${rowIndex}-${index}`}
                    book={book}
                    index={index}
                    left={left}
                    rowIndex={rowIndex}
                  />
                );
              })}

              <div
                className="absolute inset-x-0 bottom-0 h-[14%]"
                style={{
                  background:
                    "linear-gradient(180deg, #a87446 0%, #8d6138 100%)",
                  boxShadow:
                    "0 -2px 0 rgba(255,255,255,0.14) inset, 0 10px 18px rgba(0,0,0,0.24)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-[4%] h-[5%] opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 10% 50%, rgba(245, 222, 179, 0.36) 0 10px, transparent 11px), radial-gradient(circle at 42% 50%, rgba(245, 222, 179, 0.32) 0 13px, transparent 14px), radial-gradient(circle at 76% 50%, rgba(245, 222, 179, 0.28) 0 9px, transparent 10px)",
                }}
              />
            </div>
          );
        })}
      </motion.div>

      {cutouts.map((cutout) => (
        <div
          key={`${cutout.top}-${cutout.left}`}
          className="absolute rounded-full bg-[#f8f5e7]"
          style={cutout}
        />
      ))}

      {circles.map((circle) => (
        <div
          key={`${circle.top}-${circle.left}`}
          className="absolute rounded-full bg-[#f8f5e7]"
          style={{
            top: circle.top,
            left: circle.left,
            width: circle.size,
            height: circle.size,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8f5e7_0%,rgba(248,245,231,0.98)_24%,rgba(248,245,231,0.92)_42%,rgba(248,245,231,0.34)_62%,transparent_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_24%,transparent_76%,rgba(0,0,0,0.04))]" />
    </div>
  );
}
