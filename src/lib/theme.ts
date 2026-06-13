export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "traguin-theme";
export const THEME_COOKIE_NAME = "traguin-theme";

export function isTheme(value: string | undefined | null): value is Theme {
  return value === "light" || value === "dark";
}

export function getLocalDateIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

<<<<<<< HEAD
/** Blocking script in <head> — runs before paint; syncs html attribute + cookie + localStorage. */
=======
/** Blocking script in <head>, runs before paint; syncs html attribute + cookie + localStorage. */
>>>>>>> dhaval
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);document.cookie="${THEME_COOKIE_NAME}="+t+";path=/;max-age=31536000;SameSite=Lax";localStorage.setItem("${THEME_STORAGE_KEY}",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function readThemeFromDocument(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (isTheme(attr)) return attr;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "dark";
}

export function persistTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=31536000;SameSite=Lax`;
}
