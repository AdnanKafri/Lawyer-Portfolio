"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type DashboardSelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = {
  name: string;
  options: DashboardSelectOption[];
  defaultValue?: string;
  placeholder?: string;
  emptyLabel?: string;
  ariaLabel: string;
  className?: string;
};

export function FormSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  emptyLabel = placeholder,
  ariaLabel,
  className,
}: FormSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className="flex w-full items-center justify-between gap-3 rounded-[1.35rem] border border-border bg-surface-elevated/80 px-4 py-3.5 text-left text-sm text-foreground shadow-[0_14px_35px_rgba(0,0,0,0.22)] outline-none transition hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated focus:border-border-strong focus:ring-2 focus:ring-ring"
      >
        <span className={cn("min-w-0 flex-1 truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition duration-200",
            isOpen && "rotate-180 text-accent",
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={id}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(180deg,rgba(23,27,34,0.98),rgba(16,18,23,0.98))] shadow-[0_22px_70px_rgba(0,0,0,0.42)] ring-1 ring-inset ring-white/5"
        >
          <div className="max-h-64 overflow-auto p-2">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                setValue("");
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
                value === ""
                  ? "bg-[rgba(193,161,103,0.12)] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              <span>{emptyLabel}</span>
              {value === "" ? <Check className="h-4 w-4 text-accent" /> : null}
            </button>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
                    isSelected
                      ? "bg-[rgba(193,161,103,0.12)] text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 text-accent" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
