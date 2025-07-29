// UI component types

export interface AppIconWithHaloProps {
  icon: string;
  name: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  badge?: string | number;
  status?: 'completed' | 'in-progress' | 'locked' | 'default';
  showUnlockAnimation?: boolean;
  isFinalBossDefeated?: boolean;
}

export interface ScreenTemplateProps {
  title: string;
  titleColor?: string;
  showHomeButton?: boolean;
  backgroundImage?: any;
  children: React.ReactNode;
}

export interface GlitchTextProps {
  text: string;
  fontSize?: number;
  width?: number;
  height?: number;
  animationSpeed?: number;
  animationInterval?: number;
  primaryColor?: string;
  secondaryColor?: string;
  baseColor?: string;
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface AnimatedBackgroundProps {
  source: any;
  opacity?: number;
  isVideo?: boolean;
  shouldLoop?: boolean;
  shouldPlay?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  children: React.ReactNode;
}

export interface HomeButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export interface BatteryIndicatorProps {
  level: number;
  isCharging: boolean;
}

export interface LiveDataPlotProps {
  data: number[];
  title: string;
  color?: string;
  maxValue?: number;
}

export interface PuzzleStatusProps {
  completed: number;
  total: number;
}

export interface InfectionProgressBarProps {
  progress: number;
  status: string;
} 