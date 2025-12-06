"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type BlackHoleItem = {
  label: string;
  value: string;
  group?: string;
};

type BlackHoleDropdownProps = {
  onSelect: (value: string) => void;

  // Optionnels pour personnaliser par bulle
  items?: BlackHoleItem[];
  placeholder?: string;
  label?: string;
  className?: string;

  // Si tu veux pré-filtrer un groupe
  defaultGroup?: string;
};

const DEFAULT_ITEMS: BlackHoleItem[] = [
  // ===== IA TEXTE (Module 1) =====
  { group: "IA Texte", label: "GPT-4.1", value: "GPT-4.1" },
  { group: "IA Texte", label: "GPT-4.1 Turbo", value: "GPT-4.1 Turbo" },
  { group: "IA Texte", label: "GPT-O3", value: "GPT-O3" },

  { group: "IA Texte", label: "Gemini Ultra 1.5", value: "Gemini Ultra 1.5" },
  { group: "IA Texte", label: "Gemini Pro 1.5", value: "Gemini Pro 1.5" },

  { group: "IA Texte", label: "Llama 3.2 90B", value: "Llama 3.2 90B" },
  { group: "IA Texte", label: "Llama 3.1 405B", value: "Llama 3.1 405B" },

  { group: "IA Texte", label: "Mistral Large", value: "Mistral Large" },
  { group: "IA Texte", label: "Mistral Small", value: "Mistral Small" },

  { group: "IA Texte", label: "Qwen 2.5 110B", value: "Qwen 2.5 110B" },
  { group: "IA Texte", label: "Qwen 2.5 72B", value: "Qwen 2.5 72B" },

  { group: "IA Texte", label: "DeepSeek V3", value: "DeepSeek V3" },
  { group: "IA Texte", label: "DeepSeek R1", value: "DeepSeek R1" },

  // ===== IA VIDÉO (Module 2) =====
  { group: "IA Vidéo", label: "Sora 2", value: "Sora 2" },
  { group: "IA Vidéo", label: "Sora (Text-to-Video)", value: "Sora (Text-to-Video)" },

  { group: "IA Vidéo", label: "Veo 3", value: "Veo 3" },
  { group: "IA Vidéo", label: "Veo 2", value: "Veo 2" },

  { group: "IA Vidéo", label: "Pika 2.2", value: "Pika 2.2" },
  { group: "IA Vidéo", label: "Pika 2.0", value: "Pika 2.0" },

  { group: "IA Vidéo", label: "Runway Gen-3", value: "Gen-3" },
  { group: "IA Vidéo", label: "Runway Gen-2", value: "Gen-2" },

  { group: "IA Vidéo", label: "Luma Dream Machine", value: "Dream Machine" },
  { group: "IA Vidéo", label: "Stable Video", value: "Stable Video" },

  // ===== PLATEFORMES (Module 3) =====
  { group: "Plateformes", label: "YouTube Shorts", value: "youtube" },
  { group: "Plateformes", label: "TikTok", value: "tiktok" },
  { group: "Plateformes", label: "Instagram Reels", value: "instagram" },
];

export default function BlackHoleDropdown({
  onSelect,
  items,
  placeholder = "Choisir via le trou noir...",
  label = "🌌 Black Hole Selector",
  className = "",
  defaultGroup,
}: BlackHoleDropdownProps) {
  const data = items?.length ? items : DEFAULT_ITEMS;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = data;

    if (defaultGroup) {
      base = base.filter((i) => (i.group || "").toLowerCase() === defaultGroup.toLowerCase());
    }

    if (!q) return base;

    return base.filter((i) => {
      const hay = `${i.label} ${i.value} ${i.group ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, query, defaultGroup]);

  // Grouper pour affichage
  const grouped = useMemo(() => {
    const map = new Map<string, BlackHoleItem[]>();
    for (const item of filtered) {
      const g = item.group ?? "Autres";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Flatten pour navigation clavier
  const flat = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query, open, defaultGroup]);

  // Click outside -> close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item: BlackHoleItem) => {
    onSelect(item.value);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowDown") {
      setHighlightIndex((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => Math.max(i - 1, 0));
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      const item = flat[highlightIndex];
      if (item) handleSelect(item);
      e.preventDefault();
    }
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Label */}
      <div className="text-sm text-purple-300 font-semibold mb-2">
        {label}
      </div>

      {/* Input trigger */}
      <div
        className={`
          relative w-full rounded-lg
          bg-black/40 border border-purple-600
          hover:border-purple-400 transition
          shadow-[0_0_10px_rgba(165,108,255,0.18)]
        `}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="
            w-full bg-transparent text-white
            placeholder-white/40
            px-3 py-2 rounded-lg
            outline-none
          "
        />

        {/* little cosmic dot */}
        <span
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-2 h-2 rounded-full
            bg-purple-400
            shadow-[0_0_10px_#a56cff]
            opacity-80
          "
        />
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          className="
            mt-2 w-full rounded-lg
            bg-black/90 border border-purple-700
            shadow-[0_0_18px_rgba(165,108,255,0.22)]
            max-h-72 overflow-auto
          "
        >
          {flat.length === 0 && (
            <div className="p-3 text-sm text-white/60">
              Aucun résultat.
            </div>
          )}

          {/* Grouped rendering */}
          {grouped.map(([groupName, groupItems]) => (
            <div key={groupName} className="border-b border-purple-900/60 last:border-b-0">
              <div className="px-3 py-2 text-xs uppercase tracking-wider text-purple-300/80 bg-black/40">
                {groupName}
              </div>

              <div className="py-1">
                {groupItems.map((item) => {
                  const idx = flat.findIndex((x) => x.value === item.value && x.label === item.label);
                  const active = idx === highlightIndex;

                  return (
                    <button
                      key={`${item.group}-${item.value}-${item.label}`}
                      type="button"
                      onMouseEnter={() => idx >= 0 && setHighlightIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`
                        w-full text-left px-3 py-2 text-sm
                        transition
                        ${active
                          ? "bg-purple-700/35 text-white"
                          : "text-white/85 hover:bg-purple-700/20"}
                      `}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.label !== item.value && (
                        <span className="ml-2 text-xs text-white/40">
                          ({item.value})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}