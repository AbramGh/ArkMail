export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    colors: {
      primary: '#00D4FF',
      secondary: '#7C3AED',
      accent: '#F8FAFC',
      background: '#0F172A',
      foreground: '#F8FAFC'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
      secondary: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1))',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
    }
  },
  {
    id: 'agnus-cloud',
    name: 'Agnus Cloud',
    colors: {
      primary: '#8785B9',
      secondary: '#C5B6D1',
      accent: '#FDF6EE',
      background: '#2C2752',
      foreground: '#FDF6EE'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8785B9, #C5B6D1)',
      secondary: 'linear-gradient(135deg, rgba(135, 133, 185, 0.15), rgba(197, 182, 209, 0.15))',
      background: 'linear-gradient(135deg, #2C2752 0%, #1a1a2e 50%, #16213e 100%)'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: {
      primary: '#4A90E2',
      secondary: '#7BB3F0',
      accent: '#E8F4FD',
      background: '#1E3A5F',
      foreground: '#E8F4FD'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4A90E2, #7BB3F0)',
      secondary: 'linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(123, 179, 240, 0.15))',
      background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2A44 50%, #0A1F33 100%)'
    }
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    colors: {
      primary: '#5D8A66',
      secondary: '#8FB996',
      accent: '#F0F7F1',
      background: '#2D4A32',
      foreground: '#F0F7F1'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #5D8A66, #8FB996)',
      secondary: 'linear-gradient(135deg, rgba(93, 138, 102, 0.15), rgba(143, 185, 150, 0.15))',
      background: 'linear-gradient(135deg, #2D4A32 0%, #1F3325 50%, #152218 100%)'
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    colors: {
      primary: '#E67E22',
      secondary: '#F39C12',
      accent: '#FDF2E9',
      background: '#8B4513',
      foreground: '#FDF2E9'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #E67E22, #F39C12)',
      secondary: 'linear-gradient(135deg, rgba(230, 126, 34, 0.15), rgba(243, 156, 18, 0.15))',
      background: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #4A2C17 100%)'
    }
  },
  {
    id: 'midnight-rose',
    name: 'Midnight Rose',
    colors: {
      primary: '#C44569',
      secondary: '#F8B500',
      accent: '#FDF0F5',
      background: '#40407A',
      foreground: '#FDF0F5'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #C44569, #F8B500)',
      secondary: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15), rgba(248, 181, 0, 0.15))',
      background: 'linear-gradient(135deg, #40407A 0%, #2C2C54 50%, #1A1A2E 100%)'
    }
  },
  {
    id: 'arctic-aurora',
    name: 'Arctic Aurora',
    colors: {
      primary: '#00D2FF',
      secondary: '#3A7BD5',
      accent: '#F0FDFF',
      background: '#0F3460',
      foreground: '#F0FDFF'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00D2FF, #3A7BD5)',
      secondary: 'linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(58, 123, 213, 0.15))',
      background: 'linear-gradient(135deg, #0F3460 0%, #0A2647 50%, #051937 100%)'
    }
  }
];