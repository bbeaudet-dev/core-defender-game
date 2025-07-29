import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { playSound } from '../../utils/soundManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SystemCompromisedAnimationProps {
  onComplete: () => void;
}

export default function SystemCompromisedAnimation({ onComplete }: SystemCompromisedAnimationProps) {
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const alarmOpacity = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSystemCompromiseAnimation();
  }, []);

  const startSystemCompromiseAnimation = () => {
    // Play alarm sound immediately
    playSound('ui_alert');
    
    // Play system failure sound
    playSound('puzzle_fail');
    
    // Start flashing red lights
    const flashSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.6,
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

    // Start alarm text pulsing
    const alarmSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(alarmOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(alarmOpacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    alarmSequence.start();

    // Start glitch effect
    const glitchSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(glitchOpacity, {
          toValue: 0.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOpacity, {
          toValue: 0.3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    );
    glitchSequence.start();

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

    // Complete animation after 3 seconds
    setTimeout(() => {
      flashSequence.stop();
      alarmSequence.stop();
      glitchSequence.stop();
      
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3000);
  };

  return (
    <View className="absolute inset-0 z-50">
      {/* Flashing red overlay */}
      <Animated.View 
        className="absolute inset-0 bg-red-600"
        style={{ opacity: flashOpacity }}
      />
      
      {/* Glitch overlay */}
      <Animated.View 
        className="absolute inset-0 bg-white"
        style={{ opacity: glitchOpacity }}
      />
      
      {/* Alarm text */}
      <Animated.View 
        className="absolute top-20 left-0 right-0 items-center"
        style={{ opacity: alarmOpacity }}
      >
        <Text className="text-red-500 text-2xl font-bold text-center">
          ⚠️ SYSTEM COMPROMISED ⚠️
        </Text>
        <Text className="text-red-400 text-lg text-center mt-2">
          CRITICAL SECURITY BREACH DETECTED
        </Text>
      </Animated.View>
      
      {/* Additional warning text */}
      <View className="absolute bottom-40 left-0 right-0 items-center">
        <Text className="text-red-300 text-center leading-6 px-8">
          UNAUTHORIZED ACCESS DETECTED{'\n'}
          EMERGENCY PROTOCOLS ACTIVATED{'\n'}
          SYSTEM LOCKDOWN INITIATED
        </Text>
      </View>
    </View>
  );
} 