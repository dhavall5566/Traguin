import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your TRAGUIN client portal.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
