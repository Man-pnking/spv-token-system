import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { Spinner } from "@/components/ui/Spinner";

export default function SignInPage() {
  return (
    <Suspense fallback={<Spinner label="Loading" />}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
