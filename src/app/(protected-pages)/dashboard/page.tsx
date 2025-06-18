"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { useAuthSession, useSignOut } from "@/lib/utils/auth-utils";

export default function DashboardPage() {
    const { session } = useAuthSession();
    const { employee } = useAuthStore();
    const signOut = useSignOut();

   return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Good day,{" "}
                    {employee.first_name}{" "}{employee.last_name}
                </h1>
                <div className="space-x-4">
                    <Button onClick={signOut} variant="outline">
                        Sign out
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2:lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Email: {session?.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Sign In:{" "}
                            {new Date(
                                session?.user.last_sign_in_at || ""
                            ).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
   );
}