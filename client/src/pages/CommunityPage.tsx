const loadDrops = async () => {
  console.log("[MoodDrop] loadDrops() called — fetching from Supabase...");
  try {
    const { data, error, status } = await supabase
      .from("Drops") // table name correct
      .select(
        "id, text, mood, created_at, vibe_id, reply_to, visible, reactions",
      )
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[MoodDrop] ❌ Supabase error:", error, "Status:", status);
      toast({
        title: "Couldn't load drops",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    if (!data) {
      console.warn("[MoodDrop] ⚠ No data returned from Supabase");
      setDrops([]);
      return;
    }

    console.log(`[MoodDrop] ✅ Loaded ${data.length} drops from Supabase`);

    // Transform data
    const allDrops: Drop[] = data.map((row: any) => ({
      id: row.id,
      vibeId: row.vibe_id,
      text: row.text,
      mood: row.mood,
      replyTo: row.reply_to,
      reactions: row.reactions || 0,
      createdAt: new Date(row.created_at).getTime(),
      replies: [],
    }));

    // Nest replies
    const topLevelDrops = allDrops.filter((d) => !d.replyTo);
    const replyDrops = allDrops.filter((d) => d.replyTo);
    topLevelDrops.forEach((drop) => {
      drop.replies = replyDrops.filter((r) => r.replyTo === drop.id);
    });

    setDrops(topLevelDrops);
  } catch (err) {
    console.error("[MoodDrop] ❌ loadDrops() failed:", err);
    toast({
      title: "Unexpected error",
      description: "Please check your Supabase connection.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
