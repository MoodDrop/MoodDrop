import { useState, useEffect } from 'react';

export interface TimeBasedColors {
  background: string;
  headerGradient: string;
  accentPrimary: string;
  accentSecondary: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export function useTimeBasedTheme(): TimeBasedColors {
  const getTimeBasedColors = (): TimeBasedColors => {
    const hour = new Date().getHours();

    // Morning: 6am - 11am (soft golds and peach tones)
    if (hour >= 6 && hour < 12) {
      return {
        background: 'linear-gradient(to bottom right, #FEF3C7, #FED7AA, #FECACA)',
        headerGradient: 'linear-gradient(to right, #FEF3C7, #FED7AA)',
        accentPrimary: '#F59E0B',
        accentSecondary: '#FB923C',
        timeOfDay: 'morning',
      };
    }
    
    // Afternoon: 12pm - 5pm (warm blush and nude tones)
    if (hour >= 12 && hour < 17) {
      return {
        background: 'linear-gradient(to bottom right, #FFF7ED, #FCE7F3, #FEE2E2)',
        headerGradient: 'linear-gradient(to right, #FFF1F2, #FCE7F3)',
        accentPrimary: '#F9A8D4',
        accentSecondary: '#FDA4AF',
        timeOfDay: 'afternoon',
      };
    }
    
    // Evening: 6pm - 10pm (muted lavender and calm blue hues)
    if (hour >= 17 && hour < 22) {
      return {
        background: 'linear-gradient(to bottom right, #EDE9FE, #DBEAFE, #E0E7FF)',
        headerGradient: 'linear-gradient(to right, #EDE9FE, #DBEAFE)',
        accentPrimary: '#C4B5FD',
        accentSecondary: '#93C5FD',
        timeOfDay: 'evening',
      };
    }
    
    // Late Night: 10pm - 6am (deep calm blues and purples)
    return {
      background: 'linear-gradient(to bottom right, #E0E7FF, #DBEAFE, #E0F2FE)',
      headerGradient: 'linear-gradient(to right, #E0E7FF, #DBEAFE)',
      accentPrimary: '#A5B4FC',
      accentSecondary: '#7DD3FC',
      timeOfDay: 'night',
    };
  };

  const [colors, setColors] = useState<TimeBasedColors>(getTimeBasedColors());

  useEffect(() => {
    // Update colors immediately
    setColors(getTimeBasedColors());

    // Check every minute if the time period has changed
    const interval = setInterval(() => {
      const newColors = getTimeBasedColors();
      setColors(prevColors => {
        // Only update if the time of day actually changed
        if (prevColors.timeOfDay !== newColors.timeOfDay) {
          return newColors;
        }
        return prevColors;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return colors;
}
