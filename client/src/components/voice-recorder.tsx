import { useState, useRef } from "react";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onAudioReady: (audioBlob: Blob, duration: string) => void;
  onAudioClear: () => void;
}

export default function VoiceRecorder({ onAudioReady, onAudioClear }: VoiceRecorderProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAudioReady(audioBlob, duration);
        setHasRecording(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          const minutes = Math.floor(newTime / 60).toString().padStart(2, '0');
          const seconds = (newTime % 60).toString().padStart(2, '0');
          setDuration(`${minutes}:${seconds}`);
          return newTime;
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone permissions or use text input instead.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const deleteRecording = () => {
    setHasRecording(false);
    setDuration("00:00");
    setRecordingTime(0);
    onAudioClear();
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  };

  return (
    <div className="bg-blush-50 rounded-2xl p-6 mb-6">
      <div className="text-center">
        {!isRecording && !hasRecording && (
          <div data-testid="recording-status">
            <button
              onClick={handleRecordButtonClick}
              className="w-20 h-20 bg-blush-300 hover:bg-blush-400 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all transform hover:scale-105 shadow-lg"
              data-testid="button-record"
            >
              <Mic className="text-white" size={32} />
            </button>
            <p className="text-warm-gray-600 text-sm mt-3">Tap to start recording</p>
          </div>
        )}

        {isRecording && (
          <div data-testid="recording-active">
            <button
              onClick={handleRecordButtonClick}
              className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center mx-auto animate-pulse cursor-pointer"
              data-testid="button-stop"
            >
              <Square className="text-white" size={32} />
            </button>
            <p className="text-red-600 font-medium mt-3">Recording... Tap to stop</p>
            <div className="mt-2">
              <span className="text-blush-400 font-mono" data-testid="recording-timer">{duration}</span>
            </div>
          </div>
        )}

        {hasRecording && !isRecording && (
          <div data-testid="recording-complete">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={playRecording}
                className="w-12 h-12 bg-blush-300 rounded-full flex items-center justify-center hover:bg-blush-400 transition-colors"
                data-testid="button-play-recording"
              >
                <Play className="text-white" size={16} />
              </button>
              <div className="flex-1 bg-blush-200 h-2 rounded-full">
                <div className="bg-blush-400 h-2 rounded-full w-0 transition-all duration-300"></div>
              </div>
              <button
                onClick={deleteRecording}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                data-testid="button-delete-recording"
              >
                <Trash2 className="text-gray-600" size={16} />
              </button>
            </div>
            <p className="text-warm-gray-600 text-sm">Your voice note is ready • {duration}</p>
          </div>
        )}
      </div>
    </div>
  );
}
