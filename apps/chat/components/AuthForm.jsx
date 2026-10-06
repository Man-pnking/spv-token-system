"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function AuthForm({ mode = "sign-in" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (username.length < 3 || username.length > 20) {
          throw new Error("Username must be 3-20 characters");
        }
        if (!/^[a-z0-9_]+$/.test(username)) {
          throw new Error("Username can only contain lowercase letters, numbers, and underscores");
        }
        const { error } = await signUp({ email, password, username });
        if (error) throw error;
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
      }

      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 w-full max-w-sm space-y-4">
      <div className="text-label mb-2">
        {isSignUp ? "Create account" : "Sign in"}
      </div>

      <div>
        <label className="text-xs text-warm-dim block mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full bg-transparent border-b border-[#00ffff]/20 px-0 py-2 text-sm outline-none focus:border-[#00ffff]/60 transition-colors"
        />
      </div>

      {isSignUp && (
        <div>
          <label className="text-xs text-warm-dim block mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            autoComplete="username"
            className="w-full bg-transparent border-b border-[#00ffff]/20 px-0 py-2 text-sm outline-none focus:border-[#00ffff]/60 transition-colors"
          />
          <div className="text-[10px] text-warm-mute mt-1">
            3-20 characters, lowercase letters, numbers, underscores
          </div>
        </div>
      )}

      <div>
        <label className="text-xs text-warm-dim block mb-1">Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          className="w-full bg-transparent border-b border-[#00ffff]/20 px-0 py-2 text-sm outline-none focus:border-[#00ffff]/60 transition-colors"
        />
      </div>

      {error && <div className="text-xs text-red-400 break-words">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full text-sm font-semibold disabled:opacity-50"
      >
        {loading
          ? isSignUp
            ? "Creating account..."
            : "Signing in..."
          : isSignUp
          ? "Create account"
          : "Sign in"}
      </button>

      <div className="text-xs text-warm-dim text-center pt-2">
        {isSignUp ? (
          <>Already have an account? <Link href="/sign-in" className="text-[#00ffff] hover:underline">Sign in</Link></>
        ) : (
          <>No account? <Link href="/sign-up" className="text-[#00ffff] hover:underline">Create one</Link></>
        )}
      </div>
    </form>
  );
}
