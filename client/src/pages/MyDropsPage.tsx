import * as React from "react";
import { Link } from "wouter";
import { ArrowLeft, Trash2, Undo2, Search, Download, Upload, X, Mic, Square, Play, Pause } from "lucide-react";
import { getMoodColor, MOODS_ARRAY } from "@/lib/moods";
import { useToast } from "@/hooks/use-toast";

type SavedDrop = {
  id: number;
  content: string;
  emotion: string;
  moodColor?: string;
  timestamp: string;
  audio?: {
    blobUrl: string;
    durationMs?: number;
  };
};

const STORAGE_KEY = "mooddrop_messages";

function loadDrops(): SavedDrop[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored);
    const drops = items.map((x: any, index: number) => ({
      id: Number(x.id ?? Date.now() + index),
      content: String(x.content ?? x.text ?? ""),
      emotion: String(x.emotion ?? x.mood?.label ?? x.mood ?? "Unknown"),
      moodColor: x.moodColor ?? x.color ?? x.mood?.color,
      timestamp: String(x.timestamp ?? x.date ?? new Date().toISOString()),
      audio: x.audio,
    }));

    // Ensure unique IDs
    const seen = new Set<number>();
    const unique = drops.map((drop: SavedDrop) => {
      let id = drop.id;
      while (seen.has(id)) {
        id = Date.now() + Math.floor(Math.random() * 100000);
      }
      seen.add(id);
      return { ...drop, id };
    });

    return unique.sort((a: SavedDrop, b: SavedDrop) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error loading drops:", error);
    return [];
  }
}

function saveDrops(drops: SavedDrop[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
  } catch (error: any) {
    if (error?.name === "QuotaExceededError") {
      throw new Error("Storage is full. Please export & clear some drops or delete older voice notes.");
    }
    throw error;
  }
}

function formatDate(timestamp: string) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
    });
  } catch {
    return "Recently";
  }
}

function VoiceRecorder({ 
  onSave, 
  onCancel 
}: { 
  onSave: (blobUrl: string, durationMs: number) => void;
  onCancel: () => void;
}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onSave(url, seconds * 1000);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } catch (error) {
      alert("Recording isn't supported on this device/browser.");
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleCancel = () => {
    if (isRecording) stopRecording();
    if (timerRef.current) clearInterval(timerRef.current);
    onCancel();
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-warm-gray-900">Record Voice Note</h3>
          <button onClick={handleCancel} className="text-warm-gray-400 hover:text-warm-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{isRecording ? "🎙️" : "🎤"}</div>
          <div className="text-2xl font-mono text-warm-gray-700 mb-6">
            {formatTime(seconds)}
          </div>
          
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blush-300 text-white rounded-xl hover:bg-blush-400 transition-colors"
              data-testid="button-start-recording"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
              data-testid="button-stop-recording"
            >
              <Square size={16} fill="white" />
              Stop & Save
            </button>
          )}
        </div>
        
        <p className="text-xs text-warm-gray-500 text-center">
          Voice notes are stored privately on this device
        </p>
      </div>
    </div>
  );
}

function AudioPlayer({ blobUrl, durationMs }: { blobUrl: string; durationMs?: number }) {
  return (
    <div className="mt-2 p-2 bg-warm-gray-50 rounded-lg">
      <audio controls className="w-full h-8" src={blobUrl} />
    </div>
  );
}

export default function MyDropsPage() {
  const [allDrops, setAllDrops] = React.useState<SavedDrop[]>([]);
  const [filteredDrops, setFilteredDrops] = React.useState<SavedDrop[]>([]);
  const [displayedCount, setDisplayedCount] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [emotionFilter, setEmotionFilter] = React.useState("All");
  const [timeFilter, setTimeFilter] = React.useState("All time");
  const [deletedDrop, setDeletedDrop] = React.useState<{ drop: SavedDrop; index: number } | null>(null);
  const [recordingFor, setRecordingFor] = React.useState<number | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setAllDrops(loadDrops());
  }, []);

  React.useEffect(() => {
    let filtered = [...allDrops];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.content.toLowerCase().includes(query) || 
        d.emotion.toLowerCase().includes(query)
      );
    }

    if (emotionFilter !== "All") {
      filtered = filtered.filter(d => d.emotion === emotionFilter);
    }

    if (timeFilter !== "All time") {
      const now = Date.now();
      const cutoff = {
        "Past week": 7 * 24 * 60 * 60 * 1000,
        "Past month": 30 * 24 * 60 * 60 * 1000,
        "Past 3 months": 90 * 24 * 60 * 60 * 1000,
      }[timeFilter] || 0;

      filtered = filtered.filter(d => 
        now - new Date(d.timestamp).getTime() < cutoff
      );
    }

    setFilteredDrops(filtered);
    setDisplayedCount(10);
  }, [allDrops, searchQuery, emotionFilter, timeFilter]);

  const handleDelete = (drop: SavedDrop, originalIndex: number) => {
    const newDrops = allDrops.filter(d => d.id !== drop.id);
    setAllDrops(newDrops);
    setDeletedDrop({ drop, index: originalIndex });

    try {
      saveDrops(newDrops);
      toast({
        title: "Drop deleted",
        description: "You can undo this action.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    setTimeout(() => setDeletedDrop(null), 5000);
  };

  const handleUndo = () => {
    if (!deletedDrop) return;
    
    const restored = [...allDrops, deletedDrop.drop].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setAllDrops(restored);
    setDeletedDrop(null);

    try {
      saveDrops(restored);
      toast({ title: "Drop restored" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ["id", "timestamp", "emotion", "content", "audio_blobUrl", "durationMs"];
    const rows = allDrops.map(d => [
      d.id,
      d.timestamp,
      d.emotion,
      `"${d.content.replace(/"/g, '""')}"`,
      d.audio?.blobUrl || "",
      d.audio?.durationMs || "",
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mooddrop-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Exported successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n").slice(1);
        const imported: SavedDrop[] = [];

        lines.forEach(line => {
          if (!line.trim()) return;
          const [id, timestamp, emotion, content, audioBlobUrl, durationMs] = line.split(",");
          
          imported.push({
            id: Number(id),
            timestamp,
            emotion,
            content: content.replace(/^"|"$/g, "").replace(/""/g, '"'),
            audio: audioBlobUrl ? { blobUrl: audioBlobUrl, durationMs: Number(durationMs) || undefined } : undefined,
          });
        });

        const merged = [...allDrops];
        imported.forEach(imp => {
          const existing = merged.findIndex(d => d.id === imp.id);
          if (existing >= 0) {
            if (new Date(imp.timestamp) > new Date(merged[existing].timestamp)) {
              merged[existing] = imp;
            }
          } else {
            merged.push(imp);
          }
        });

        merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAllDrops(merged);
        saveDrops(merged);

        toast({
          title: "Imported successfully",
          description: `${imported.length} drops imported`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid CSV format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearAll = () => {
    if (!confirm("Are you sure you want to delete all drops? This cannot be undone.")) return;

    setAllDrops([]);
    try {
      saveDrops([]);
      toast({ title: "All drops cleared" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVoiceNoteSaved = (dropId: number, blobUrl: string, durationMs: number) => {
    const updated = allDrops.map(d => 
      d.id === dropId 
        ? { ...d, audio: { blobUrl, durationMs } }
        : d
    );
    setAllDrops(updated);
    setRecordingFor(null);

    try {
      saveDrops(updated);
      toast({ title: "Voice note saved" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const uniqueEmotions = Array.from(new Set(allDrops.map(d => d.emotion)));
  const mostFrequentEmotion = uniqueEmotions.length > 0
    ? uniqueEmotions.reduce((a, b) => 
        allDrops.filter(d => d.emotion === a).length > allDrops.filter(d => d.emotion === b).length ? a : b
      )
    : "None";
  const voiceNotesCount = allDrops.filter(d => d.audio).length;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href="/">
          <button
            className="w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors"
            data-testid="button-back-home"
          >
            <ArrowLeft className="text-blush-600" size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-warm-gray-900">View My Drops</h1>
          <p className="text-sm text-warm-gray-600">
            Your private reflections, stored only on this device.
          </p>
        </div>
      </div>

      {/* Summary Strip */}
      {allDrops.length > 0 && (
        <div className="mb-6 p-4 bg-blush-50 rounded-xl border border-blush-100">
          <div className="flex flex-wrap gap-4 text-sm text-warm-gray-700">
            <span>Total drops: <strong>{allDrops.length}</strong></span>
            <span>•</span>
            <span>Most frequent mood: <strong>{mostFrequentEmotion}</strong></span>
            {voiceNotesCount > 0 && (
              <>
                <span>•</span>
                <span>Voice notes: <strong>{voiceNotesCount}</strong></span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tools Row */}
      {allDrops.length > 0 && (
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search drops…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-warm-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blush-300"
              data-testid="input-search"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap gap-2">
            <select
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              className="px-3 py-2 border border-warm-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
              data-testid="select-emotion-filter"
            >
              <option value="All">All moods</option>
              {uniqueEmotions.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-warm-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
              data-testid="select-time-filter"
            >
              <option value="All time">All time</option>
              <option value="Past week">Past week</option>
              <option value="Past month">Past month</option>
              <option value="Past 3 months">Past 3 months</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-warm-gray-100 text-warm-gray-700 rounded-lg hover:bg-warm-gray-200 transition-colors text-sm flex items-center gap-2"
              data-testid="button-export-csv"
            >
              <Download size={16} />
              Export CSV
            </button>

            <label className="px-3 py-2 bg-warm-gray-100 text-warm-gray-700 rounded-lg hover:bg-warm-gray-200 transition-colors text-sm flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                data-testid="input-import-csv"
              />
            </label>

            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              data-testid="button-clear-all"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Undo Banner */}
      {deletedDrop && (
        <div className="mb-6 p-4 bg-warm-gray-100 border border-warm-gray-200 rounded-xl flex items-center justify-between">
          <p className="text-warm-gray-700 text-sm">Drop deleted</p>
          <button
            onClick={handleUndo}
            className="px-4 py-2 bg-blush-300 text-white rounded-lg hover:bg-blush-400 transition-colors text-sm flex items-center gap-2"
            data-testid="button-undo"
          >
            <Undo2 size={16} />
            Undo
          </button>
        </div>
      )}

      {/* Empty State */}
      {allDrops.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-blush-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-warm-gray-600 text-lg mb-2">
            No drops yet. After you press Drop It, they'll appear here.
          </p>
        </div>
      ) : filteredDrops.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="text-warm-gray-600">No results match your search/filter.</p>
        </div>
      ) : (
        <>
          {/* Drops List */}
          <div className="space-y-4 mb-6">
            {filteredDrops.slice(0, displayedCount).map((drop) => (
              <div
                key={drop.id}
                className="bg-white rounded-xl border border-warm-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                data-testid={`drop-${drop.id}`}
              >
                <div className="flex items-start gap-3">
                  {/* Mood Dot */}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: getMoodColor(drop.emotion, drop.moodColor) }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-warm-gray-500 mb-1">
                      <span>{formatDate(drop.timestamp)}</span>
                      <span>•</span>
                      <span className="font-medium text-warm-gray-700">{drop.emotion}</span>
                    </div>
                    
                    <p className="text-warm-gray-900 whitespace-pre-wrap leading-relaxed">
                      {drop.content}
                    </p>

                    {/* Audio Player */}
                    {drop.audio && (
                      <AudioPlayer blobUrl={drop.audio.blobUrl} durationMs={drop.audio.durationMs} />
                    )}

                    {/* Add Voice Note Button */}
                    {!drop.audio && (
                      <button
                        onClick={() => setRecordingFor(drop.id)}
                        className="mt-2 px-3 py-1.5 bg-blush-50 text-blush-600 rounded-lg hover:bg-blush-100 transition-colors text-sm flex items-center gap-2"
                        data-testid={`button-add-voice-${drop.id}`}
                      >
                        <Mic size={14} />
                        Add Voice Note
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(drop, allDrops.indexOf(drop))}
                    className="p-2 text-warm-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    data-testid={`button-delete-${drop.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {displayedCount < filteredDrops.length && (
            <div className="text-center">
              <button
                onClick={() => setDisplayedCount(c => c + 10)}
                className="px-6 py-3 bg-blush-100 text-blush-600 rounded-xl hover:bg-blush-200 transition-colors"
                data-testid="button-load-more"
              >
                Load more ({filteredDrops.length - displayedCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Privacy Footnote */}
      <div className="mt-8 p-4 bg-warm-gray-50 rounded-xl text-sm text-warm-gray-600 text-center">
        Private to this device. Clearing browser storage will remove your drops. Export a CSV to back up.
      </div>

      {/* Voice Recorder Modal */}
      {recordingFor !== null && (
        <VoiceRecorder
          onSave={(url, duration) => handleVoiceNoteSaved(recordingFor, url, duration)}
          onCancel={() => setRecordingFor(null)}
        />
      )}
    </div>
  );
}
