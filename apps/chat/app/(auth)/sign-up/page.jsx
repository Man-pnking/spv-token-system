import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-warm-dim text-sm">Loading...</div>}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
