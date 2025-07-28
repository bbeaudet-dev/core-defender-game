// Module-related types

export type AppStatus = 'completed' | 'in-progress' | 'locked' | 'default';

export interface AppModule {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  status: AppStatus;
}

// Import navigation props from game types to avoid duplication
import { BackNavigationProps, NavigationProps } from './game';

// Module Props interfaces
export interface ModuleProps extends NavigationProps {}

export interface SystemModuleProps extends NavigationProps {
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export interface AboutScreenProps extends BackNavigationProps {}

export interface CoreVitalsScreenProps extends BackNavigationProps {} 