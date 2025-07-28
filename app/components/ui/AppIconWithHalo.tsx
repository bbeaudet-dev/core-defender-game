import { useEffect, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { playSound } from '../../utils/soundManager';

// Preload the corruption image to prevent loading delay
const CORRUPTION_IMAGE = require('../../../assets/images/red_corruption_small.jpg');

interface AppIconWithHaloProps {
  icon: string;
  name: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  badge?: string | number;
  status?: 'completed' | 'in-progress' | 'locked' | 'default';
  showUnlockAnimation?: boolean;
  isFinalBossDefeated?: boolean;
}

// Generate corrupted name for locked apps
const generateCorruptedName = (name: string): string => {
  const corruptedChars = ['@', '#', '$', '%', '&', '*', '!', '?'];
  return name.split('').map(char => 
    Math.random() > 0.8 ? corruptedChars[Math.floor(Math.random() * corruptedChars.length)] : char
  ).join('');
};

export default function AppIconWithHalo({ 
  icon, 
  name, 
  color, 
  onPress, 
  disabled = false,
  style,
  badge,
  status = 'default',
  isFinalBossDefeated = false
}: AppIconWithHaloProps) {
  const [imageError, setImageError] = useState(false);
  const [glowAnimation] = useState(new Animated.Value(0));
  const [corruptedName, setCorruptedName] = useState(name);

  // Update corrupted name every 3 seconds for locked modules
  useEffect(() => {
    if (status === 'locked') {
      const interval = setInterval(() => {
        setCorruptedName(generateCorruptedName(name));
      }, 100); // Update every 0.25 seconds

      return () => clearInterval(interval);
    } else {
      setCorruptedName(name);
    }
  }, [status, name]);

  // Handle glow animation
  useEffect(() => {
    const glowSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowSequence.start();

    return () => glowSequence.stop();
  }, []);

  const handlePress = () => {
    if (!disabled && status !== 'locked') {
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
        return imageError ? 'bg-red-500' : 'bg-gray-700'; // Fallback for locked status
      default:
        return color;
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
    if (disabled) return 'opacity-50';
    if (status === 'locked') return 'opacity-70';
    return '';
  };

  // Get the appropriate icon and name based on status
  const getDisplayIcon = () => {
    return status === 'locked' ? '👾' : icon;
  };

  const getDisplayName = () => {
    return status === 'locked' ? corruptedName : name;
  };

  // Get text color based on status
  const getTextColor = () => {
    return status === 'locked' ? 'text-red-500' : 'text-white';
  };

  const renderIcon = () => (
    <View className="items-center relative">
      {/* Static border */}
      <View className="border-2 border-gray-600 rounded-lg p-0.5">
        {/* Glowing border */}
        <Animated.View
          className="absolute inset-0 rounded-lg"
          style={{
            shadowColor: getGlowColor(),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
            shadowRadius: glowAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 15],
            }),
            elevation: glowAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [5, 10],
            }),
          }}
        />
        
        <TouchableOpacity 
          className={`w-16 h-16 ${getBackgroundColor()} justify-center items-center rounded-lg relative ${getOpacity()}`}
          onPress={handlePress}
          disabled={disabled || status === 'locked'}
          style={style}
        >
          {/* Badge - only show for in-progress modules */}
          {badge && status === 'in-progress' && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
              <Text className="text-xs text-white font-bold">
                {badge}
              </Text>
            </View>
          )}
          
          {/* Icon */}
          <Text className="text-3xl">{getDisplayIcon()}</Text>  
        </TouchableOpacity>
      </View>
      
      {/* Name with flexible text size */}
      <Text 
        className={`text-xs font-bold text-center max-w-30 mt-1 ${getTextColor()}`}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {getDisplayName()}
      </Text>
    </View>
  );

  // Use corrupted background for locked status
  if (status === 'locked') {
    return (
      <View className="items-center relative">
        {/* Static border for locked apps */}
        <View className="border-2 border-red-600 rounded-lg p-0.5">
          {/* Glowing border for locked apps */}
          <Animated.View
            className="absolute inset-0 rounded-lg"
            style={{
              shadowColor: getGlowColor(),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              shadowRadius: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 15],
              }),
              elevation: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 10],
              }),
            }}
          />
          
          <View className="w-16 h-16 rounded-lg overflow-hidden">
            {!imageError ? (
              <Image
                source={CORRUPTION_IMAGE}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback background when image fails to load
              <View className="w-full h-full bg-red-500" />
            )}
            <TouchableOpacity 
              className="absolute inset-0 justify-center items-center"
              onPress={handlePress}
              disabled={disabled || status === 'locked'}
              style={style}
            >
              
              {/* Lock Icon */}
              <Text className="text-3xl">{getDisplayIcon()}</Text>  
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Name with flexible text size */}
        <Text 
          className={`text-xs font-bold text-center max-w-25 mt-1 ${getTextColor()}`}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {getDisplayName()}
        </Text>
      </View>
    );
  }

  return renderIcon();
} 