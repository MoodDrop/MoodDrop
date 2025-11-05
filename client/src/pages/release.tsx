import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { getAffirmation } from "@/lib/affirmations";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Release (Share Your Feelings) page
 * - Emoji selector
 * - Text area
 * - Voice note (MediaRecorder) w/ preview + delete
 * - Submits to /api/messages as multipart/form-data:
 *   { emotion, content, audio (optional Blob), audioDurationMs (optional) }
 *
 * Notes:
 * - Recording time limit ~120s (VOICE_MAX_MS)
 * - Shows simple alerts for success/failure; you can replace with toasts.
 */

type SubmitPayload = {
  emotion: string;
  content: string;
  audioBlob?: Blob | null;
  audioDurationMs?: number;
};

const EMOJI_CHOICES = [
  { emoji: "😊", name: "Joy" },
  { emoji: "🙂", name: "Calm" },
  { emoji: "😔", name: "Sad" },
  { emoji: "😤", name: "Frustrated" },
  { emoji: "😡", name: "Angry" },
  { emoji: "😰", name: "Anxious" },
  { emoji: "🥱", name: "Tired" },
  { emoji: "😕", name: "Confused" },
];

const VOICE_MAX_MS = 120_000; // 2 minutes

export default function Release() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // form state
  const [emotion, setEmotion] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [affirmation, setAffirmation] = useState<string>("");
  const [showAffirmation, setShowAffirmation] = useState(false);

  // voice note state
  const [permissionError, setPermissionError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioDurationMs, setAudioDurationMs] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickTimerRef = useRef<number | null>(null);
  const hardLimitTimerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const affirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // clean up object URL when blob changes
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      stopAllTracks();
      // Clear affirmation timer on unmount
      if (affirmationTimerRef.current) {
        clearTimeout(affirmationTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tick timer display
  useEffect(() => {
    if (!isRecording) return;
    const tick = () => {
      const now = Date.now();
      const ms = now - startedAtRef.current;
      setElapsedMs(ms);
    };
    tick();
    const id = window.setInterval(tick, 250);
    tickTimerRef.current = id as unknown as number;
    return () => window.clearInterval(id);
  }, [isRecording]);

  const stopAllTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const requestMic = async () => {
    try {
      setPermissionError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      return stream;
    } catch (e) {
      setPermissionError(
        "Microphone access was denied. You can still write your feelings, or allow mic access to add a voice note."
      );
      throw e;
    }
  };

  const startRecording = async () => {
    // reset prior audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
    setAudioBlob(null);
    setAudioDurationMs(0);

    const stream = mediaStreamRef.current ?? (await requestMic());

    const mr = new MediaRecorder(stream, { mimeType: pickMimeType() });
    chunksRef.current = [];
    mr.ondataavailable = (evt) => {
      if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
      setIsRecording(false);
      // derive duration from elapsed
      setAudioDurationMs(elapsedMs);
      // clear timers
      if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
      if (hardLimitTimerRef.current) window.clearTimeout(hardLimitTimerRef.current);
      stopAllTracks();
    };

    mr.start(250); // gather data every 250ms
    mediaRecorderRef.current = mr;
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setIsRecording(true);

    // hard stop at VOICE_MAX_MS
    hardLimitTimerRef.current = window.setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }, VOICE_MAX_MS) as unknown as number;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const deleteVoice = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setAudioBlob(null);
    setAudioDurationMs(0);
  };

  const pickMimeType = () => {
    // Use a broadly supported type
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    return "";
  };

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitPayload) => {
      const form = new FormData();
      form.append("emotion", data.emotion || "unspecified");
      form.append("content", data.content || "");

      if (data.audioBlob) {
        // Name file with timestamp; backend can ignore or save for 24h policy
        form.append("audio", data.audioBlob, `voicenote-${Date.now()}.webm`);
        form.append("audioDurationMs", String(data.audioDurationMs ?? 0));
      }

      const res = await fetch("/api/messages", { method: "POST", body: form });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to submit message" }));
        throw new Error(errorData.message || "Failed to submit message");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Get affirmation based on submitted content
      const encouragingMessage = getAffirmation(variables.content, variables.emotion);
      
      // Clear any existing timeout before setting a new one
      if (affirmationTimerRef.current) {
        clearTimeout(affirmationTimerRef.current);
      }
      
      // Show affirmation with message
      setAffirmation(encouragingMessage);
      setShowAffirmation(true);
      
      // Clear form
      setEmotion("");
      setContent("");
      
      // Hide affirmation after 8 seconds
      affirmationTimerRef.current = setTimeout(() => {
        setShowAffirmation(false);
        setAffirmation("");
        affirmationTimerRef.current = null;
      }, 8000);
    },
    onError: (error: any) => {
      // Clear timeout if mutation errors
      if (affirmationTimerRef.current) {
        clearTimeout(affirmationTimerRef.current);
        affirmationTimerRef.current = null;
      }
      
      toast({
        title: "Oops!",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const canSubmit =
    !!emotion &&
    content.trim().length > 0 &&
    !submitMutation.isPending;

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    submitMutation.mutate({
      emotion,
      content,
      audioBlob: undefined,
      audioDurationMs: 0,
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header / Back */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/">
          <span className="text-sm text-warm-gray-500 hover:text-warm-gray-700 transition cursor-pointer">
            ← Back home
          </span>
        </Link>
        <h1 className="text-lg font-semibold text-warm-gray-800">Share Your Feelings</h1>
      </div>

      {/* Emoji Picker */}
      <section className="mb-8">
        <h3 className="text-warm-gray-700 font-medium mb-2">How are you feeling?</h3>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 justify-items-center">
          {EMOJI_CHOICES.map((e) => (
            <button
              key={e.name}
              type="button"
              onClick={() => setEmotion(e.emoji)}
              className={`h-12 w-12 rounded-full border transition 
                ${emotion === e.emoji
                  ? "border-blush-400 ring-2 ring-blush-200"
                  : "border-warm-gray-200 hover:border-warm-gray-300"}`}
              aria-label={e.name}
              title={e.name}
            >
              <span className="text-2xl">{e.emoji}</span>
            </button>
          ))}
        </div>

        {emotion && (
          <p className="mt-2 text-sm text-warm-gray-500">
            Selected: <span className="text-base">{emotion}</span>
          </p>
        )}
      </section>

      {/* Input + Voice */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Text area */}
        <div>
          <label className="block text-sm font-medium text-warm-gray-700">
            Write it out (only you can see this)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Let it all drop here — one mood at a time."
            className="w-full rounded-lg border border-warm-gray-200 focus:ring-2 focus:ring-blush-300 focus:outline-none px-4 py-3 text-warm-gray-800 placeholder-warm-gray-400"
          />
        </div>

        {/* Voice note - Coming Soon */}
        <div className="rounded-lg border border-blush-100 bg-blush-50 p-6 text-center">
          <div className="text-4xl mb-2">🎤</div>
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-1">
            Voice Notes Coming Soon
          </h3>
          <p className="text-sm text-warm-gray-600">
            Soon you'll be able to share your feelings with voice recordings.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!emotion || !content.trim() || submitMutation.isPending}
            className={`px-4 py-2 rounded-lg text-white transition
              ${(!emotion || !content.trim())
                ? "bg-warm-gray-300 cursor-not-allowed"
                : "bg-blush-400 hover:bg-blush-500"}`}
            data-testid="button-submit-feelings"
          >
            {submitMutation.isPending ? "Sharing…" : "Share"}
          </button>

          <p className="text-xs text-warm-gray-500">
            Your feelings are safe and only visible to you. 🌿
          </p>
        </div>
      </form>

      {/* Affirmation Display */}
      <div 
        className={`mt-6 p-6 bg-gradient-to-br from-blush-50 to-cream-50 border-2 border-blush-200 rounded-2xl shadow-lg transition-all duration-500 ${
          showAffirmation 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none h-0 p-0 mt-0 border-0'
        }`}
        data-testid="affirmation-message"
        aria-live="polite"
        aria-atomic="true"
      >
        {showAffirmation && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blush-300 rounded-full flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex-1">
              <p className="text-warm-gray-700 leading-relaxed font-medium">
                {affirmation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sign Up Prompt for Anonymous Users */}
      {!isAuthenticated && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blush-50 to-cream-50 border border-blush-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Sparkles className="text-blush-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
                Track Your Emotional Journey
              </h3>
              <p className="text-sm text-warm-gray-600 mb-4">
                Sign up to unlock your personal Mood Garden, track daily streaks, save favorite moments, and watch your emotional growth bloom over time.
              </p>
              <Link href="/">
                <button className="px-4 py-2 rounded-lg bg-blush-400 hover:bg-blush-500 text-white transition text-sm font-medium">
                  Sign Up to Save Your Progress
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Helpers */
function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(1, "0")}:${String(ss).padStart(2, "0")}`;
}
