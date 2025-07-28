// Game-related types

export interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

export interface GameState {
  currentState: string;
  loginType: 'signup' | 'signin' | 'guest';
  guestUsername: string;
}

// Game module interfaces
export interface GamesModuleProps {
  onGoHome: () => void;
}

export interface MemoryGameProps {
  onComplete: () => void;
  onGoBack: () => void;
}

export interface NumberGuessGameProps {
  onComplete: () => void;
  onGoBack: () => void;
}

export interface ReactionTestProps {
  onComplete: () => void;
  onGoBack: () => void;
}

export interface FinalBossModuleProps {
  onGoHome: () => void;
}

// Terminal module
export interface TerminalModuleProps {
  onGoHome: () => void;
}

// Clock module
export interface ClockModuleProps {
  onGoHome: () => void;
}

// Calculator module
export interface CalculatorModuleProps {
  onGoHome: () => void;
}

// Weather module
export interface WeatherModuleProps {
  onGoHome: () => void;
}

// Battery module
export interface BatteryModuleProps {
  onGoHome: () => void;
}

// Flashlight module
export interface FlashlightModuleProps {
  onGoHome: () => void;
}

// Camera module
export interface PhoneCameraModuleProps {
  onGoHome: () => void;
}

export interface CameraStatusProps {
  onGoBack: () => void;
}

export interface CameraPlaceholderProps {
  onGoBack: () => void;
}

// Compass module
export interface CompassModuleProps {
  onGoHome: () => void;
}

export interface CompassDisplayProps {
  heading: number;
}

export interface CompassDataProps {
  heading: number;
}

export interface CompassErrorProps {
  onGoBack: () => void;
}

export interface CompassUnavailableProps {
  onGoBack: () => void;
}

// Accelerometer module
export interface AccelerometerModuleProps {
  onGoHome: () => void;
}

export interface AccelerometerDataProps {
  x: number;
  y: number;
  z: number;
}

export interface AccelerometerControlsProps {
  onStart: () => void;
  onStop: () => void;
  isActive: boolean;
}

export interface AccelerometerUnavailableProps {
  onGoBack: () => void;
}

// Gyro module
export interface GyroModuleProps {
  onGoHome: () => void;
}

export interface GyroControlsProps {
  onStart: () => void;
  onStop: () => void;
  isActive: boolean;
}

export interface SpeedDisplayProps {
  speed: number;
}

// Microphone module
export interface MicrophoneModuleProps {
  onGoHome: () => void;
}

export interface AudioLevelIndicatorProps {
  level: number;
}

export interface AudioWaveformProps {
  data: number[];
}

// Music module
export interface MusicModuleProps {
  onGoHome: () => void;
}

export interface MusicTracksProps {
  onTrackSelect: (track: string) => void;
  selectedTrack?: string;
}

export interface AudioControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

// Maps module
export interface MapsModuleProps {
  onGoHome: () => void;
}

// Wifi module
export interface WifiModuleProps {
  onGoHome: () => void;
}

export interface ConnectionStatusProps {
  isConnected: boolean;
  networkName?: string;
}

export interface NetworkListProps {
  networks: Array<{
    ssid: string;
    strength: number;
    security: string;
  }>;
  onNetworkSelect: (ssid: string) => void;
}

export interface NetworkStatsProps {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
}

// Tutorial module
export interface TutorialModuleProps {
  onGoHome: () => void;
} 