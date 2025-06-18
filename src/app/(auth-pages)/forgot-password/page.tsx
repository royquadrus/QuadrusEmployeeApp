"use client";

import { AuthCard } from "@/components/ui/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const supabase = createClientSupabaseClient();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://employees.quadrusconstruction.com/reset-password",
        });

        if (error) {
            toast.error(error.message || "Failed to send reset link.");
        } else {
            setSubmitted(true);
            toast.success("Check your email for a reset link");
        }

        setSubmitting(false);
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <AuthCard
                title="Forgot Password"
                description="Enter your email to get a reset password link"
            >
                {submitted ? (
                    <p className="text-center text-sm text-muted-foreground">
                        If that email is in our system, a reset link has been sent.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <Input
                            placeholder="your@email.com"
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                        />
                        <Button onClick={handleSubmit} className="w-full" disabled={submitting || !email}>
                            {submitting ? "Sending..." : "Send reset link"}
                        </Button>
                    </div>
                )}
            </AuthCard>
        </div>
    );
}