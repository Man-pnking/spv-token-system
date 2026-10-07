import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ExploreGrid from "@/components/explore/ExploreGrid";

export default async function ExplorePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: users } = await supabase
    .from("users")
    .select("id, username, avatar_url, bio, created_at")
    .neq("id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-4 pt-6 pb-2">
        <div className="text-label mb-1">Explore</div>
        <h1 className="display-lg gradient-text">People on SPV Chat</h1>
      </div>
      <ExploreGrid users={users || []} />
    </div>
  );
}
