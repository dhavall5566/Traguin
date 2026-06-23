import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata = {
  title: "Account",
};

export default function AdminAccountPage() {
  return (
    <div className="admin-account-page">
      <div className="mb-5">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Account</p>
        <h1 className="font-display text-2xl font-semibold text-foreground">Change password</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Update your CMS admin password. You will stay signed in after a successful change.
        </p>
      </div>
      <div className="admin-account-card">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
