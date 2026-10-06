import { createClient } from "@/lib/supabase-server";
import AppShell from "@/components/AppShell";

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return <>{children}</>;
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
