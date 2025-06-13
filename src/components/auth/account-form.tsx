"use client";

import { createClientSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountForm({ user }: { user: User | null }) {
    const supabase = createClientSupabaseClient();
    const [loading, setLoading] = useState(true);
    const [fullName, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setFullname(data.full_name);
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            toast.error('Error loading user data');
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    async function updateProfile({
        username,
        avatar_url
    }: {
        username: string | null
        fullName: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true);

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullName,
                username,
                avatar_url,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;
            toast.success('Profile updated!');
        } catch (error) {
            toast.error('Error updating the data!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email} disabled />
            </div>
            <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                id="fullName"
                type="text"
                value={fullName || ''}
                onChange={(e) => setFullname(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="username">Username</label>
                <input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <button
                className="button primary block"
                onClick={() => updateProfile({ fullName, username, avatar_url })}
                disabled={loading}
                >
                {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>
            <div>
                <form action="/auth/signout" method="post">
                <button className="button block" type="submit">
                    Sign out
                </button>
                </form>
            </div>
        </div>
    );
}