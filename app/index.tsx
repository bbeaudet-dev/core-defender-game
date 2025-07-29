import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import HomeScreen from './components/home/HomeScreen';
import DownloadScreen from './components/login/DownloadScreen';
import LoginScreen from './components/login/LoginScreen';
import RebootSequence from './components/login/RebootSequence';
import SystemModule from './components/modules/about/System/SystemModule';
import VideoPlayer from './components/ui/VideoPlayer';
import { useAuth } from './contexts/AuthContext';
import { InfectionProvider } from './contexts/InfectionContext';
import { PuzzleProvider } from './contexts/PuzzleContext';
import { MODULE_COMPONENTS } from './data/components';
import { authApi } from './lib/auth';
import { GAME_CONFIG } from './lib/config';
import { LoginType } from './types/auth';

function AppContent() {
  const { isAuthenticated, user, guestSignIn } = useAuth();
  const [gameState, setGameState] = useState('welcome');
  const [loginType, setLoginType] = useState<LoginType>('signin');
  const [guestUsername, setGuestUsername] = useState<string>('');
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [showRebootOverlay, setShowRebootOverlay] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(1)).current;

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
    // Start buffering the video immediately when download is pressed
    setIsVideoBuffering(true);
    setIsAlarmActive(true); // Set alarm state for smooth transition
    
    // The SystemCompromisedAnimation will call onDownload() when it completes
    // which will transition to the video state and stop buffering
  };

  const handleVideoComplete = () => {
    // Video finished, go to reboot sequence
    setGameState('reboot');
  };

  const handleRebootComplete = () => {
    // Reboot sequence finished, go to home screen
    setGameState('home');
  };

  const handleDownloadComplete = () => {
    // Called when SystemCompromisedAnimation completes
    setIsVideoBuffering(false);
    setGameState('video');
    // Don't reset isAlarmActive - keep the alarm state for smooth transition
  };

  const handleVideoStart = () => {
    // Called when video actually starts playing
    setIsVideoPlaying(true);
    
    // Fade out the overlay smoothly
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 500, // 500ms fade
      useNativeDriver: true,
    }).start();
  };

  const handleVideoEnd = () => {
    // Called when video is about to end - show reboot overlay
    setShowRebootOverlay(true);
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
          onDownload={handleDownloadComplete}
          isVideoBuffering={isVideoBuffering}
        />        
      </View>
    );
  }

  if (gameState === 'video') {
    return (
      <View className="flex-1">
        {/* Video Player - Always rendered underneath */}
        <VideoPlayer
          source={require('../assets/animations/Compromised_animation_HEV.mp4')}
          onComplete={handleVideoComplete}
          onEnd={handleVideoEnd}
          duration={GAME_CONFIG.VIDEO_DURATION}
          onStart={handleVideoStart}
        />
        
        {/* DownloadScreen Overlay - Fades out when video starts */}
        <Animated.View 
          className="absolute inset-0 z-50"
          style={{ opacity: overlayOpacity }}
          pointerEvents={isVideoPlaying ? 'none' : 'auto'}
        >
          <DownloadScreen 
            type={loginType}
            guestUsername={guestUsername}
            onDownload={handleDownloadComplete}
            isVideoBuffering={isVideoBuffering}
            isAlarmActive={isAlarmActive}
          />
        </Animated.View>
        
        {/* RebootSequence Overlay - Fades in when video ends */}
        <Animated.View 
          className="absolute inset-0 z-40"
          style={{ opacity: showRebootOverlay ? 1 : 0 }}
        >
          <RebootSequence onComplete={handleRebootComplete} />
        </Animated.View>
      </View>
    );
  }

  if (gameState === 'reboot') {
    return (
      <View className="flex-1">
        <RebootSequence onComplete={handleRebootComplete} />
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
