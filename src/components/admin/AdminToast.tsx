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
import { CheckCircle2, PlusCircle, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminToastType = "success" | "error";

export type AdminToastAction = "create" | "update" | "delete";

type AdminToastItem = {
  id: string;
  message: string;
  type: AdminToastType;
  action?: AdminToastAction;
  exiting?: boolean;
};

type AdminToastContextValue = {
  showToast: (message: string, type?: AdminToastType, action?: AdminToastAction) => void;
  showCreatedToast: (message: string) => void;
  showUpdatedToast: (message: string) => void;
  showDeletedToast: (message: string) => void;
  showErrorToast: (message: string) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

const TOAST_DURATION_MS = 2800;
const EXIT_MS = 360;

function toastIcon(action: AdminToastAction | undefined, type: AdminToastType) {
  if (type === "error") return XCircle;
  if (action === "create") return PlusCircle;
  if (action === "delete") return Trash2;
  return CheckCircle2;
}

function AdminToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: AdminToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="admin-toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast, index) => {
        const Icon = toastIcon(toast.action, toast.type);
        return (
          <div
            key={toast.id}
            className={cn(
              "admin-toast",
              toast.type === "success" ? "admin-toast--success" : "admin-toast--error",
              toast.action && `admin-toast--${toast.action}`,
              toast.exiting && "admin-toast--exit",
            )}
            style={{ ["--toast-stack-index" as string]: index }}
            role="status"
          >
            <div className="admin-toast__glow" aria-hidden />
            <div className="admin-toast__inner">
              <div className="admin-toast__icon-wrap" aria-hidden>
                <Icon className="admin-toast__icon" />
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
          </div>
        );
      })}
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
    }, EXIT_MS);
  }, []);

  const showToast = useCallback(
    (message: string, type: AdminToastType = "success", action?: AdminToastAction) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current.slice(-2), { id, message, type, action }]);

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

  const showCreatedToast = useCallback(
    (message: string) => showToast(message, "success", "create"),
    [showToast],
  );

  const showUpdatedToast = useCallback(
    (message: string) => showToast(message, "success", "update"),
    [showToast],
  );

  const showDeletedToast = useCallback(
    (message: string) => showToast(message, "success", "delete"),
    [showToast],
  );

  const showErrorToast = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
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

  const value = useMemo(
    () => ({
      showToast,
      showCreatedToast,
      showUpdatedToast,
      showDeletedToast,
      showErrorToast,
    }),
    [showToast, showCreatedToast, showUpdatedToast, showDeletedToast, showErrorToast],
  );

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
