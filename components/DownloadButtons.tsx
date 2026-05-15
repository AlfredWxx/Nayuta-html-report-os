"use client";

import { useState } from "react";

const options = ["PDF", "HTML", "Markdown"];

export function DownloadButtons() {
  const [open, setOpen] = useState(false);

  return (
    <div className="report-download-bar">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        Download
      </button>
      {open ? (
        <div className="report-download-menu" role="menu">
          {options.map((label) => (
            <button key={label} type="button" role="menuitem" aria-disabled="true">
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
