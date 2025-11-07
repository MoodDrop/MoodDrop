// client/src/lib/collective.ts
import { supabase } from "./supabaseClient";

export type CollectivePost = {
  id: string;
  content: string | null;
  mood: string | null;
  color: string | null;
  created_at: string;
  feel_count: number; // defaults to 0 in DB
};

/**
 * Load posts for the Collective Drop feed.
 * Only returns visible posts, newest first.
 */
export async function listCollectivePosts(): Promise<CollectivePost[]> {
  const { data, error } = await supabase
    .from("collective_posts")
    .select("id, content, mood, color, created_at, feel_count")
    .eq("visible", true) // if you added the 'visible' column; remove this line if not
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CollectivePost[];
}

/**
 * Add a 'feel' reaction to a post.
 * Triggers the feel_count increment via the DB trigger.
 */
export async function reactFeel(postId: string, anonFingerprint?: string) {
  const { error } = await supabase
    .from("collective_reactions")
    .insert([
      {
        post_id: postId,
        kind: "feel",
        anon_fingerprint: anonFingerprint ?? null,
      },
    ]);

  if (error) throw error;
}
