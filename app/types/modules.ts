// Module-related types

export type ModuleName = 'terminal' | 'system' | 'clock' | 'gyro' | 'compass' | 'microphone' | 'camera' | 'accelerometer' | 'wifi' | 'tutorial' | 'music' | 'flashlight' | 'battery' | 'maps' | 'calculator' | 'weather' | 'games' | 'finalboss';

export type AppStatus = 'completed' | 'in-progress' | 'locked' | 'default';

export interface AppModule {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  status: AppStatus;
}

// Module Props interfaces
export interface ModuleProps {
  onGoHome: () => void;
}

export interface SystemModuleProps extends ModuleProps {
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export interface AboutScreenProps {
  onGoBack: () => void;
}

export interface CoreVitalsScreenProps {
  onGoBack: () => void;
} 