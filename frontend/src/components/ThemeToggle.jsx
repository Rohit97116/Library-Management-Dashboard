import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-button h-11 w-11"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
