import { useState } from "react";
import { Play, Flag, Eye, EyeOff, MoreVertical, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface AdminMessageCardProps {
  message: Message;
  isSelected: boolean;
  onSelectionChange: (id: string, selected: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminMessageCard({ 
  message, 
  isSelected, 
  onSelectionChange, 
  onDelete 
}: AdminMessageCardProps) {
  const { toast } = useToast();
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiRequest("PATCH", `/api/admin/messages/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Message updated",
        description: "Message status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
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
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      angry: "😤",
      sad: "😢",
      anxious: "😰",
      happy: "😊",
      excited: "🤩",
      other: "🤔",
    };
    return emojis[emotion] || "🤔";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      flagged: "bg-yellow-100 text-yellow-800 border-yellow-200",
      hidden: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleStatusChange = (status: string) => {
    const updates = { status, reviewedBy: "admin" };
    updateMutation.mutate({ id: message.id, updates });
  };

  const handleFlag = () => {
    if (!flagReason.trim()) {
      toast({
        title: "Flag reason required",
        description: "Please provide a reason for flagging this message.",
        variant: "destructive",
      });
      return;
    }

    const updates = { 
      status: "flagged", 
      flagReason: flagReason.trim(),
      reviewedBy: "admin" 
    };
    updateMutation.mutate({ id: message.id, updates });
    setShowFlagDialog(false);
    setFlagReason("");
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
          isSelected ? 'border-blush-400 bg-blush-50' : 'border-blush-100'
        }`}
        data-testid={`message-card-${message.id}`}
      >
        <div className="flex items-start gap-3">
          {/* Selection Checkbox */}
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(message.id, !!checked)}
            className="mt-1"
            data-testid={`checkbox-${message.id}`}
          />

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs font-medium ${getStatusColor(message.status)}`}>
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </Badge>
                
                <span className="px-2 py-1 bg-blush-100 text-blush-600 rounded-full text-xs font-medium">
                  {getEmotionEmoji(message.emotion)} {message.emotion.charAt(0).toUpperCase() + message.emotion.slice(1)}
                </span>
                
                <span className="text-xs text-warm-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(message.createdAt)}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid={`menu-${message.id}`}>
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("active")}
                    className="text-green-700"
                    data-testid={`menu-activate-${message.id}`}
                  >
                    <Eye size={16} className="mr-2" />
                    Set Active
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("hidden")}
                    className="text-yellow-700"
                    data-testid={`menu-hide-${message.id}`}
                  >
                    <EyeOff size={16} className="mr-2" />
                    Hide Message
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowFlagDialog(true)}
                    className="text-orange-700"
                    data-testid={`menu-flag-${message.id}`}
                  >
                    <Flag size={16} className="mr-2" />
                    Flag with Reason
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(message.id)}
                    className="text-red-700"
                    data-testid={`menu-delete-${message.id}`}
                  >
                    Delete Permanently
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <div className="text-warm-gray-700 text-sm mb-3">
              {message.type === 'voice' ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => playAudio(message.audioFilename!)}
                    className="w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors"
                    data-testid={`play-${message.id}`}
                  >
                    <Play className="text-blush-600" size={16} />
                  </button>
                  <span>Voice message{message.duration && ` • ${message.duration}`}</span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>

            {/* Review Info */}
            {message.reviewedBy && message.reviewedAt && (
              <div className="flex items-center gap-2 text-xs text-warm-gray-500 mt-3 pt-3 border-t border-blush-100">
                <User size={12} />
                <span>Reviewed by {message.reviewedBy} on {new Date(message.reviewedAt).toLocaleDateString()}</span>
                {message.flagReason && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    Reason: {message.flagReason}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-warm-gray-600">
              Why are you flagging this message? This will help with future moderation decisions.
            </p>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Enter reason (e.g., inappropriate content, spam, harassment, etc.)"
              className="min-h-20"
              data-testid={`textarea-flag-${message.id}`}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFlagDialog(false)}
              data-testid={`cancel-flag-${message.id}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFlag}
              disabled={!flagReason.trim() || updateMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid={`confirm-flag-${message.id}`}
            >
              Flag Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}