import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-warm-dim text-sm">Loading...</div>}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
