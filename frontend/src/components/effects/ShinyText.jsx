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
          "linear-gradient(120deg, rgba(212,175,55,0.55) 40%, rgba(255,232,150,1) 50%, rgba(212,175,55,0.55) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animation: disabled ? "none" : `shine ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
