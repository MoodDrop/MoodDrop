import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from "lucide-react";
import { MOOD_PALETTE, type MoodKey } from "@/lib/moods";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAffirmation } from "@/lib/affirmations";

interface MoodComposerProps {
  selectedMood: MoodKey;
  onResetMood: () => void;
  draftText: string;
  onTextChange: (text: string) => void;
  onClearText: () => void;
}

type ComposerMode = "choice" | "write" | "record";
type RecordingState = "idle" | "recording" | "review";

const VOICE_MAX_MS = 120000; // 2 minutes

export default function MoodComposer({
  selectedMood,
  onResetMood,
  draftText,
  onTextChange,
  onClearText
}: MoodComposerProps) {
  const [mode, setMode] = useState<ComposerMode>("choice");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDurationMs, setAudioDurationMs] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const affirmationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const mood = MOOD_PALETTE[selectedMood];

  const submitMutation = useMutation({
    mutationFn: async (data: { emotion: string; content: string; audioBlob?: Blob; audioDurationMs?: number }) => {
      const form = new FormData();
      form.append("emotion", data.emotion || "unspecified");
      form.append("content", data.content || "");

      if (data.audioBlob) {
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
      const encouragingMessage = getAffirmation(variables.content, variables.emotion);
      
      if (affirmationTimerRef.current) {
        clearTimeout(affirmationTimerRef.current);
      }
      
      setAffirmation(encouragingMessage);
      setShowAffirmation(true);
      
      // Clear form
      onClearText();
      setMode("choice");
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
      setAudioBlob(null);
      setRecordingState("idle");
      
      affirmationTimerRef.current = setTimeout(() => {
        setShowAffirmation(false);
        setAffirmation("");
        affirmationTimerRef.current = null;
        // Reset mood to return to selector after affirmation
        onResetMood();
      }, 8000);
    },
    onError: (error: any) => {
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      if (!mimeType) {
        toast({ title: "Error", description: "Your browser doesn't support audio recording.", variant: "destructive" });
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        setRecordingState("review");
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecordingState("recording");
      const startTime = Date.now();

      timerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          setAudioDurationMs(Date.now() - startTime);
          mediaRecorderRef.current.stop();
        }
      }, VOICE_MAX_MS);
    } catch (err) {
      toast({ title: "Error", description: "Could not access microphone.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      const startTime = Date.now() - (timerRef.current ? VOICE_MAX_MS : 0);
      setAudioDurationMs(Date.now() - startTime);
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setAudioBlob(null);
    setAudioDurationMs(0);
    setRecordingState("idle");
  };

  const pickMimeType = () => {
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    return "";
  };

  const handleSubmit = () => {
    if (mode === "write" && draftText.trim()) {
      submitMutation.mutate({
        emotion: selectedMood,
        content: draftText,
      });
    } else if (mode === "record" && audioBlob) {
      submitMutation.mutate({
        emotion: selectedMood,
        content: `Voice note expressing ${selectedMood.toLowerCase()} feelings`,
        audioBlob,
        audioDurationMs,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (affirmationTimerRef.current) clearTimeout(affirmationTimerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Mood Header with Reset */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: mood.color }}
          >
            <span className="text-2xl">{mood.icon}</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-warm-gray-800">{mood.key}</h4>
            <p className="text-sm text-warm-gray-600">{mood.meaning}</p>
          </div>
        </div>
        <button
          onClick={onResetMood}
          className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 transition"
          data-testid="button-reset-mood"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Affirmation Display */}
      {showAffirmation && (
        <div 
          className="mb-6 p-6 bg-gradient-to-br from-blush-50 to-cream-50 border-2 border-blush-200 rounded-2xl shadow-lg animate-in fade-in duration-500"
          data-testid="affirmation-message"
        >
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
        </div>
      )}

      {/* Mode Selection */}
      {mode === "choice" && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setMode("write")}
            className="flex-1 max-w-xs bg-blush-300 hover:bg-blush-400 text-white font-medium px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-write"
          >
            ✍️ Write
          </button>
          <button
            onClick={() => setMode("record")}
            className="flex-1 max-w-xs bg-cream-200 hover:bg-cream-300 text-warm-gray-700 font-medium px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-record"
          >
            🎤 Record Voice
          </button>
        </div>
      )}

      {/* Write Mode */}
      {mode === "write" && (
        <div className="animate-in fade-in duration-300">
          <textarea
            value={draftText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Let it flow…"
            className="w-full h-40 p-4 rounded-xl border-2 border-cream-200 focus:border-blush-300 focus:outline-none resize-none text-warm-gray-700 bg-white"
            data-testid="textarea-mood-write"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!draftText.trim() || submitMutation.isPending}
              className="flex-1 bg-blush-300 hover:bg-blush-400 disabled:bg-warm-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md"
              data-testid="button-submit-write"
            >
              {submitMutation.isPending ? "Sharing..." : "Share"}
            </button>
            <button
              onClick={onClearText}
              className="px-6 py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-warm-gray-700 transition"
              data-testid="button-clear-text"
            >
              Clear Text
            </button>
          </div>
        </div>
      )}

      {/* Record Mode */}
      {mode === "record" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-cream-50 rounded-xl p-6 text-center">
            {recordingState === "idle" && (
              <button
                onClick={startRecording}
                className="w-20 h-20 bg-blush-300 hover:bg-blush-400 rounded-full flex items-center justify-center mx-auto transition shadow-lg"
                data-testid="button-start-recording"
              >
                <Mic className="text-white" size={32} />
              </button>
            )}
            
            {recordingState === "recording" && (
              <div>
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Square className="text-white" size={24} />
                </div>
                <button
                  onClick={stopRecording}
                  className="bg-warm-gray-700 hover:bg-warm-gray-800 text-white px-6 py-2 rounded-lg transition"
                  data-testid="button-stop-recording"
                >
                  Stop Recording
                </button>
              </div>
            )}
            
            {recordingState === "review" && audioUrl && (
              <div>
                <audio controls src={audioUrl} className="w-full mb-4" data-testid="audio-playback" />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="bg-blush-300 hover:bg-blush-400 disabled:bg-warm-gray-300 text-white px-6 py-3 rounded-xl transition"
                    data-testid="button-submit-voice"
                  >
                    {submitMutation.isPending ? "Sharing..." : "Share Voice Note"}
                  </button>
                  <button
                    onClick={deleteRecording}
                    className="bg-cream-200 hover:bg-cream-300 text-warm-gray-700 px-6 py-3 rounded-xl transition"
                    data-testid="button-delete-recording"
                  >
                    <Trash2 size={18} className="inline mr-2" />
                    Re-record
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
