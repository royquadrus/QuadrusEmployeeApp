"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Extract and validate the token on load
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("refresh_token");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    supabase.auth
      .refreshSession({ refresh_token: token })
      .then(({ error }) => {
        if (error) {
          console.error("Token validation failed:", error);
          setError("Reset link is invalid or expired.");
        } else {
          setAccessToken(token);
          setTokenValidated(true);
        }
      });
  }, [supabase]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    if (!tokenValidated) {
      setError("Session not initialized.");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Failed to update password:", error);
      setError("Failed to reset password. Please try again.");
    } else {
      toast.success("Password reset successful. You can now log in.");
      router.push("/login?reset=success");
    }

    setSubmitting(false);
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center space-y-4">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!tokenValidated) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center">
        <p className="text-sm">Validating reset link...</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-24 space-y-4">
      <h1 className="text-xl font-bold text-center">Set a New Password</h1>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={submitting}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Set Password"}
        </Button>
      </div>
    </div>
  );
}
