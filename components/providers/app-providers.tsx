"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#151821",
            border: "1px solid rgba(198, 164, 106, 0.18)",
            color: "#f4efe6",
          },
        }}
      />
    </>
  );
}
