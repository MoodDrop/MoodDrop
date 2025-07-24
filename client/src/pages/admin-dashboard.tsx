import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Inbox, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";
import AdminStats from "@/components/admin-stats";
import AdminFilters from "@/components/admin-filters";
import AdminBulkActions from "@/components/admin-bulk-actions";
import AdminMessageCard from "@/components/admin-message-card";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    emotion: "",
    search: "",
  });

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/admin/messages', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.emotion) params.append('emotion', filters.emotion);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/admin/messages?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await apiRequest("DELETE", `/api/admin/messages/${messageId}`);
    },
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setSelectedIds(prev => prev.filter(id => id !== messageId));
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

  const handleSelectionChange = (messageId: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected 
        ? [...prev, messageId]
        : prev.filter(id => id !== messageId)
    );
  };

  const handleSelectAll = () => {
    if (messages && selectedIds.length < messages.length) {
      setSelectedIds(messages.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = (messageId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this message?')) {
      deleteMutation.mutate(messageId);
    }
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
    <div className="pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-warm-gray-700">Professional Moderation Dashboard</h2>
          <p className="text-warm-gray-600 text-sm">Advanced tools for content review and management</p>
        </div>
        <Link href="/">
          <button className="flex items-center gap-2 text-blush-400 hover:text-blush-500 text-sm" data-testid="button-admin-logout">
            <LogOut size={16} />
            Logout
          </button>
        </Link>
      </div>

      {/* Statistics */}
      <AdminStats />

      {/* Filters */}
      <AdminFilters filters={filters} onFiltersChange={setFilters} />

      {/* Selection Controls */}
      {messages && messages.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-blush-50 rounded-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blush-600 hover:text-blush-700 font-medium"
              data-testid="button-select-all"
            >
              {selectedIds.length === messages.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedIds.length > 0 && (
              <span className="text-sm text-warm-gray-600">
                {selectedIds.length} of {messages.length} selected
              </span>
            )}
          </div>
          <div className="text-sm text-warm-gray-600">
            Total: {messages.length} messages
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4" id="messages-list">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <AdminMessageCard
              key={message.id}
              message={message}
              isSelected={selectedIds.includes(message.id)}
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 text-warm-gray-500" data-testid="no-messages">
            <Inbox className="text-4xl mb-4 mx-auto" size={64} />
            <h3 className="text-lg font-medium mb-2">No messages found</h3>
            <p className="text-sm">
              {filters.status || filters.emotion || filters.search 
                ? "Try adjusting your filters to see more messages"
                : "Messages will appear here when users share their thoughts"
              }
            </p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <AdminBulkActions 
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}
