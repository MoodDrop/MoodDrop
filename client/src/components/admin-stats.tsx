import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Flag, Clock } from "lucide-react";

interface Stats {
  total: number;
  byEmotion: Record<string, number>;
  byStatus: Record<string, number>;
}

export default function AdminStats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/admin/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      angry: "😤",
      sad: "😢", 
      anxious: "😰",
      other: "🤔",
    };
    return emojis[emotion] || "🤔";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "text-green-600 bg-green-100",
      flagged: "text-yellow-600 bg-yellow-100",
      hidden: "text-red-600 bg-red-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-warm-gray-700">{stats?.total || 0}</p>
            </div>
            <Users className="text-blush-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats?.byStatus?.active || 0}</p>
            </div>
            <BarChart3 className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.byStatus?.flagged || 0}</p>
            </div>
            <Flag className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-gray-600">Hidden</p>
              <p className="text-2xl font-bold text-red-600">{stats?.byStatus?.hidden || 0}</p>
            </div>
            <Clock className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Emotion Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100">
        <h3 className="font-semibold text-warm-gray-700 mb-4">Messages by Emotion</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.byEmotion && Object.entries(stats.byEmotion).map(([emotion, count]) => (
            <div key={emotion} className="text-center p-3 bg-blush-50 rounded-lg">
              <div className="text-2xl mb-1">{getEmotionEmoji(emotion)}</div>
              <div className="font-medium text-warm-gray-700">{count}</div>
              <div className="text-xs text-warm-gray-500 capitalize">{emotion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}