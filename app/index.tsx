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
  const [showRebootOverlay, setShowRebootOverlay] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const rebootOverlayOpacity = useRef(new Animated.Value(0)).current;

  // Debug log when reboot overlay state changes
  useEffect(() => {
    console.log('🔄 Reboot overlay state changed:', showRebootOverlay);
  }, [showRebootOverlay]);

  // Debug log when game state changes
  useEffect(() => {
    console.log('🎮 Game state changed to:', gameState);
  }, [gameState]);

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
    
    // The SystemCompromisedAnimation will call onDownload() when it completes
    // which will start the video playing
  };

  const handleVideoComplete = () => {
    // Video finished, but we're using overlay system
    // The reboot overlay should already be visible from handleVideoEnd
    // Just ensure it's shown
    console.log('🎬 Video completed - ensuring reboot overlay is visible');
    setShowRebootOverlay(true);
  };

  const handleRebootComplete = () => {
    // Reboot sequence finished, go to home screen
    console.log('🔄 Reboot sequence completed - going to home');
    setShowRebootOverlay(false);
    setGameState('home');
  };

  const handleDownloadComplete = () => {
    // Called when SystemCompromisedAnimation completes (1 second early)
    console.log('🎬 handleDownloadComplete called - starting video transition');
    console.log('🎬 Current state - isVideoBuffering:', isVideoBuffering, 'isVideoPlaying:', isVideoPlaying);
    
    // Fallback: if video doesn't start within 2 seconds, force the transition
    setTimeout(() => {
      if (!isVideoPlaying) {
        console.log('🎬 Fallback: forcing video transition after 2 seconds');
        setIsVideoPlaying(true);
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, 2000);
  };

  const handleVideoStart = () => {
    // Called when video actually starts playing
    console.log('🎬 handleVideoStart called - video is playing');
    setIsVideoPlaying(true);
    
    // Fade out the overlay smoothly
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 500, // 500ms fade
      useNativeDriver: true,
    }).start();
  };

  const handleVideoEnd = () => {
    // Called when video is about to end - show reboot overlay with fade
    console.log('🎬 Video ending - showing reboot overlay');
    console.log('🎬 Video will continue playing for 2 more seconds');
    setShowRebootOverlay(true);
    
    // Fade in the reboot overlay quickly while video continues
    Animated.timing(rebootOverlayOpacity, {
      toValue: 1,
      duration: 500, // 500ms fade (much faster to ensure it's visible)
      useNativeDriver: true,
    }).start();
  };

  const navigate = (destination: string) => {
    if (destination === 'self-destruct') {
      // Reset all game state
      setGameState('welcome');
    } else if (destination === 'home') {
      setGameState('home');
    } else {
      setGameState(destination);
    }
  };

  // Function to determine the correct "back" destination for modules
  const getBackDestination = (moduleName: string): string => {
    switch (moduleName) {
      case 'battery':
      case 'wifi':
      case 'about':
      case 'core-vitals':
        return 'system'; // Go back to system module
      default:
        return 'home'; // Default to home for other modules
    }
  };

  const handleOpenModule = (moduleName: string) => {
    navigate(moduleName);
  };

  // Render different components based on game state
  if (gameState === 'welcome') {
    return (
      <View className="flex-1">
        {/* Video Player - Rendered underneath when transitioning */}
        {(isVideoBuffering || isVideoPlaying) && (
          <>
            {console.log('🎬 Rendering VideoPlayer - isVideoBuffering:', isVideoBuffering, 'isVideoPlaying:', isVideoPlaying)}
            <VideoPlayer
              source={require('../assets/animations/Compromised_animation_HEV3.mp4')}
              onComplete={handleVideoComplete}
              onEnd={handleVideoEnd}
              duration={GAME_CONFIG.VIDEO_DURATION}
              onStart={handleVideoStart}
            />
          </>
        )}
        
        {/* DownloadScreen - Always visible, fades out when video starts */}
        <Animated.View 
          className="absolute inset-0 z-50"
          style={{ opacity: isVideoPlaying ? overlayOpacity : 1 }}
          pointerEvents={isVideoPlaying ? 'none' : 'auto'}
        >
          <DownloadScreen 
            type={loginType}
            guestUsername={guestUsername}
            onDownload={handleDownloadComplete}
            isVideoBuffering={isVideoBuffering}
            isVideoPlaying={isVideoPlaying}
          />
        </Animated.View>
        
        {/* RebootSequence Overlay - Fades in when video ends */}
        <Animated.View 
          className="absolute inset-0 z-40"
          style={{ opacity: rebootOverlayOpacity }}
        >
          {showRebootOverlay && <RebootSequence onComplete={handleRebootComplete} />}
        </Animated.View>
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
          onGoToBattery={() => navigate('battery')}
          onGoToWifi={() => navigate('wifi')}
        />         
      </View>
    );
  }

  // Handle all standard modules with a single pattern
  if (gameState in MODULE_COMPONENTS) {
    const ModuleComponent = MODULE_COMPONENTS[gameState as keyof typeof MODULE_COMPONENTS];
    return (
      <View className="flex-1">
        <ModuleComponent onGoHome={() => navigate(getBackDestination(gameState))} />
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
