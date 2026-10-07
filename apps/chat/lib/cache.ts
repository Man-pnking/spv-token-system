import { cache } from "react";
import { getLikeCountsForPosts } from "./likes";
import { getReplyCountsForPosts } from "./replies";
import { getProfileStats } from "./profile-stats";

/**
 * Per-request memoization of expensive Supabase reads.
 * React.cache dedupes calls within a single request — great for
 * layouts + pages that both need the same data.
 */
export const cachedLikeCounts = cache(getLikeCountsForPosts);
export const cachedReplyCounts = cache(getReplyCountsForPosts);
export const cachedProfileStats = cache(getProfileStats);
