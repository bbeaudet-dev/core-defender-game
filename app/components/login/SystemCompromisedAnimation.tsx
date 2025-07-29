import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { GAME_CONFIG } from '../../lib/config';
import { playSound } from '../../utils/soundManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SystemCompromisedAnimationProps {
  onComplete: () => void;
  isVideoBuffering?: boolean;
  onVideoBufferingComplete?: () => void; // Add callback to manage buffering state
}

export default function SystemCompromisedAnimation({ 
  onComplete, 
  isVideoBuffering = false,
  onVideoBufferingComplete 
}: SystemCompromisedAnimationProps) {
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSystemCompromiseAnimation();
  }, []);

  const startSystemCompromiseAnimation = () => {
    // Play alarm sound immediately
    playSound('ui_alert');
    
    // Play system failure sound
    playSound('puzzle_fail');
    
    // Start flashing red lights (reduced intensity)
    const flashSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    flashSequence.start();

    // Play additional alarm sounds for dramatic effect
    setTimeout(() => {
      playSound('ui_alert');
    }, 800);
    
    setTimeout(() => {
      playSound('ui_alert');
    }, 1600);
    
    setTimeout(() => {
      playSound('ui_alert');
    }, 2400);

    // Complete animation after the configured alarm duration
    setTimeout(() => {
      flashSequence.stop();
      
      // Stop video buffering and complete the transition
      if (onVideoBufferingComplete) {
        onVideoBufferingComplete();
      }
      
      onComplete();
    }, GAME_CONFIG.ALARM_DURATION);
  };

  return (
    <View className="absolute inset-0 z-50">
      {/* Flashing red overlay */}
      <Animated.View 
        className="absolute inset-0 bg-red-600"
        style={{ opacity: flashOpacity }}
      />

      {/* Video buffering indicator */}
      {isVideoBuffering && (
        <View className="absolute inset-0 justify-center items-center">
          <View className="bg-black/80 px-6 py-4 rounded-lg border border-red-400">
            <Text className="text-red-400 text-lg font-bold text-center mb-2">
              DOWNLOADING VIRUS
            </Text>
          </View>
        </View>
      )}
    </View>
  );
} 