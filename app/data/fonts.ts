// Font configuration for consistent typography across the app
export const FONTS = {
  // Primary font - Orbitron (futuristic, cyberpunk)
  PRIMARY: 'Orbitron',
  
  // Monospace fonts for technical/code content
  MONO: 'SpaceMono',
  TERMINAL: 'OCRA',
  
  // Glitch text font - using system font for reliable Skia rendering
  GLITCH: 'Arial',
  
  // Fallback fonts
  FALLBACK: 'Arial',
  SYSTEM: 'System',
} as const;

// Font size hierarchy
export const FONT_SIZES = {
  // Headers
  H1: 32,
  H2: 24,
  H3: 20,
  H4: 18,
  
  // Body text
  LARGE: 16,
  MEDIUM: 14,
  SMALL: 12,
  XSMALL: 10,
  
  // Special sizes
  DISPLAY: 48,
  TITLE: 36,
} as const;

// Font weight hierarchy
export const FONT_WEIGHTS = {
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  BLACK: '900',
} as const;

// Typography classes for consistent usage
export const TYPOGRAPHY = {
  // Headers
  H1: `text-${FONT_SIZES.H1} font-${FONT_WEIGHTS.BOLD} font-primary`,
  H2: `text-${FONT_SIZES.H2} font-${FONT_WEIGHTS.SEMIBOLD} font-primary`,
  H3: `text-${FONT_SIZES.H3} font-${FONT_WEIGHTS.MEDIUM} font-primary`,
  H4: `text-${FONT_SIZES.H4} font-${FONT_WEIGHTS.NORMAL} font-primary`,
  
  // Body text
  BODY_LARGE: `text-${FONT_SIZES.LARGE} font-${FONT_WEIGHTS.NORMAL} font-primary`,
  BODY: `text-${FONT_SIZES.MEDIUM} font-${FONT_WEIGHTS.NORMAL} font-primary`,
  BODY_SMALL: `text-${FONT_SIZES.SMALL} font-${FONT_WEIGHTS.NORMAL} font-primary`,
  CAPTION: `text-${FONT_SIZES.XSMALL} font-${FONT_WEIGHTS.NORMAL} font-primary`,
  
  // Technical/monospace text
  MONO_LARGE: `text-${FONT_SIZES.LARGE} font-${FONT_WEIGHTS.NORMAL} font-mono`,
  MONO: `text-${FONT_SIZES.MEDIUM} font-${FONT_WEIGHTS.NORMAL} font-mono`,
  MONO_SMALL: `text-${FONT_SIZES.SMALL} font-${FONT_WEIGHTS.NORMAL} font-mono`,
  
  // Terminal text
  TERMINAL: `text-${FONT_SIZES.MEDIUM} font-${FONT_WEIGHTS.NORMAL} font-terminal`,
  
  // Display text
  DISPLAY: `text-${FONT_SIZES.DISPLAY} font-${FONT_WEIGHTS.BLACK} font-primary`,
  TITLE: `text-${FONT_SIZES.TITLE} font-${FONT_WEIGHTS.BOLD} font-primary`,
} as const;

// Helper function to get font family for GlitchText
export function getGlitchTextFont(): string {
  return FONTS.GLITCH;
} 