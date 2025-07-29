// Game-related types

export interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

export interface GameState {
  currentState: string;
  loginType: 'signup' | 'signin' | 'guest';
  guestUsername: string;
}

// Standardized navigation props
export interface NavigationProps {
  onGoHome: () => void;
}

export interface BackNavigationProps {
  onGoBack: () => void;
}

// Game module interfaces - all main modules use onGoHome
export interface GamesModuleProps extends NavigationProps {}

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

export interface FinalBossModuleProps extends NavigationProps {}

export interface TerminalModuleProps extends NavigationProps {}

export interface ClockModuleProps extends NavigationProps {}

export interface CalculatorModuleProps extends NavigationProps {}

export interface WeatherModuleProps extends NavigationProps {}

export interface BatteryModuleProps extends NavigationProps {}

export interface FlashlightModuleProps extends NavigationProps {}

export interface PhoneCameraModuleProps extends NavigationProps {}

export interface CameraStatusProps extends BackNavigationProps {}

export interface CameraPlaceholderProps extends BackNavigationProps {}

export interface CompassModuleProps extends NavigationProps {}

export interface AccelerometerModuleProps extends NavigationProps {}

export interface GyroModuleProps extends NavigationProps {}

export interface MicrophoneModuleProps extends NavigationProps {}

export interface MusicModuleProps extends NavigationProps {}

export interface MapsModuleProps extends NavigationProps {}

export interface WifiModuleProps extends NavigationProps {}

export interface TutorialModuleProps extends NavigationProps {} 