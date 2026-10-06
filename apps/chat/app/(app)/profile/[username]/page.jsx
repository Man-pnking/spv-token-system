import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProfileDesktopHeader from "@/components/ProfileDesktopHeader";
import ProfileMobileCard from "@/components/ProfileMobileCard";
import ProfileTabs from "@/components/ProfileTabs";
import Feed from "@/components/Feed";
import { getProfileStats } from "@/lib/profile-stats";
import { getLikeCountsForPosts } from "@/lib/likes";
import { getReplyCountsForPosts } from "@/lib/replies";

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
  const stats = await getProfileStats(profile.id);

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

  const postIds = (posts || []).map((p) => p.id);
  const likeCounts = await getLikeCountsForPosts(postIds);
  const replyCounts = await getReplyCountsForPosts(postIds);

  return (
    <div>
      {/* Desktop — two column layout */}
      <ProfileDesktopHeader
        profile={profile}
        isMe={isMe}
        stats={stats}
        currentUserId={user.id}
        posts={posts || []}
        likeCounts={likeCounts}
        replyCounts={replyCounts}
      />

      {/* Mobile — card layout + feed below */}
      <div className="md:hidden">
        <ProfileMobileCard profile={profile} isMe={isMe} counts={stats} />
        <ProfileTabs />
        <Feed
          posts={posts || []}
          currentUserId={user.id}
          likeCounts={likeCounts}
          replyCounts={replyCounts}
          emptyMessage={isMe ? "You haven't posted yet." : "No posts yet."}
        />
      </div>
    </div>
  );
}
