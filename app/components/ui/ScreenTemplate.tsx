import React from 'react';
import { ImageBackground, View } from 'react-native';
import BatteryIndicator from './BatteryIndicator';
import HomeButton from './HomeButton';
import ModuleHeader from './ModuleHeader';

interface ScreenTemplateProps {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  showHomeButton?: boolean;
  onGoHome?: () => void;
  className?: string;
  backgroundImage?: any;
}

export default function ScreenTemplate({
  title,
  titleColor = 'blue',
  children,
  showHomeButton = true,
  onGoHome,
  className = '',
  backgroundImage
}: ScreenTemplateProps) {
  // Centralized padding control
  const SIDE_PADDING = 8; // 32px on each side
  const sidePaddingClass = `px-${SIDE_PADDING}`;

  const content = (
    <>
      {/* Top area with safe area margin */}
      <View className={`pt-12 ${sidePaddingClass}`}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1 items-start">
            <ModuleHeader name={title} color={titleColor} />
          </View>
          <View className="absolute right-0">
            <BatteryIndicator />
          </View>
        </View>
      </View>
      
      {/* Main content area */}
      <View className={`flex-1 ${sidePaddingClass} pb-20`}>
        {children}
      </View>
      
      {/* Home button */}
      {showHomeButton && onGoHome && (
        <HomeButton active={true} onPress={onGoHome} />
      )}
    </>
  );

  if (backgroundImage) {
    return (
      <ImageBackground 
        source={backgroundImage}
        className={`flex-1 ${className}`}
        resizeMode="cover"
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <View className={`flex-1 bg-red-950 ${className}`}>
      {content}
    </View>
  );
} 