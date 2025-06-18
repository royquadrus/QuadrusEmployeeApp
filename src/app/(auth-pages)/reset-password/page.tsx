"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Supabase automatically stores the access_token and treats user as authenticated
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: "", // not needed for this use case
      }).then(() => {
        setTokenLoaded(true);
      }).catch((err) => {
        console.error("Failed to set session", err);
        setError("Invalid or expired reset link.");
      });
    } else {
      setError("Missing access token in URL.");
    }
  }, [supabase]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/login?reset=success");
    }
  };

  if (!tokenLoaded) {
    return <p className="text-center py-8">Validating token...</p>;
  }

  return (
    <div className="max-w-sm mx-auto mt-16 space-y-4">
      <h1 className="text-xl font-bold text-center">Set Your Password</h1>

      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Set Password"}
      </Button>
    </div>
  );
}
