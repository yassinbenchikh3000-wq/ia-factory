"use client";

import React from "react";

type GalaxyCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;

  // Optionnel : si tu veux compacter certaines bulles
  compact?: boolean;
};

export default function GalaxyCard({
  title,
  subtitle,
  children,
  className = "",
  compact = false,
}: GalaxyCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border border-purple-700/60
        bg-gradient-to-b from-black/70 via-[#060012]/70 to-black/80
        shadow-[0_0_18px_rgba(165,108,255,0.18)]
        ${compact ? "p-4" : "p-6"}
        ${className}
      `}
    >
      {/* ===== DÉCOR GALAXIE / TROU NOIR ===== */}
      <span
        className="
          pointer-events-none absolute -top-24 -right-24
          h-64 w-64 rounded-full
          bg-gradient-to-br from-purple-600/20 via-fuchsia-500/10 to-cyan-400/10
          blur-2xl
        "
      />
      <span
        className="
          pointer-events-none absolute -bottom-28 -left-28
          h-72 w-72 rounded-full
          bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/10
          blur-3xl
        "
      />
      <span
        className="
          pointer-events-none absolute top-1/2 left-1/2
          h-72 w-72 -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle_at_center,rgba(165,108,255,0.18),transparent_60%)]
          blur-xl
        "
      />

      {/* ===== LIGNE GLOW FINE ===== */}
      <span
        className="
          pointer-events-none absolute inset-x-0 top-0 h-[1px]
          bg-gradient-to-r from-transparent via-purple-400/50 to-transparent
        "
      />

      {/* ===== HEADER OPTIONNEL ===== */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg md:text-xl font-bold text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-xs md:text-sm text-white/60">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ===== CONTENU ===== */}
      <div className="relative z-10">{children}</div>

      {/* ===== PETITES ÉTOILES (subtiles) ===== */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-[0.08]
          bg-[radial-gradient(#ffffff_1px,transparent_1px)]
          [background-size:18px_18px]
        "
      />
    </div>
  );
}