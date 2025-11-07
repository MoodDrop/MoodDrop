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

/** Load the feed for the Collective Drop */
export async function listCollectivePosts(): Promise<CollectivePost[]> {
  const { data, error } = await supabase
    .from("collective_posts")
    .select("id, content, mood, color, created_at, feel_count")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CollectivePost[];
}

/** Add one “feel” reaction for a post */
export async function reactFeel(postId: string): Promise<void> {
  const { error } = await supabase
    .from("collective_reactions")
    .insert([{ post_id: postId, kind: "feel" }]);

  if (error) throw error;
}
