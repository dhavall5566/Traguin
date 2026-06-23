import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Traguin Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
