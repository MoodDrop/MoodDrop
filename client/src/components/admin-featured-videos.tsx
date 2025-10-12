import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Youtube, Video, ArrowUp, ArrowDown } from "lucide-react";
import type { FeaturedVideo } from "@shared/schema";

export default function AdminFeaturedVideos() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<FeaturedVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    platform: "youtube",
    displayOrder: 0,
  });

  const { data: videos, isLoading } = useQuery<FeaturedVideo[]>({
    queryKey: ['/api/admin/featured-videos'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/featured-videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/featured-videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-videos'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Video added",
        description: "Featured video has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return await apiRequest("PATCH", `/api/admin/featured-videos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/featured-videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-videos'] });
      setEditingVideo(null);
      resetForm();
      toast({
        title: "Video updated",
        description: "Featured video has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/featured-videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/featured-videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-videos'] });
      toast({
        title: "Video deleted",
        description: "Featured video has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      platform: "youtube",
      displayOrder: 0,
    });
  };

  const handleEdit = (video: FeaturedVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      url: video.url,
      platform: video.platform,
      displayOrder: video.displayOrder,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this featured video?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    if (!videos) return;
    
    const currentVideo = videos.find(v => v.id === id);
    if (!currentVideo) return;

    const newOrder = direction === 'up' ? currentVideo.displayOrder - 1 : currentVideo.displayOrder + 1;
    updateMutation.mutate({ id, data: { displayOrder: newOrder } });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blush-400 mx-auto"></div>
        <p className="text-warm-gray-600 mt-2">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-featured-videos">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-warm-gray-700">Featured Videos</h3>
          <p className="text-sm text-warm-gray-600">Manage YouTube and TikTok videos displayed on the comfort page</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blush-400 hover:bg-blush-500" data-testid="button-add-video">
              <Plus size={16} className="mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-video">
            <DialogHeader>
              <DialogTitle>Add Featured Video</DialogTitle>
              <DialogDescription>
                Add a YouTube or TikTok video to display on the comfort page
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Peaceful Nature Scenes"
                  required
                  data-testid="input-video-title"
                />
              </div>
              <div>
                <Label htmlFor="url">Video URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/... or https://tiktok.com/..."
                  required
                  data-testid="input-video-url"
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger data-testid="select-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  data-testid="input-display-order"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blush-400 hover:bg-blush-500" data-testid="button-submit-video">
                  Add Video
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos List */}
      <div className="space-y-3">
        {videos && videos.length === 0 && (
          <div className="text-center py-8 text-warm-gray-500">
            <Video size={48} className="mx-auto mb-2 opacity-50" />
            <p>No featured videos yet. Add your first video!</p>
          </div>
        )}
        
        {videos?.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl p-4 border border-warm-gray-200 flex items-center justify-between"
            data-testid={`video-card-${video.id}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-blush-400">
                {video.platform === 'youtube' ? <Youtube size={24} /> : <Video size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-warm-gray-800">{video.title}</h4>
                <p className="text-sm text-warm-gray-600 truncate max-w-md">{video.url}</p>
                <p className="text-xs text-warm-gray-500">Order: {video.displayOrder}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReorder(video.id, 'up')}
                data-testid={`button-move-up-${video.id}`}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReorder(video.id, 'down')}
                data-testid={`button-move-down-${video.id}`}
              >
                <ArrowDown size={16} />
              </Button>
              <Dialog open={editingVideo?.id === video.id} onOpenChange={(open) => !open && setEditingVideo(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(video)}
                    data-testid={`button-edit-${video.id}`}
                  >
                    <Pencil size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-edit-video">
                  <DialogHeader>
                    <DialogTitle>Edit Featured Video</DialogTitle>
                    <DialogDescription>
                      Update the video details
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        data-testid="input-edit-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-url">Video URL</Label>
                      <Input
                        id="edit-url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        required
                        data-testid="input-edit-url"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-platform">Platform</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      >
                        <SelectTrigger data-testid="select-edit-platform">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-order">Display Order</Label>
                      <Input
                        id="edit-order"
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                        data-testid="input-edit-order"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-blush-400 hover:bg-blush-500" data-testid="button-update-video">
                        Update Video
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(video.id)}
                className="text-red-500 hover:text-red-600"
                data-testid={`button-delete-${video.id}`}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
