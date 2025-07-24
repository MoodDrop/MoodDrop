import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EmotionTags from "@/components/emotion-tags";
import VoiceRecorder from "@/components/voice-recorder";
import TextInput from "@/components/text-input";

export default function Venting() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [emotion, setEmotion] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<"voice" | "text">("voice");
  const [textContent, setTextContent] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<string>("");

  const submitMutation = useMutation({
    mutationFn: async (data: { emotion: string; content?: string; audio?: Blob; duration?: string }) => {
      const formData = new FormData();
      formData.append('emotion', data.emotion);
      
      if (data.audio) {
        formData.append('audio', data.audio, 'voice-message.webm');
        formData.append('duration', data.duration || '');
      } else {
        formData.append('content', data.content || '');
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to submit message');
      }

      return res.json();
    },
    onSuccess: () => {
      setLocation('/thank-you');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!emotion) {
      toast({
        title: "Please select an emotion",
        description: "Let us know how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    if (inputMethod === "voice" && !audioBlob) {
      toast({
        title: "No voice recording",
        description: "Please record a voice message or switch to text input.",
        variant: "destructive",
      });
      return;
    }

    if (inputMethod === "text" && !textContent.trim()) {
      toast({
        title: "No message content",
        description: "Please enter your message before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      emotion,
      content: inputMethod === "text" ? textContent : undefined,
      audio: inputMethod === "voice" && audioBlob ? audioBlob : undefined,
      duration: inputMethod === "voice" ? duration : undefined,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/">
          <button className="text-blush-400 hover:text-blush-500 flex items-center mb-4" data-testid="button-back-home">
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </button>
        </Link>
        
        <h2 className="text-xl font-semibold text-warm-gray-700 mb-2">Express Yourself</h2>
        <p className="text-warm-gray-600 text-sm mb-6">Choose how you'd like to share - your voice or your words</p>
      </div>

      <EmotionTags selectedEmotion={emotion} onEmotionSelect={setEmotion} />

      {/* Input method toggle */}
      <div className="mb-6">
        <div className="flex bg-blush-100 rounded-full p-1">
          <button
            onClick={() => setInputMethod("voice")}
            className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
              inputMethod === "voice"
                ? "bg-white text-blush-600 shadow-sm"
                : "text-warm-gray-600"
            }`}
            data-testid="button-voice-toggle"
          >
            <span className="mr-2">🎤</span>
            Voice
          </button>
          <button
            onClick={() => setInputMethod("text")}
            className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
              inputMethod === "text"
                ? "bg-white text-blush-600 shadow-sm"
                : "text-warm-gray-600"
            }`}
            data-testid="button-text-toggle"
          >
            <span className="mr-2">⌨️</span>
            Text
          </button>
        </div>
      </div>

      {inputMethod === "voice" ? (
        <VoiceRecorder 
          onAudioReady={(blob, recordingDuration) => {
            setAudioBlob(blob);
            setDuration(recordingDuration);
          }}
          onAudioClear={() => {
            setAudioBlob(null);
            setDuration("");
          }}
        />
      ) : (
        <TextInput 
          value={textContent}
          onChange={setTextContent}
        />
      )}

      {/* Submit section */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit-message"
        >
          {submitMutation.isPending ? (
            <>
              <span className="mr-2">⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <span className="mr-2">📤</span>
              Share Anonymously
            </>
          )}
        </button>
        <p className="text-xs text-warm-gray-600 mt-3 px-4">
          Your message is completely anonymous. We don't collect any personal information.
        </p>
      </div>
    </div>
  );
}
