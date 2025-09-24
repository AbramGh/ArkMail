import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, themes } from '../types/theme';

interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  customBackground: string;
  setCustomBackground: (background: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use liquid glass theme
  const liquidGlassTheme = themes.find(t => t.id === 'liquid-glass') || themes[0];
  const [currentTheme] = useState<Theme>(liquidGlassTheme);
  const [customBackground, setCustomBackground] = useState<string>('');

  const handleSetCustomBackground = (background: string) => {
    setCustomBackground(background);
    
    // Only save to localStorage if it's not a blob URL (uploaded file)
    if (!background.startsWith('blob:')) {
      localStorage.setItem('email-client-custom-background', background);
    }
    
    applyCustomBackground(background);
  };

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-foreground', theme.colors.foreground);
    
    // Apply gradients
    root.style.setProperty('--theme-gradient-primary', theme.gradients.primary);
    root.style.setProperty('--theme-gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--theme-gradient-background', theme.gradients.background);
    
    // Update body background
    if (!customBackground) {
      document.body.style.background = theme.gradients.background;
    }
  };

  const applyCustomBackground = (background: string) => {
    if (background) {
      // Apply to body
      document.body.style.setProperty('background', background, 'important');
      document.body.style.setProperty('background-size', 'cover', 'important');
      document.body.style.setProperty('background-position', 'center', 'important');
      document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
      document.body.style.setProperty('background-attachment', 'fixed', 'important');
      
      // Also apply to html element for full coverage
      document.documentElement.style.setProperty('background', background, 'important');
      document.documentElement.style.setProperty('background-size', 'cover', 'important');
      document.documentElement.style.setProperty('background-position', 'center', 'important');
      document.documentElement.style.setProperty('background-repeat', 'no-repeat', 'important');
      document.documentElement.style.setProperty('background-attachment', 'fixed', 'important');
    } else {
      // Reset to theme background
      document.body.style.setProperty('background', currentTheme.gradients.background, 'important');
      document.body.style.removeProperty('background-size');
      document.body.style.removeProperty('background-position');
      document.body.style.removeProperty('background-repeat');
      document.body.style.removeProperty('background-attachment');
      
      document.documentElement.style.setProperty('background', currentTheme.gradients.background, 'important');
      document.documentElement.style.removeProperty('background-size');
      document.documentElement.style.removeProperty('background-position');
      document.documentElement.style.removeProperty('background-repeat');
      document.documentElement.style.removeProperty('background-attachment');
    }
  };

  useEffect(() => {
    // Always apply liquid glass theme
    applyThemeToDocument(liquidGlassTheme);
    
    // Load saved background from localStorage
    const savedBackground = localStorage.getItem('email-client-custom-background') || '';
    if (savedBackground) {
      setCustomBackground(savedBackground);
      applyCustomBackground(savedBackground);
    }
  }, [liquidGlassTheme]);

  useEffect(() => {
    applyCustomBackground(customBackground);
  }, [customBackground, currentTheme]);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      availableThemes: [liquidGlassTheme], // Only provide liquid glass theme
      customBackground,
      setCustomBackground: handleSetCustomBackground
    }}>
      {children}
    </ThemeContext.Provider>
  );
};