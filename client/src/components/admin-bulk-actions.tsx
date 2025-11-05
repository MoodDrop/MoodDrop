import { useState } from "react";
import { Trash2, Flag, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export default function AdminBulkActions({ selectedIds, onClearSelection }: AdminBulkActionsProps) {
  const { toast } = useToast();
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await apiRequest("DELETE", "/api/admin/messages/bulk", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      onClearSelection();
      toast({
        title: "Messages deleted",
        description: `Successfully deleted ${selectedIds.length} messages.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete messages. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: any }) => {
      await apiRequest("PATCH", "/api/admin/messages/bulk", { ids, updates });
    },
    onSuccess: (_, { updates }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      onClearSelection();
      toast({
        title: "Messages updated",
        description: `Successfully updated ${selectedIds.length} messages to ${updates.status}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update messages. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} messages?`)) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    const updates = { status, reviewedBy: "admin" };
    bulkUpdateMutation.mutate({ ids: selectedIds, updates });
  };

  const handleBulkFlag = () => {
    if (!flagReason.trim()) {
      toast({
        title: "Flag reason required",
        description: "Please provide a reason for flagging these messages.",
        variant: "destructive",
      });
      return;
    }

    const updates = { 
      status: "flagged", 
      flagReason: flagReason.trim(),
      reviewedBy: "admin" 
    };
    bulkUpdateMutation.mutate({ ids: selectedIds, updates });
    setShowFlagDialog(false);
    setFlagReason("");
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-blush-200 p-4 z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm text-warm-gray-700 font-medium">
            {selectedIds.length} message{selectedIds.length > 1 ? 's' : ''} selected
          </span>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("active")}
              disabled={bulkUpdateMutation.isPending}
              className="border-green-200 text-green-700 hover:bg-green-50"
              data-testid="button-bulk-activate"
            >
              <Eye size={16} className="mr-1" />
              Activate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("hidden")}
              disabled={bulkUpdateMutation.isPending}
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              data-testid="button-bulk-hide"
            >
              <EyeOff size={16} className="mr-1" />
              Hide
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-blush-200" data-testid="button-bulk-more">
                  More <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => setShowFlagDialog(true)}
                  className="text-orange-700"
                  data-testid="menu-bulk-flag"
                >
                  <Flag size={16} className="mr-2" />
                  Flag with Reason
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleBulkDelete}
                  className="text-red-700"
                  data-testid="menu-bulk-delete"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="border-blush-200"
              data-testid="button-clear-selection"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-warm-gray-600">
              You're about to flag {selectedIds.length} message{selectedIds.length > 1 ? 's' : ''}. 
              Please provide a reason:
            </p>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Enter reason for flagging (e.g., inappropriate content, spam, etc.)"
              className="min-h-20"
              data-testid="textarea-flag-reason"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFlagDialog(false)}
              data-testid="button-cancel-flag"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkFlag}
              disabled={!flagReason.trim() || bulkUpdateMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-confirm-flag"
            >
              Flag Messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}