import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { Spinner } from "@/components/ui/Spinner";

export default function SignUpPage() {
  return (
    <Suspense fallback={<Spinner label="Loading" />}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
