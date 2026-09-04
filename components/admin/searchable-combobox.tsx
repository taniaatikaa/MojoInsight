"use client";

import { useEffect, useId, useRef, useState } from "react";

function IconSearch() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function SearchableCombobox({
  value,
  onChange,
  options,
  placeholder,
  strict = false,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  strict?: boolean;
  ariaLabel: string;
}) {
  const listboxId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (strict) setQuery(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [strict, value]);

  const q = query.trim().toLowerCase();
  const matches = q ? options.filter((o) => o.toLowerCase().includes(q)).slice(0, 8) : options.slice(0, 8);

  function handleInputChange(v: string) {
    setQuery(v);
    setOpen(true);
    if (!strict) onChange(v);
  }

  function select(o: string) {
    setQuery(o);
    onChange(o);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          className="w-full rounded-[10px] border-[1.5px] border-brand-border py-2.5 pr-9 pl-3 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
        />
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-brand-muted">
          <IconSearch />
        </div>
      </div>

      {open && matches.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 max-h-[200px] overflow-y-auto rounded-xl border-[1.5px] border-brand-border bg-white p-1.5 shadow-[0_8px_24px_rgba(0,70,23,0.13)]"
        >
          {matches.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              onClick={() => select(o)}
              className={`block w-full rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                o === value ? "bg-brand-bg-alt font-bold text-brand-green" : "font-normal text-brand-ink hover:bg-brand-bg"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {open && strict && q && matches.length === 0 && (
        <div className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 rounded-xl border-[1.5px] border-brand-border bg-white px-3.5 py-3 text-[13px] text-brand-muted shadow-[0_8px_24px_rgba(0,70,23,0.13)]">
          Tidak ditemukan. Coba kata kunci lain.
        </div>
      )}
    </div>
  );
}
