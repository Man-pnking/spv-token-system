import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfileSetupPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) redirect("/profile/" + profile.username);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-label mb-2">Welcome</div>
          <h1 className="display-lg gradient-text">Set up your profile</h1>
          <p className="text-warm-dim text-sm mt-4">
            Choose a username and add some details. You can change these later.
          </p>
        </div>
        <ProfileForm isSetup={true} />
      </div>
    </div>
  );
}
