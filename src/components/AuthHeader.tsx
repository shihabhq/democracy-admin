"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading || !user) return null;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex gap-4">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/questions"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Questions
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
