"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

type LenisContextValue = {
  lenis: Lenis | null;
};

export const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext);
}
