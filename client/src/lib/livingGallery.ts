// client/src/lib/livingGallery.ts
import { supabase } from "@/lib/supabaseClient";

export type GalleryMood =
  | "CrashOut"
  | "Overwhelmed"
  | "Healing"
  | "Hopeful"
  | "Reflective"
  | "Lonely"
  | "Grateful";

export type SharedCanvas = {
  id: string;
  text: string;
  mood: GalleryMood | string | null;
  created_at: string;
  is_shared: boolean;
};

export async function getSharedDrops(selectedMood?: string) {
  let query = supabase
    .from("drops")
    .select("id, text, mood, created_at, is_shared")
    .eq("is_shared", true)
    .order("created_at", { ascending: false });

  if (selectedMood && selectedMood !== "All") {
    query = query.eq("mood", selectedMood);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as SharedCanvas[];
}

export function getPreviewText(text: string, maxLength = 160) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}