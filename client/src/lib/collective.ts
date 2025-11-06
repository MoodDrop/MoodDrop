// client/src/lib/collective.ts
import { supabase } from "./supabaseClient";

export type CollectivePost = {
  id: string;
  content: string | null;
  mood: string | null;
  color: string | null;
  created_at: string;
  feel_count: number;
};

export type CollectiveComment = {
  id: string;
  post_id: string;
  body: string;
  created_at: string;
};

// Load posts (feed)
export async function listCollectivePosts(
  limit = 50,
): Promise<CollectivePost[]> {
  const { data, error } = await supabase
    .from("collective_posts")
    .select("id, content, mood, color, created_at, feel_count")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// “I feel this” reaction
export async function reactFeel(postId: string, anonFingerprint?: string) {
  const payload: Record<string, any> = { post_id: postId, kind: "feel" };
  if (anonFingerprint) payload.anon_fingerprint = anonFingerprint;
  const { error } = await supabase.from("collective_reactions").insert(payload);
  if (error) throw error;
}

// List comments for a post
export async function listComments(
  postId: string,
): Promise<CollectiveComment[]> {
  const { data, error } = await supabase
    .from("collective_comments")
    .select("id, post_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Add a comment (“Drop a Note”)
export async function addComment(
  postId: string,
  body: string,
  anonFingerprint?: string,
) {
  const payload: Record<string, any> = { post_id: postId, body };
  if (anonFingerprint) payload.anon_fingerprint = anonFingerprint;
  const { error } = await supabase.from("collective_comments").insert(payload);
  if (error) throw error;
}
