import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { GAME_CONFIG } from '../../lib/config';
import { playSound } from '../../utils/soundManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SystemCompromisedAnimationProps {
  onComplete: () => void;
  isVideoBuffering?: boolean;
  isVideoPlaying?: boolean; // New prop to control button pulsing
}

export default function SystemCompromisedAnimation({ 
  onComplete, 
  isVideoBuffering = false,
  isVideoPlaying = false
}: SystemCompromisedAnimationProps) {
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const textPulseAnim = useRef(new Animated.Value(1)).current; // New text pulse animation
  const buttonPulseSequenceRef = useRef<Animated.CompositeAnimation | null>(null);
  const flashSequenceRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    startSystemCompromiseAnimation();
  }, []);

  // Stop animations when video starts playing
  useEffect(() => {
    if (isVideoPlaying) {
      console.log('🎬 Video started - stopping alarm animations');
      if (buttonPulseSequenceRef.current) {
        buttonPulseSequenceRef.current.stop();
      }
      if (flashSequenceRef.current) {
        flashSequenceRef.current.stop();
      }
    }
  }, [isVideoPlaying]);

  // Start the system compromise animation
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
    flashSequenceRef.current = flashSequence; // Assign to ref
    flashSequence.start();

    // Start button pulsing animation
    const buttonPulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    buttonPulseSequenceRef.current = buttonPulseSequence; // Assign to ref
    buttonPulseSequence.start();

    // Start text pulsing animation (more intense than button)
    const textPulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(textPulseAnim, {
          toValue: 1.2, // More intense than button (1.1)
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textPulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    textPulseSequence.start();

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

    // Call onComplete BEFORE the full alarm duration ends
    // This creates an overlap between alarm and video transition
    setTimeout(() => {
      // Don't stop animations - let them continue until video starts
      console.log('🚨 Alarm calling onComplete 1 second early');
      onComplete(); // Call onComplete early to start video transition
    }, GAME_CONFIG.ALARM_DURATION - 1000); // 1 second before alarm ends
  };

  return (
    <View className="absolute inset-0 z-50">
      {/* Flashing red overlay */}
      <Animated.View 
        className="absolute inset-0 bg-red-600"
        style={{ opacity: flashOpacity }}
      />

      {/* Alarm Button Overlay - Appears over the download button */}
      <View className="absolute inset-0 justify-center items-center">
        <Animated.View 
          style={{ 
            transform: [{ scale: buttonPulseAnim }],
            position: 'absolute',
            bottom: 278, // Covers the download button
          }}
          className="bg-red-600 px-10 py-8 rounded-lg"
        >
          <Animated.Text 
            style={{ transform: [{ scale: textPulseAnim }] }}
            className="text-white font-bold text-lg text-center"
          >
            ⚠️SYSTEM COMPROMISED⚠️
          </Animated.Text>
          <Text className="text-white text-sm text-center mt-1">
            BREACH DETECTED
          </Text>
        </Animated.View>
      </View>

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