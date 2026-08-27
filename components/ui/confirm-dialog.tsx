"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement = document.activeElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    cancelButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Card className="p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id={titleId}
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
              <p
                id={descriptionId}
                className="mt-3 text-sm leading-7 text-muted-foreground"
              >
                {description}
              </p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              className="bg-danger text-white shadow-[0_16px_36px_rgba(239,68,68,0.18)] hover:bg-red-500"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
