import { useState, useRef, useEffect } from "react";
import { RotateCcw, Mic, Square, Play, Trash2 } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";

interface VoiceTabProps {
  selectedMood: MoodKey | null;
  onResetMood: () => void;
}

type RecordingState = "idle" | "recording" | "stopped";

export default function VoiceTab({ selectedMood, onResetMood }: VoiceTabProps) {
  const mood = selectedMood ? moods[selectedMood] : null;
  
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0); // in seconds
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Keyboard shortcuts - Spacebar toggles Record/Stop
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (recordingState === "idle") {
          startRecording();
        } else if (recordingState === "recording") {
          stopRecording();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [recordingState]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setRecordingTime(0);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            // Auto-stop at 60 seconds
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

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingState("idle");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Selected Mood Display */}
      {mood && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blush-50 to-cream-50 rounded-xl border border-blush-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mood.color }}
              data-testid="voice-mood-indicator"
            />
            <div>
              <p className="font-medium text-warm-gray-800">{mood.key}</p>
              <p className="text-sm text-warm-gray-600">{mood.meaning}</p>
            </div>
          </div>
          <button
            onClick={onResetMood}
            className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 transition"
            data-testid="button-reset-mood-voice"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}

      {/* Voice Recording Panel */}
      <div className="rounded-xl border border-blush-200 bg-gradient-to-br from-blush-50 to-cream-50 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
            <Mic 
              size={40} 
              className={recordingState === "recording" ? "text-red-500 animate-pulse" : "text-blush-400"}
            />
          </div>
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Voice Note
          </h3>
          <p className="text-sm text-warm-gray-600">
            Share your thoughts with your voice
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-3 rounded-xl ${
            recordingState === "recording" 
              ? "bg-red-100 text-red-700" 
              : "bg-cream-100 text-warm-gray-700"
          } font-mono text-2xl font-bold`}>
            {formatTime(recordingTime)}
          </div>
          <p className="text-xs text-warm-gray-500 mt-2">
            Maximum: 01:00
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Record Button */}
          {recordingState === "idle" && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-3 bg-blush-300 hover:bg-blush-400 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-record"
            >
              <Mic size={20} />
              Record
            </button>
          )}

          {/* Stop Button */}
          {recordingState === "recording" && (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-stop"
            >
              <Square size={20} />
              Stop
            </button>
          )}

          {/* Play Button */}
          {recordingState === "stopped" && audioBlob && (
            <button
              onClick={playRecording}
              disabled={isPlaying}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-play"
            >
              <Play size={20} />
              {isPlaying ? "Playing..." : "Play"}
            </button>
          )}

          {/* Delete Button */}
          {recordingState === "stopped" && audioBlob && (
            <button
              onClick={deleteRecording}
              className="flex items-center gap-2 px-6 py-3 bg-warm-gray-600 hover:bg-warm-gray-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-delete"
            >
              <Trash2 size={20} />
              Delete
            </button>
          )}
        </div>

        {/* Keyboard Hint */}
        <p className="text-center text-xs text-warm-gray-500 mt-4">
          Tip: Press <kbd className="px-2 py-1 bg-warm-gray-100 rounded border border-warm-gray-300">Spacebar</kbd> to {recordingState === "idle" ? "start" : "stop"} recording
        </p>
      </div>
    </div>
  );
}
