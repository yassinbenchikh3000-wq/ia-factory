"use client";

import React from "react";

type ProgressBarProps = {
  value?: number; // 0 -> 100
  label?: string;
  showPercent?: boolean;

  // tailles simples
  size?: "sm" | "md" | "lg";

  // optionnels
  className?: string;
  barClassName?: string;
  trackClassName?: string;

  // si tu veux afficher une info sous la barre
  hint?: string;
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function ProgressBar({
  value = 0,
  label = "Progression",
  showPercent = true,
  size = "md",
  className = "",
  barClassName = "",
  trackClassName = "",
  hint = "",
}: ProgressBarProps) {
  const pct = clamp(Number.isFinite(value) ? value : 0);

  const height =
    size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2">
          {label ? (
            <span className="text-xs md:text-sm font-semibold text-purple-300">
              {label}
            </span>
          ) : (
            <span />
          )}

          {showPercent && (
            <span className="text-[10px] md:text-xs text-white/70">
              {pct}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className={`
          relative w-full rounded-full overflow-hidden
          bg-black/40 border border-purple-900
          ${height}
          ${trackClassName}
        `}
      >
        {/* Subtle glow line */}
        <span
          className="
            pointer-events-none absolute inset-x-0 top-0 h-[1px]
            bg-gradient-to-r from-transparent via-purple-400/40 to-transparent
          "
        />

        {/* Bar */}
        <div
          className={`
            ${height}
            rounded-full transition-all duration-300
            bg-gradient-to-r from-purple-500/70 via-fuchsia-500/60 to-indigo-400/60
            shadow-[0_0_12px_rgba(165,108,255,0.35)]
            ${barClassName}
          `}
          style={{ width: `${pct}%` }}
        />

        {/* Center black-hole pulse */}
        <span
          className="
            pointer-events-none absolute left-1/2 top-1/2
            h-16 w-16 -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-[radial-gradient(circle_at_center,rgba(165,108,255,0.12),transparent_65%)]
            blur-xl
          "
        />
      </div>

      {/* Hint */}
      {hint && (
        <div className="mt-2 text-[10px] md:text-xs text-white/60">
          {hint}
        </div>
      )}
    </div>
  );
}