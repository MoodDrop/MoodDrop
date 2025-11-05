import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type DropRow = {
  id: string;
  vibe_id: string | null;
  mood: string | null;
  text: string;
  created_at: string;
};

export function useDropsFeed() {
  const [drops, setDrops] = useState<DropRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Drops")                      // <-- match your table name (capital D)
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDrops(data as DropRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return { drops, loading, refetch: load, setDrops };
}
