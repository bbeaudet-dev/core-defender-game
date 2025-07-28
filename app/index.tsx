import { useEffect, useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './components/home/HomeScreen';
import DownloadScreen from './components/login/DownloadScreen';
import LoginScreen from './components/login/LoginScreen';
import AboutScreen from './components/Modules/about/AboutScreen';
import CoreVitalsScreen from './components/Modules/about/CoreVitalsScreen';
import SystemModule from './components/Modules/about/System/SystemModule';
import { useAuth } from './contexts/AuthContext';
import { InfectionProvider } from './contexts/InfectionContext';
import { PuzzleProvider } from './contexts/PuzzleContext';
import { MODULE_COMPONENTS } from './data/components';
import { authApi } from './lib/auth';
import { LoginType } from './types/auth';

function AppContent() {
  const { isAuthenticated, user, guestSignIn } = useAuth();
  const [gameState, setGameState] = useState('welcome');
  const [loginType, setLoginType] = useState<LoginType>('signin');
  const [guestUsername, setGuestUsername] = useState<string>('');

  // Test API connection on startup
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection...');
        const isHealthy = await authApi.checkHealth();
        console.log('API health check result:', isHealthy);
      } catch (error) {
        console.error('API health check failed:', error);
      }
    };
    
    testApiConnection();
  }, []);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={(type, username) => {
      if (type === 'guest' && username) {
        guestSignIn(username);
      }
      setLoginType(type);
      setGuestUsername(username || '');
      setGameState('welcome');
    }} />
  }
  
  const handleDownload = () => {
    // Go directly to home screen
    setGameState('home');
  };

  const navigate = (destination: string) => {
    if (destination === 'self-destruct') {
      // Reset all game state
      setGameState('welcome');
    } else {
      setGameState(destination);
    }
  };

  const handleOpenModule = (moduleName: string) => {
    navigate(moduleName);
  };

  // Render different components based on game state
  if (gameState === 'welcome') {
    return (
      <View className="flex-1">
        <DownloadScreen 
          type={loginType}
          guestUsername={guestUsername}
          onDownload={handleDownload}
        />        
      </View>
    );
  }

  if (gameState === 'home') {
    return (
      <View className="flex-1">
        <HomeScreen onOpenModule={handleOpenModule} />
      </View>
    );
  }

  // Handle special cases that need custom props
  if (gameState === 'system') {
    return (
      <View className="flex-1">
        <SystemModule 
          onGoHome={() => navigate('home')}
          onGoToAbout={() => navigate('about')}
          onGoToCoreVitals={() => navigate('core-vitals')}
          onSelfDestruct={() => navigate('self-destruct')}
        />         
      </View>
    );
  }

  if (gameState === 'about') {
    return (
      <View className="flex-1">
        <AboutScreen onGoBack={() => navigate('system')} />
      </View>
    );
  }

  if (gameState === 'core-vitals') {
    return (
      <View className="flex-1">
        <CoreVitalsScreen onGoBack={() => navigate('system')} />
      </View>
    );
  }

  // Handle all standard modules with a single pattern
  if (gameState in MODULE_COMPONENTS) {
    const ModuleComponent = MODULE_COMPONENTS[gameState as keyof typeof MODULE_COMPONENTS];
    return (
      <View className="flex-1">
        <ModuleComponent onGoHome={() => navigate('home')} />
      </View>
    );
  }

  return null;
}

export default function Index() {
  return (
    <InfectionProvider>
      <PuzzleProvider>
        <AppContent />
      </PuzzleProvider>
    </InfectionProvider>
  );
}
