import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProfileDesktopHeader from "@/components/ProfileDesktopHeader";
import ProfileMobileCard from "@/components/ProfileMobileCard";
import ProfileTabs from "@/components/ProfileTabs";
import Feed from "@/components/Feed";
import { getFollowCounts } from "@/lib/follows";

export default async function ProfilePage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const isMe = user.id === profile.id;
  const counts = await getFollowCounts(profile.id);

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .eq("author_id", profile.id)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <ProfileDesktopHeader profile={profile} isMe={isMe} counts={counts} />
      <ProfileMobileCard profile={profile} isMe={isMe} counts={counts} />

      <div className="mt-2 md:mt-0">
        <ProfileTabs />
        <Feed
          posts={posts || []}
          emptyMessage={isMe ? "You haven't posted yet. Go to the feed to post." : "No posts yet."}
        />
      </div>
    </div>
  );
}
