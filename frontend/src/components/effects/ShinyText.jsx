export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}) {
  const animationDuration = `${speed}s`;
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0.55) 40%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animation: disabled ? "none" : `shine ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
