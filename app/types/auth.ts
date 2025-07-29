// Authentication-related types

export type LoginType = 'signup' | 'signin' | 'guest';

export interface LoginScreenProps {
  onLoginSuccess: (type: LoginType, username?: string) => void;
}

export interface LoginFormProps {
  email: string;
  password: string;
  name: string;
  isSignUp: boolean;
  isLoading: boolean;
  error: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onNameChange: (text: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
  onGuestMode: () => void;
}

export interface DownloadScreenProps {
  type: LoginType;
  guestUsername?: string;
  onDownload: () => void;
}

export interface SystemCompromisedAnimationProps {
  onComplete: () => void;
} 