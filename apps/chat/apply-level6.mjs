// apply-level6.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function write(relPath, content) {
  const full = path.join(__dirname, relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  wrote: " + relPath);
}

console.log("Applying Level 6 files...\n");

write("middleware.js", `import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PROTECTED = ["/feed", "/chats", "/profile", "/settings"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => path.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\\\.svg).*)"],
};
`);

write("lib/auth.js", `import { supabase } from "./supabase";

export async function signUp({ email, password, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return { data, error };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}
`);

write("components/AuthProvider.jsx", `"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
`);

write("components/AuthForm.jsx", `"use client";

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
`);

write("app/layout.jsx", `import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "SPV Chat",
  description: "Social feed and direct messaging for the SPV ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
`);

write("app/page.jsx", `import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/feed");
  redirect("/sign-in");
}
`);

write("app/(auth)/layout.jsx", `export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-label mb-2">SPV Chat</div>
          <h1 className="display-lg gradient-text">Welcome</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
`);

write("app/(auth)/sign-in/page.jsx", `import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-warm-dim text-sm">Loading...</div>}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
`);

write("app/(auth)/sign-up/page.jsx", `import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-warm-dim text-sm">Loading...</div>}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
`);

write("app/(app)/feed/page.jsx", `import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "@/components/SignOutButton";

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-label mb-2">SPV Chat</div>
            <h1 className="display-lg gradient-text">Feed</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="glass p-6 mb-6">
          <div className="text-label mb-3">Signed in as</div>
          <div className="text-mono text-sm text-warm break-all">{user.email}</div>
          <div className="text-mono text-xs text-warm-dim mt-2 break-all">ID: {user.id}</div>
        </div>

        <div className="glass p-6">
          <div className="text-warm text-sm">Level 6 complete. You are authenticated.</div>
          <div className="text-warm-dim text-xs mt-2">
            Level 7 adds profile setup. Level 9 adds the real feed.
          </div>
        </div>
      </div>
    </div>
  );
}
`);

write("components/SignOutButton.jsx", `"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <button onClick={handleSignOut} className="glass-button text-sm">
      Sign out
    </button>
  );
}
`);

console.log("\nDone. 12 files written.");
console.log("\nNext steps:");
console.log("  1. Confirm .env has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
console.log("  2. In Supabase: Authentication -> Providers -> Email -> turn OFF 'Confirm email' (for dev)");
console.log("  3. In Supabase: Authentication -> URL Configuration -> Site URL = http://localhost:3001");
console.log("  4. taskkill //F //IM node.exe");
console.log("  5. rm -rf .next");
console.log("  6. npm run dev");
console.log("  7. Visit http://localhost:3001");
console.log("  8. Delete this script: rm apply-level6.mjs");
