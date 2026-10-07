"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  mode?: "sign-in" | "sign-up";
};

export function AuthForm({ mode = "sign-in" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (username.length < 3 || username.length > 20) {
          throw new Error("Username must be 3-20 characters");
        }
        if (!/^[a-z0-9_]+$/.test(username)) {
          throw new Error(
            "Username can only contain lowercase letters, numbers, and underscores"
          );
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass p-6 md:p-7 w-full max-w-sm space-y-5"
    >
      <div className="text-label mb-1">
        {isSignUp ? "Create account" : "Sign in"}
      </div>

      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        variant="default"
        leftIcon={<Mail className="w-3.5 h-3.5" />}
      />

      {isSignUp && (
        <Input
          type="text"
          label="Username"
          placeholder="yourhandle"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          autoComplete="username"
          variant="default"
          leftIcon={<User className="w-3.5 h-3.5" />}
          helper="3-20 characters, lowercase, numbers, underscores"
        />
      )}

      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isSignUp ? "new-password" : "current-password"}
        variant="default"
        leftIcon={<Lock className="w-3.5 h-3.5" />}
      />

      {error && (
        <div className="text-xs text-red-400 break-words bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} fullWidth size="lg">
        {loading
          ? isSignUp
            ? "Creating account..."
            : "Signing in..."
          : isSignUp
          ? "Create account"
          : "Sign in"}
      </Button>

      <div className="text-xs text-warm-dim text-center pt-1">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#00ffff] hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account?{" "}
            <Link
              href="/sign-up"
              className="text-[#00ffff] hover:underline"
            >
              Create one
            </Link>
          </>
        )}
      </div>
    </form>
  );
}

export default AuthForm;
