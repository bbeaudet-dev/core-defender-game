import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../data/fonts';
import { playSound } from '../../utils/soundManager';

interface FinalBossAppIconProps {
  onPress: () => void;
  status?: 'completed' | 'in-progress' | 'locked' | 'default';
  isFinalBossDefeated?: boolean;
  showUnlockAnimation?: boolean;
}

// Generate corrupted name for locked apps (same as AppIconWithHalo)
const generateCorruptedName = (name: string): string => {
  const corruptedChars = ['@', '#', '$', '%', '&', '*', '!', '?'];
  return name.split('').map(char => 
    Math.random() > 0.8 ? corruptedChars[Math.floor(Math.random() * corruptedChars.length)] : char
  ).join('');
};

export default function FinalBossAppIcon({ 
  onPress, 
  status = 'locked',
  isFinalBossDefeated = false,
  showUnlockAnimation = false 
}: FinalBossAppIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [corruptedName, setCorruptedName] = useState('CORE');

  // Update corrupted name every 0.1 seconds for locked modules
  useEffect(() => {
    if (status === 'locked') {
      const interval = setInterval(() => {
        setCorruptedName(generateCorruptedName('CORE'));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setCorruptedName('CORE');
    }
  }, [status]);

  // Unlock animation
  useEffect(() => {
    if (showUnlockAnimation) {
      const sequence = Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
      sequence.start();
    }
  }, [showUnlockAnimation, scaleAnim]);

  // Continuous glow animation
  useEffect(() => {
    const glowSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowSequence.start();

    return () => glowSequence.stop();
  }, [glowAnim]);

  const handlePress = () => {
    if (status !== 'locked') {
      playSound('ui_app_launch');
      onPress();
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'completed':
        return isFinalBossDefeated ? 'bg-green-600' : 'bg-blue-600';
      case 'in-progress':
        return 'bg-red-600';
      case 'locked':
        return 'bg-gray-700'; // Same as AppIconWithHalo
      default:
        return 'bg-red-600';
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'completed':
        return '#10B981'; // Green glow
      case 'in-progress':
        return '#3B82F6'; // Blue glow
      case 'locked':
        return '#EF4444'; // Red glow
      default:
        return '#6B7280'; // Gray glow
    }
  };

  const getOpacity = () => {
    if (status === 'locked') return 'opacity-70';
    return '';
  };

  const getDisplayIcon = () => {
    return status === 'locked' ? '👾' : '👁️‍🗨️';
  };

  const getDisplayName = () => {
    return status === 'locked' ? corruptedName : 'CORE';
  };

  const getTextColor = () => {
    return status === 'locked' ? 'text-red-500' : 'text-white';
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className="w-full"
    >
      <View className="items-center relative w-full">
        {/* Static border */}
        <View className="border-2 border-gray-600 rounded-lg p-0.5 w-[95%] flex-row justify-center">
          {/* Glowing border */}
          <Animated.View
            className="absolute rounded-lg"
            style={{
              top: 0,
              bottom: 0,
              left: '2.5%', // Center the glow within the 95% width
              right: '2.5%',
              shadowColor: getGlowColor(),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 15],
              }),
              elevation: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 10],
              }),
            }}
          />
          
          <TouchableOpacity 
            className={`w-[95%] h-20 ${getBackgroundColor()} justify-center items-center rounded-lg relative ${getOpacity()}`}
            onPress={handlePress}
            disabled={status === 'locked'}
          >
            {/* Icon */}
            <Text className="text-3xl mb-2">{getDisplayIcon()}</Text>
            
            {/* App name */}
            <Text 
              className={`text-sm font-bold text-center ${getTextColor()}`}
              style={{ fontFamily: FONTS.GLITCH }}
            >
              {getDisplayName()}
            </Text>
            
            {/* Status text */}
            <Text 
              className={`text-xs text-center mt-1 ${getTextColor()}`}
              style={{ fontFamily: FONTS.TERMINAL }}
            >
              {status === 'locked' ? 'LOCKED' : 
               isFinalBossDefeated ? 'DEFEATED' : 'FINAL BOSS'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
} 