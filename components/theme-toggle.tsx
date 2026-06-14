"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", icon: Sun, label: "亮色" },
    { value: "dark", icon: Moon, label: "暗色" },
    { value: "system", icon: Monitor, label: "系统" },
  ] as const;

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5">
      {options.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-xs ${
            theme === value
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setTheme(value)}
          aria-label={label}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  );
}
