import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Text, View } from 'react-native';
import { FONTS } from '../../data/fonts';
import { playSound } from '../../utils/soundManager';

interface RebootSequenceProps {
  onComplete: () => void;
}

export default function RebootSequence({ onComplete }: RebootSequenceProps) {
  const [displayedSteps, setDisplayedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const rebootSteps = [
    "REBOOTING IN EMERGENCY MODE...",
    "INITIALIZING CORE SYSTEM...",
    "ASSESSING SYSTEM HEALTH:",
    "INEFECTION DETECTED - SYSTEM CRITICAL",
    "MANUAL RESTORATION REQUIRED",
    "GOOD LUCK SOLDIER"
  ];

  useEffect(() => {
    // Start the reboot sequence
    startRebootSequence();
  }, []);

  // Watch for step changes and progress automatically
  useEffect(() => {
    if (currentStep < rebootSteps.length) {
      // Add current step to display
      setDisplayedSteps(prev => [...prev, rebootSteps[currentStep]]);
      
      // Schedule next step
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      
      return () => clearTimeout(timer);
    } else if (currentStep === rebootSteps.length) {
      // All steps complete, wait then transition
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onComplete();
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, rebootSteps.length, fadeAnim, onComplete]);

  const startRebootSequence = () => {
    // Play reboot sound
    playSound('ui_app_launch');
    
    // Fade in the background
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1">
      {/* Background image */}
      <ImageBackground 
        source={require('../../../assets/images/red frame.png')}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 justify-center items-center px-8">
          {/* Terminal output container */}
          <View className="bg-black/80 p-6 rounded-lg border border-red-400 max-w-md">
            {/* Terminal header */}
            <Text className="text-red-400 text-sm font-mono mb-4">
              CORE_DEFENDER://reboot/emergency
            </Text>
            
            {/* Terminal messages */}
            <View className="space-y-2">
              {displayedSteps.map((step, index) => (
                <Text 
                  key={index}
                  className="text-red-400 text-sm font-mono"
                  style={{ fontFamily: FONTS.TERMINAL }}
                >
                  {`> ${step}`}
                </Text>
              ))}
              
              {/* Final cursor */}
              {currentStep >= rebootSteps.length && (
                <Text 
                  className="text-red-400 text-sm font-mono"
                  style={{ fontFamily: FONTS.TERMINAL }}
                >
                  {'>'} SYSTEM READY
                </Text>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
} 