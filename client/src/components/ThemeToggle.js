'use client';

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { ToggleButton } from "react-aria-components";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = useMemo(() => {
    if (!mounted) return "light"; // avoid hydration mismatch
    return theme === "system" ? systemTheme ?? "light" : theme;
  }, [mounted, theme, systemTheme]);

  const isDark = current === "dark";

  const onChange = (selected) => {
    // selected true => dark, false => light
    setTheme(selected ? "dark" : "light");
    // Optional: persist to your backend + cookie here
  };

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-9 w-9 rounded-full border border-neutral-300 dark:border-neutral-700"
      />
    );
  }

  return (
    <ToggleButton
      isSelected={isDark}
      onChange={onChange}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        inline-flex h-9 w-9 items-center justify-center rounded-full
        border border-neutral-300 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400
        transition
      `}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ToggleButton>
  );
}
