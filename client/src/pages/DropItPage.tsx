import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, PenLine, Mic, Square, Play, Trash2 } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";
import { getAffirmation } from "@/lib/affirmations";
import dropletIcon from "../assets/droplet.png";

type TabType = "write" | "voice";
type RecordingState = "idle" | "recording" | "stopped";

const STORAGE_SELECTED_MOOD_KEY = "mooddrop_selected_mood";

function resolveMoodKey(raw: string | null): MoodKey | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return null;

  const keys = Object.keys(moods) as MoodKey[];
  const direct = keys.find((k) => k.toLowerCase() === cleaned);
  if (direct) return direct;

  const normalized = cleaned.replace(/[-_\s]/g, "");
  const normalizedMatch = keys.find(
    (k) => k.toLowerCase().replace(/[-_\s]/g, "") === normalized
  );
  return normalizedMatch ?? null;
}

export default function DropItPage() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("write");
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);

  const [draftText, setDraftText] = useState("");
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState("");

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Prefer URL mood first
    const queryString = location.includes("?")
      ? location.slice(location.indexOf("?"))
      : window.location.search;

    const params = new URLSearchParams(queryString);
    const moodParam = params.get("mood");
    const moodFromUrl = resolveMoodKey(moodParam);

    if (moodFromUrl) {
      localStorage.setItem(STORAGE_SELECTED_MOOD_KEY, moodFromUrl);
      setSelectedMood(moodFromUrl);
      return;
    }

    // Then fallback to localStorage
    const storedMood = localStorage.getItem(STORAGE_SELECTED_MOOD_KEY);
    const moodFromStorage = resolveMoodKey(storedMood);

    if (moodFromStorage) {
      setSelectedMood(moodFromStorage);
      return;
    }

    setLocation("/");
  }, [location, setLocation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const mood = selectedMood ? moods[selectedMood] : null;

  const handleAffirmation = () => {
    const quote = getAffirmation();
    setAffirmation(quote);
    setShowAffirmation(true);
    timerRef.current = setTimeout(() => setShowAffirmation(false), 5000);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;

    try {
      const STORAGE_KEY = "mooddrop_messages";
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newDrop = {
        id: Date.now(),
        content: draftText.trim(),
        emotion: selectedMood || "Unknown",
        moodColor: mood?.color,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newDrop, ...existing]));
      setDraftText("");
      handleAffirmation();

      localStorage.removeItem(STORAGE_SELECTED_MOOD_KEY);

      setTimeout(() => {
        setLocation("/my-drops");
      }, 2000);
    } catch (error) {
      console.error("Error saving drop:", error);
      alert("Failed to save your drop. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("stopped");
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (!audioBlob) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(URL.createObjectURL(audioBlob));
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  const deleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingState("idle");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handleSubmitVoice = async () => {
    if (!audioBlob) return;

    try {
      const STORAGE_KEY = "mooddrop_messages";
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64Audio = reader.result as string;
          const newDrop = {
            id: Date.now(),
            content: "(Voice note)",
            emotion: selectedMood || "Unknown",
            moodColor: mood?.color,
            timestamp: new Date().toISOString(),
            audio: {
              blobUrl: base64Audio,
              durationMs: recordingTime * 1000,
            },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify([newDrop, ...existing]));
          localStorage.removeItem(STORAGE_SELECTED_MOOD_KEY);
          setLocation("/my-drops");
        } catch (error) {
          console.error("Error saving voice drop:", error);
          alert("Failed to save your voice note. Please try again.");
        }
      };
      reader.onerror = () => alert("Failed to process audio. Please try again.");
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing voice drop:", error);
      alert("Failed to save your voice note. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!selectedMood || !mood) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <button className="w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors">
            <ArrowLeft className="text-blush-600" size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-warm-gray-700">Drop Your Thoughts</h1>
          <p className="text-sm text-warm-gray-600">Choose how you'd like to express yourself</p>
        </div>
      </div>

      <div className="rounded-2xl border border-blush-100 bg-white/80 p-4 mb-6 flex items-center gap-3">
        <span className="h-8 w-8 rounded-full ring-1 ring-black/5" style={{ backgroundColor: mood.color }} />
        <div>
          <div className="text-warm-gray-900 font-medium">{selectedMood}</div>
          <div className="text-sm text-warm-gray-600">{mood.meaning}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("write")}
          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
            activeTab === "write"
              ? "bg-blush-300 text-white shadow-md"
              : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
          }`}
        >
          <PenLine className="inline-block mr-2" size={18} />
          Write
        </button>

        <button
          onClick={() => setActiveTab("voice")}
          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
            activeTab === "voice"
              ? "bg-blush-300 text-white shadow-md"
              : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
          }`}
        >
          <Mic className="inline-block mr-2" size={18} />
          Voice
        </button>
      </div>

      {activeTab === "write" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <form onSubmit={handleSubmitText}>
            <textarea
              ref={textareaRef}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Let your thoughts flow..."
              className="w-full min-h-[200px] p-4 rounded-2xl border border-blush-100 bg-white focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none text-warm-gray-700 placeholder-warm-gray-400"
            />
            <button
              type="submit"
              disabled={!draftText.trim()}
              className="mt-4 w-full py-3 px-6 bg-blush-300 hover:bg-blush-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <img src={dropletIcon} alt="" className="w-5 h-5" />
              <span>Drop It</span>
            </button>
          </form>

          {showAffirmation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blush-50 to-cream-50 rounded-2xl border border-blush-100">
              <p className="text-warm-gray-700 italic text-center">{affirmation}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "voice" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-blush-100 bg-white/80 p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-warm-gray-700 mb-2">{formatTime(recordingTime)}</div>
              <p className="text-sm text-warm-gray-500">
                {recordingState === "idle" && "Press Record to start"}
                {recordingState === "recording" && "Recording... (max 60s)"}
                {recordingState === "stopped" && "Recording complete"}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {recordingState === "idle" && (
                <button onClick={startRecording} className="px-6 py-3 bg-blush-300 hover:bg-blush-400 text-white rounded-xl font-medium shadow-md transition-all flex items-center gap-2">
                  <Mic size={18} />
                  <span>Record</span>
                </button>
              )}

              {recordingState === "recording" && (
                <button onClick={stopRecording} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-md transition-all flex items-center gap-2">
                  <Square size={18} />
                  <span>Stop</span>
                </button>
              )}

              {recordingState === "stopped" && audioBlob && (
                <>
                  <button onClick={playAudio} disabled={isPlaying} className="px-6 py-3 bg-cream-100 hover:bg-cream-200 disabled:bg-gray-200 text-warm-gray-700 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2">
                    <Play size={18} />
                    <span>{isPlaying ? "Playing..." : "Play"}</span>
                  </button>
                  <button onClick={deleteAudio} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2">
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            {recordingState === "stopped" && audioBlob && (
              <button onClick={handleSubmitVoice} className="mt-6 w-full py-3 px-6 bg-blush-300 hover:bg-blush-400 text-white rounded-2xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <img src={dropletIcon} alt="" className="w-5 h-5" />
                <span>Drop It</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
