"use client";

import React, { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                   bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
      >
        <span>⚙️</span>
        <span className="hidden sm:inline">Settings</span>
      </button>

      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}