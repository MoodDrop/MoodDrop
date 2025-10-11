import { type Message } from "@shared/schema";
import { getEmotionColor } from "@/lib/gardenColors";

interface MoodCalendarProps {
  messages: Message[];
}

export default function MoodCalendar({ messages }: MoodCalendarProps) {
  // Get the last 30 days
  const today = new Date();
  const days: { date: Date; messages: Message[] }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayMessages = messages.filter(msg => {
      const msgDate = new Date(msg.createdAt);
      msgDate.setHours(0, 0, 0, 0);
      return msgDate.getTime() === date.getTime();
    });
    
    days.push({ date, messages: dayMessages });
  }

  const getDayColor = (dayMessages: Message[]) => {
    if (dayMessages.length === 0) return '#F3F4F6'; // gray-100
    
    // Get the dominant emotion color for the day
    const emotions = dayMessages.map(m => m.emotion);
    const mostCommon = emotions.sort((a, b) =>
      emotions.filter(e => e === b).length - emotions.filter(e => e === a).length
    )[0];
    
    return getEmotionColor(mostCommon).primary;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="mood-calendar">
      <h3 className="text-lg font-semibold text-warm-gray-800 mb-4">Your Last 30 Days</h3>
      
      <div className="space-y-2">
        {/* Week day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-xs text-center text-warm-gray-500 font-medium">
              {day.slice(0, 1)}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Fill empty cells at start */}
          {Array.from({ length: days[0]?.date.getDay() || 0 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Calendar days */}
          {days.map(({ date, messages: dayMessages }) => (
            <div
              key={date.toISOString()}
              className="aspect-square rounded-lg p-1 hover:ring-2 hover:ring-blush-300 transition-all cursor-pointer group relative"
              style={{ backgroundColor: getDayColor(dayMessages) }}
              title={`${monthNames[date.getMonth()]} ${date.getDate()}: ${dayMessages.length} ${dayMessages.length === 1 ? 'entry' : 'entries'}`}
              data-testid={`calendar-day-${date.getDate()}`}
            >
              <div className="text-xs text-center font-medium" 
                   style={{ color: dayMessages.length > 0 ? 'white' : '#9CA3AF' }}>
                {date.getDate()}
              </div>
              
              {/* Tooltip */}
              {dayMessages.length > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-warm-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {dayMessages.length} {dayMessages.length === 1 ? 'entry' : 'entries'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-warm-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F3F4F6' }} />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D1D5DB' }} />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }} />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B7280' }} />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4B5563' }} />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
