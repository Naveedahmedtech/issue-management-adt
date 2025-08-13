import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export type StatusOption = {
  value: string;
  label: string;
  colorClass?: string;
};

export type StatusDropdownProps = {
  value: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
  options?: StatusOption[];
  className?: string;
  menuClassName?: string;
  placeholder?: string;
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-todo text-text",
  "ON GOING": "bg-pending text-text",
  COMPLETED: "bg-success text-text",
  Default: "bg-todo text-text",
};

const DEFAULT_OPTIONS: StatusOption[] = [
  { label: "ACTIVE", value: "ACTIVE", colorClass: "bg-todo" },
  { label: "ON GOING", value: "ON GOING", colorClass: "bg-pending" },
  { label: "COMPLETED", value: "COMPLETED", colorClass: "bg-success" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  disabled,
  options,
  className,
  menuClassName,
  placeholder = "Select status",
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  const opts = useMemo(() => options?.length ? options : DEFAULT_OPTIONS, [options]);

  const currentColor = STATUS_COLORS[value] ?? STATUS_COLORS.Default;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const target = e.target as HTMLElement;
      if (!rootRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const moveActive = (delta: number) => {
    const max = opts.length - 1;
    const next = Math.max(0, Math.min(max, (activeIndex < 0 ? 0 : activeIndex) + delta));
    setActiveIndex(next);
    const el = listRef.current?.querySelectorAll<HTMLButtonElement>("[role='option']")[next];
    el?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      moveActive(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(opts.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (activeIndex >= 0) {
        const chosen = opts[activeIndex];
        onChange(chosen.value);
        setOpen(false);
        buttonRef.current?.focus();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleOptionClick = (idx: number) => {
    const chosen = opts[idx];
    onChange(chosen.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const selectedIndex = useMemo(() => opts.findIndex(o => o.value === value), [opts, value]);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  return (
    <div ref={rootRef} className={cx("relative inline-block", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={cx(
          "group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border shadow-sm",
          "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
          currentColor,
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => !disabled && setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
      >
        <span className={cx("h-2.5 w-2.5 rounded-full", opts[selectedIndex]?.colorClass ?? "bg-neutral-400")} />
        <span className="truncate max-w-[12rem]">{value || placeholder}</span>
        <FiChevronDown className={cx("shrink-0 transition-transform", open && "rotate-180")}/>
      </button>

      {open && (
        <div
          className={cx(
            "absolute z-50 mt-2 w-56 rounded-xl border bg-white shadow-lg ring-1 ring-black/5",
            "origin-top min-w-[12rem] overflow-hidden",
            menuClassName,
          )}
        >
          <div
            id={listId}
            role="listbox"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
            tabIndex={-1}
            ref={listRef}
            className={cx("py-1 max-h-64 overflow-auto")}
          >
            {opts.map((opt, idx) => {
              const isActive = idx === activeIndex;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  type="button"
                  id={`${listId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  key={opt.value}
                  className={cx(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm",
                    "hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none",
                    isActive && "bg-neutral-50",
                  )}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleOptionClick(idx)}
                >
                  <span className={cx("h-2.5 w-2.5 rounded-full", opt.colorClass ?? "bg-neutral-400")} />
                  <span className={cx("flex-1 text-left", isSelected && "font-semibold")}>{opt.label}</span>
                  {isSelected && <FiCheck aria-hidden className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
