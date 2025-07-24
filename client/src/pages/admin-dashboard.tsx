import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Play, Trash2, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/admin/messages'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await apiRequest("DELETE", `/api/admin/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Message deleted",
        description: "The message has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const playAudio = (filename: string) => {
    const audio = new Audio(`/api/audio/${filename}`);
    audio.play().catch(() => {
      toast({
        title: "Playback failed",
        description: "Unable to play the audio file.",
        variant: "destructive",
      });
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Less than an hour ago";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      angry: "😤",
      sad: "😢",
      anxious: "😰",
      other: "🤔",
    };
    return emojis[emotion] || "🤔";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blush-400 mx-auto"></div>
        <p className="text-warm-gray-600 mt-2">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-warm-gray-700">Message Dashboard</h2>
          <p className="text-warm-gray-600 text-sm">Review anonymous submissions</p>
        </div>
        <Link href="/">
          <button className="text-blush-400 hover:text-blush-500 text-sm" data-testid="button-admin-logout">
            Logout
          </button>
        </Link>
      </div>

      <div id="messages-list">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div 
              key={message.id} 
              className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-blush-100"
              data-testid={`message-${message.id}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blush-100 text-blush-600 rounded-full text-xs font-medium">
                    {getEmotionEmoji(message.emotion)} {message.emotion.charAt(0).toUpperCase() + message.emotion.slice(1)}
                  </span>
                  <span className="text-xs text-warm-gray-500">
                    {formatTimeAgo(message.createdAt)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {message.type === 'voice' && message.audioFilename && (
                    <button
                      onClick={() => playAudio(message.audioFilename!)}
                      className="w-8 h-8 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors"
                      data-testid={`button-play-${message.id}`}
                    >
                      <Play className="text-blush-600" size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(message.id)}
                    disabled={deleteMutation.isPending}
                    className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    data-testid={`button-delete-${message.id}`}
                  >
                    <Trash2 className="text-red-600" size={12} />
                  </button>
                </div>
              </div>
              <div className="text-warm-gray-700 text-sm">
                {message.type === 'voice' ? (
                  <span>Voice message{message.duration && ` • ${message.duration}`}</span>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-warm-gray-500" data-testid="no-messages">
            <Inbox className="text-3xl mb-3 mx-auto" size={48} />
            <p>No messages yet</p>
            <p className="text-sm mt-1">Messages will appear here when users share their thoughts</p>
          </div>
        )}
      </div>
    </div>
  );
}
