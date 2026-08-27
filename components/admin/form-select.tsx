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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const allOptions = [{ label: emptyLabel, value: "" }, ...options];
  const selectedIndex = Math.max(
    0,
    allOptions.findIndex((option) => option.value === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = allOptions[selectedIndex];

  useEffect(() => {
    const nextIndex = Math.max(
      0,
      allOptions.findIndex((option) => option.value === defaultValue),
    );

    setValue(defaultValue);
    setActiveIndex(nextIndex);
  }, [defaultValue]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, isOpen]);

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

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  const openMenu = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setIsOpen(false);

    if (returnFocus) {
      triggerRef.current?.focus();
    }
  };

  const selectOption = (index: number) => {
    const option = allOptions[index];

    if (!option) {
      return;
    }

    setValue(option.value);
    setActiveIndex(index);
    closeMenu();
  };

  const moveActiveIndex = (direction: 1 | -1) => {
    setActiveIndex((current) =>
      Math.min(allOptions.length - 1, Math.max(0, current + direction)),
    );
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id}
        aria-activedescendant={
          isOpen ? `${id}-option-${activeIndex}` : undefined
        }
        aria-label={ariaLabel}
        onClick={() => (isOpen ? closeMenu(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(selectedIndex);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMenu(selectedIndex);
          } else if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeMenu();
          }
        }}
        className="flex w-full items-center justify-between gap-3 rounded-[1.35rem] border border-border bg-surface-elevated/80 px-4 py-3.5 text-left text-sm text-foreground shadow-[0_14px_35px_rgba(0,0,0,0.22)] outline-none transition hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-elevated focus:border-border-strong focus:ring-2 focus:ring-ring"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            !selectedOption && "text-muted-foreground",
          )}
        >
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
          aria-label={ariaLabel}
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(180deg,rgba(23,27,34,0.98),rgba(16,18,23,0.98))] shadow-[0_22px_70px_rgba(0,0,0,0.42)] ring-1 ring-inset ring-white/5"
        >
          <div className="max-h-64 overflow-auto p-2">
            {allOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${option.value}-${index}`}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  id={`${id}-option-${index}`}
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(index)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      moveActiveIndex(1);
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      moveActiveIndex(-1);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      setActiveIndex(0);
                    } else if (event.key === "End") {
                      event.preventDefault();
                      setActiveIndex(allOptions.length - 1);
                    } else if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectOption(index);
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      closeMenu();
                    } else if (event.key === "Tab") {
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-ring",
                    isSelected
                      ? "bg-[rgba(193,161,103,0.12)] text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    isActive &&
                      !isSelected &&
                      "bg-white/[0.04] text-foreground",
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
