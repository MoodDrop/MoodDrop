import { supabase } from "@/lib/supabaseClient";

export type GalleryMood =
  | "CrashOut"
  | "Overwhelmed"
  | "Healing"
  | "Hopeful"
  | "Reflective"
  | "Lonely"
  | "Grateful"
  | "Calm"
  | "Tense"
  | "Grounded"
  | "Joy";

export type SharedCanvas = {
  id: string;
  text: string;
  mood: GalleryMood | string | null;
  created_at: string;
  is_shared: boolean;
  witness_count: number;
};

export async function getSharedDrops(selectedMood?: string) {
  let query = supabase
    .from("drops")
    .select("id, text, mood, created_at, is_shared, witness_count")
    .eq("is_shared", true)
    .order("created_at", { ascending: false })
    .limit(30);

  if (selectedMood && selectedMood !== "All") {
    query = query.eq("mood", selectedMood);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as SharedCanvas[];
}

export async function incrementWitnessCount(dropId: string, currentCount: number) {
  const { data, error } = await supabase
    .from("drops")
    .update({ witness_count: currentCount + 1 })
    .eq("id", dropId)
    .select("id, witness_count")
    .single();

  if (error) {
    throw error;
  }

  return data as { id: string; witness_count: number };
}

export function getPreviewText(text: string, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}