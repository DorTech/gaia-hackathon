import { atom } from "jotai";

const SIDEBAR_STORAGE_KEY = "gaia-sidebar-open";

const getInitialSidebarState = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored !== null ? JSON.parse(stored) : true;
};

export const sidebarOpenAtom = atom<boolean>(getInitialSidebarState());

export const sidebarToggleAtom = atom(
  (get) => get(sidebarOpenAtom),
  (get, set) => {
    const next = !get(sidebarOpenAtom);
    set(sidebarOpenAtom, next);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
  },
);
