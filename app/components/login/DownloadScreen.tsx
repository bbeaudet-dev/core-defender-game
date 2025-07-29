import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { TYPOGRAPHY } from '../../data/fonts';
import { playSound } from '../../utils/soundManager';
import AnimatedBackground from '../ui/AnimatedBackground';
import SystemCompromisedAnimation from './SystemCompromisedAnimation';

interface WelcomeGameScreenProps {
  type: 'signup' | 'signin' | 'guest';
  guestUsername: string;
  onDownload: () => void;
  isVideoBuffering?: boolean;
  isVideoPlaying?: boolean; // New prop
}

export default function WelcomeGameScreen({ 
  type, 
  guestUsername, 
  onDownload, 
  isVideoBuffering = false,
  isVideoPlaying = false
}: WelcomeGameScreenProps) {
  const { user } = useAuth();
  const buttonRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textPulseAnim = useRef(new Animated.Value(1)).current;
  
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  
  // Get the appropriate username based on login type
  const getUsername = () => {
    if (type === 'guest') {
      return guestUsername;
    } else {
      return user?.name || 'User';
    }
  };

  // Pulsing animation for the button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // More intense pulsing animation for the text (reduced intensity)
  useEffect(() => {
    const textPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(textPulseAnim, {
          toValue: 1.45,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textPulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    textPulse.start();
    return () => textPulse.stop();
  }, []);

  // Fast pulsing animation for alarm text
  useEffect(() => {
    // This effect is no longer needed as alarmTextPulseAnim is removed
  }, []);

  const handleDownload = () => {
    // Enhanced alarm sequence
    setIsAlarmActive(true);
    playSound('ui_alert');
    
    // The SystemCompromisedAnimation will handle calling onDownload() when it completes
    // No need for a separate timer here
  };

  const getTitle = () => {
    switch (type) {
      case 'signup':
        return 'ACCESS_GRANTED';
      case 'signin':
        return 'ACCESS_GRANTED';
      case 'guest':
        return 'GUEST_ACCESS';
      default:
        return 'ACCESS_GRANTED';
    }
  };

  const getMessage = () => {
    const username = getUsername();
    switch (type) {
      case 'signup':
        return `Welcome to the system, ${username}.\nAccess granted to all modules.`;
      case 'signin':
        return `Welcome back, ${username}.`;
      case 'guest':
        return `Welcome, ${username}.\nAccess granted to all modules.`;
      default:
        return 'Operation completed successfully.';
    }
  };

  return (
    <AnimatedBackground 
      source={require('../../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg')}
      opacity={1.0}
      isVideo={false}
      shouldLoop={false}
      shouldPlay={false}
      resizeMode="cover"
    >
      {/* System Compromised Animation */}
      {isAlarmActive && (
        <SystemCompromisedAnimation 
          onComplete={() => {
            // Don't reset alarm state - keep button in compromised state
            // setIsAlarmActive(false); // REMOVED - keep compromised state
            onDownload();
          }}
          isVideoBuffering={isVideoBuffering}
          isVideoPlaying={isVideoPlaying}
        />
      )}
      
      <View className="flex-1 px-10 justify-center">
        {/* Welcome Section */}
        <View className="items-center mb-12">
          <View className="bg-black/80 py-4 px-5 rounded-lg border border-green-400">
            <Text className="text-2xl font-bold text-green-400 text-center mb-2">
              {getTitle()}
            </Text>
            
            <Text className="text-white text-center leading-6 text-md">
              {getMessage()}
            </Text>
          </View>
        </View>

        {/* Game Menu Section */}
        <View className="items-center">
          <View className="items-center mb-8">
            <Text className={`${TYPOGRAPHY.TITLE} text-green-400 text-2xl mb-2 pt-5`}>CORE DEFENDER</Text>
            <Text className="text-lg text-gray-400">Defend the Digital Realm</Text>
          </View>
          
          <View className="items-center mb-8">
            <Text className="text-center text-gray-300 mb-6 leading-6">
              Experience the ultimate tower defense game! 
              Build powerful defenses and protect your digital core from waves of malicious invaders.
            </Text>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }], position: 'relative' }}>
            <TouchableOpacity 
              className="px-8 py-4 rounded-lg mb-6 bg-green-600"
              onPress={handleDownload}
              // isAlarmActive is removed, so this line is no longer needed
            >
                <Animated.View style={{ transform: [{ scale: textPulseAnim }] }}>
                  <Text className="text-white font-bold text-lg text-center">
                    DOWNLOAD NOW
                  </Text>
                </Animated.View>
                <Text className="text-white text-sm text-center mt-1">
                  Free • 4.8★ • 10M+ Downloads
                </Text>
            </TouchableOpacity>
            </Animated.View>
            
            <View className="items-center">
              <Text className="text-gray-400 mb-2">🎮 50+ Levels</Text>
              <Text className="text-gray-400 mb-2">⚡ Real-time Strategy</Text>
              <Text className="text-gray-400 mb-2">🏆 Global Leaderboards</Text>
              <Text className="text-gray-400 mb-2">🎨 Stunning Graphics</Text>
            </View>
          </View>
        </View>
      </View>
    </AnimatedBackground>
  );
} 