import { type Message } from "@shared/schema";
import { getEmotionColor } from "@/lib/gardenColors";
import { TrendingUp, Heart, Brain, Sparkles } from "lucide-react";

interface InsightsDashboardProps {
  messages: Message[];
}

export default function InsightsDashboard({ messages }: InsightsDashboardProps) {
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="insights-dashboard">
        <h3 className="text-lg font-semibold text-warm-gray-800 mb-4">Your Insights</h3>
        <p className="text-warm-gray-500 text-center py-8">
          Share more feelings to see your emotional patterns and insights
        </p>
      </div>
    );
  }

  // Calculate emotion distribution
  const emotionCounts: Record<string, number> = {};
  messages.forEach(msg => {
    emotionCounts[msg.emotion] = (emotionCounts[msg.emotion] || 0) + 1;
  });

  const totalMessages = messages.length;
  const emotionStats = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / totalMessages) * 100),
      color: getEmotionColor(emotion),
    }))
    .sort((a, b) => b.count - a.count);

  const mostCommonEmotion = emotionStats[0];
  
  // Calculate posting patterns
  const last7Days = messages.filter(msg => {
    const msgDate = new Date(msg.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return msgDate >= weekAgo;
  }).length;

  const last30Days = messages.filter(msg => {
    const msgDate = new Date(msg.createdAt);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return msgDate >= monthAgo;
  }).length;

  // Get insights
  const insights = [];
  
  if (mostCommonEmotion.percentage > 40) {
    insights.push({
      icon: Heart,
      color: mostCommonEmotion.color.primary,
      text: `You've been feeling ${mostCommonEmotion.emotion} quite often (${mostCommonEmotion.percentage}% of the time)`,
    });
  }

  if (last7Days >= 5) {
    insights.push({
      icon: TrendingUp,
      color: '#10B981',
      text: `You've been very consistent this week with ${last7Days} entries!`,
    });
  }

  if (emotionStats.length >= 4) {
    insights.push({
      icon: Brain,
      color: '#8B5CF6',
      text: `You're experiencing a diverse range of emotions - that's perfectly normal and healthy`,
    });
  }

  if (messages.length >= 10) {
    insights.push({
      icon: Sparkles,
      color: '#F59E0B',
      text: `You've shared ${messages.length} times! Your garden is growing beautifully`,
    });
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="insights-dashboard">
      <h3 className="text-lg font-semibold text-warm-gray-800 mb-4">Your Insights</h3>
      
      {/* Emotion Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-warm-gray-700 mb-3">Emotion Distribution</h4>
        <div className="space-y-2">
          {emotionStats.slice(0, 5).map(({ emotion, count, percentage, color }) => (
            <div key={emotion} className="flex items-center gap-3" data-testid={`emotion-stat-${emotion}`}>
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: color.primary }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-warm-gray-700 capitalize">{emotion}</span>
                  <span className="text-xs text-warm-gray-500">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color.primary 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600" data-testid="text-last-7-days">{last7Days}</div>
          <div className="text-xs text-warm-gray-600">Last 7 days</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600" data-testid="text-last-30-days">{last30Days}</div>
          <div className="text-xs text-warm-gray-600">Last 30 days</div>
        </div>
      </div>

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-warm-gray-700 mb-2">Personalized Insights</h4>
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              data-testid={`insight-${index}`}
            >
              <insight.icon 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                style={{ color: insight.color }}
              />
              <p className="text-sm text-warm-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
