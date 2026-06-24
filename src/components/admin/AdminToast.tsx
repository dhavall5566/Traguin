"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminToastType = "success" | "error";

type AdminToastItem = {
  id: string;
  message: string;
  type: AdminToastType;
  exiting?: boolean;
};

type AdminToastContextValue = {
  showToast: (message: string, type?: AdminToastType) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const TOAST_DURATION_MS = 2600;

function AdminToastViewport({ toasts, onDismiss }: {
  toasts: AdminToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="admin-toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "admin-toast",
            toast.type === "success" ? "admin-toast--success" : "admin-toast--error",
            toast.exiting && "admin-toast--exit",
          )}
          role="status"
        >
          <div className="admin-toast__icon-wrap" aria-hidden>
            {toast.type === "success" ? (
              <CheckCircle2 className="admin-toast__icon" />
            ) : (
              <XCircle className="admin-toast__icon" />
            )}
          </div>
          <p className="admin-toast__message">{toast.message}</p>
          <button
            type="button"
            className="admin-toast__close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 320);
  }, []);

  const showToast = useCallback(
    (message: string, type: AdminToastType = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current.slice(-2), { id, message, type }]);

      const existingTimer = timersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = window.setTimeout(() => {
        dismissToast(id);
        timersRef.current.delete(id);
      }, TOAST_DURATION_MS);

      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(
    () => () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      <AdminToastViewport toasts={toasts} onDismiss={dismissToast} />
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return context;
}
