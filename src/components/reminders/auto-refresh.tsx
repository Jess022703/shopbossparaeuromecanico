"use client";

import { useEffect } from "react";

/** Recarga la pagina cada `seconds` para reflejar el progreso del envio en curso. */
export function AutoRefresh({ seconds = 5 }: { seconds?: number }) {
  useEffect(() => {
    const timer = setInterval(() => {
      window.location.reload();
    }, seconds * 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return null;
}
