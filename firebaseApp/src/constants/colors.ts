// Enhanced Color System for FitZone App

export const Colors = {
  dark: {
    // Backgrounds
    background: '#020617',
    surface: '#0f172a',
    card: '#1e293b',
    cardElevated: '#334155',
    
    // Borders
    border: '#334155',
    borderLight: '#475569',
    
    // Text
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDisabled: '#64748b',
    
    // Accents
    primary: '#facc15', // Neon yellow for dark mode
    primaryLight: '#fde047',
    primaryDark: '#eab308',
    
    secondary: '#3b82f6',
    secondaryLight: '#60a5fa',
    secondaryDark: '#2563eb',
    
    // Status
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    error: '#ef4444',
    errorLight: '#f87171',
    info: '#06b6d4',
    infoLight: '#22d3ee',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    overlayHeavy: 'rgba(0, 0, 0, 0.85)',
    
    // Gradients
    gradientStart: '#0f172a',
    gradientEnd: '#1e293b',
  },
  
  light: {
    // Backgrounds
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    cardElevated: '#f1f5f9',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    
    // Text
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textDisabled: '#94a3b8',
    
    // Accents
    primary: '#2563eb', // Blue for light mode
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    secondaryDark: '#7c3aed',
    
    // Status
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    error: '#ef4444',
    errorLight: '#f87171',
    info: '#06b6d4',
    infoLight: '#22d3ee',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    overlayHeavy: 'rgba(0, 0, 0, 0.7)',
    
    // Gradients
    gradientStart: '#ffffff',
    gradientEnd: '#f8fafc',
  },
};

// Gradient presets
export const Gradients = {
  dark: {
    primary: ['#facc15', '#eab308'],
    secondary: ['#3b82f6', '#2563eb'],
    success: ['#10b981', '#059669'],
    card: ['#1e293b', '#0f172a'],
    hero: ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.9)'],
  },
  light: {
    primary: ['#3b82f6', '#2563eb'],
    secondary: ['#8b5cf6', '#7c3aed'],
    success: ['#10b981', '#059669'],
    card: ['#ffffff', '#f8fafc'],
    hero: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)'],
  },
};

// Shadow presets
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Border radius presets
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Spacing presets
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Typography
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '900' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};
