import { createContext, useContext, ReactNode } from 'react';
import { useTimeBasedTheme, type TimeBasedColors } from '@/hooks/useTimeBasedTheme';

const ThemeContext = createContext<TimeBasedColors | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within TimeBasedThemeProvider');
  }
  return context;
}

interface TimeBasedThemeProviderProps {
  children: ReactNode;
}

export function TimeBasedThemeProvider({ children }: TimeBasedThemeProviderProps) {
  const themeColors = useTimeBasedTheme();

  return (
    <ThemeContext.Provider value={themeColors}>
      <div
        className="min-h-screen transition-all duration-1000 ease-in-out"
        style={{
          background: themeColors.background,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
