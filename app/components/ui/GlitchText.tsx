import { Canvas, FontStyle, Group, Mask, Rect, Skia, Text } from '@shopify/react-native-skia';
import { useCallback, useEffect, useState } from 'react';
import { Text as RNText, View } from 'react-native';
import { SharedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { FONTS } from '../../data/fonts';

// Predefined color schemes for glitch effects
export const GLITCH_COLOR_SCHEMES = {
  default: { primary: '#E5484D', secondary: '#12A594' },      // Red & Green
  cyberpunk: { primary: '#3B82F6', secondary: '#8B5CF6' },    // Blue & Purple - contrasts with green/red
  neon: { primary: '#F97316', secondary: '#06B6D4' },         // Orange & Cyan - vibrant against green
  retro: { primary: '#EAB308', secondary: '#EC4899' },        // Yellow & Magenta
  matrix: { primary: '#10B981', secondary: '#059669' },       // Green & Dark Green
  synthwave: { primary: '#F59E0B', secondary: '#EC4899' },    // Amber & Pink - warm against cool green
  hologram: { primary: '#8B5CF6', secondary: '#06B6D4' },     // Purple & Cyan - ethereal effect
  glitch: { primary: '#EF4444', secondary: '#3B82F6' },       // Red & Blue - classic glitch
  electric: { primary: '#10B981', secondary: '#F59E0B' },     // Green & Amber - monochromatic
  neonPulse: { primary: '#06B6D4', secondary: '#8B5CF6' },    // Cyan & Purple - cool tones
  retroWave: { primary: '#F59E0B', secondary: '#DC2626' },    // Amber & Red - warm against green
  digital: { primary: '#6B7280', secondary: '#F3F4F6' },      // Gray & Light Gray - neutral
  matrixSubtle: { primary: '#059669', secondary: '#10B981' }, // Dark Green & Green - subtle
} as const;

export type GlitchColorScheme = keyof typeof GLITCH_COLOR_SCHEMES;

interface GlitchTextProps {
  text?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  animationSpeed?: number;
  animationInterval?: number;
  animationInterval2?: number;
  primaryColor?: string;
  secondaryColor?: string;
  colorScheme?: GlitchColorScheme;
  baseColor?: string;
  opacity?: number;
  fontFamily?: string;
  style?: any;
  textAlign?: 'left' | 'center' | 'right';
  wordList?: string[];
  baseWord?: string;
  wordColors?: { [key: string]: string };
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export default function GlitchText({
  text = 'CORE_ACCESS',
  fontSize = 32,
  width: propWidth,
  height: propHeight,
  animationSpeed = 100,
  animationInterval = 1800,
  animationInterval2 = 800,
  primaryColor,
  secondaryColor,
  colorScheme = 'default',
  baseColor = 'white',
  opacity = 0.9,
  fontFamily = FONTS.GLITCH,
  style,
  textAlign,
  wordList,
  baseWord,
  wordColors,
  onAnimationStart,
  onAnimationEnd
}: GlitchTextProps) {
  // Use color scheme if no custom colors provided
  const scheme = GLITCH_COLOR_SCHEMES[colorScheme];
  const finalPrimaryColor = primaryColor || scheme.primary;
  const finalSecondaryColor = secondaryColor || scheme.secondary;
  // Use baseWord if provided, otherwise use text
  const actualBaseWord = baseWord || text;
  
  const [currentText, setCurrentText] = useState(actualBaseWord);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isShowingBaseWord, setIsShowingBaseWord] = useState(true);

  // Function to get next word from list
  const getNextWord = useCallback(() => {
    if (wordList && wordList.length > 0) {
      const nextIndex = (currentWordIndex + 1) % wordList.length;
      setCurrentWordIndex(nextIndex);
      return wordList[nextIndex];
    }
    return text;
  }, [wordList, currentWordIndex, text]);

  // Function to get current word color
  const getCurrentWordColor = useCallback(() => {
    if (wordColors && currentText && wordColors[currentText]) {
      return wordColors[currentText];
    }
    return baseColor;
  }, [wordColors, currentText, baseColor]);

  // Calculate the longest word for consistent centering
  const getLongestWord = useCallback(() => {
    if (wordList && wordList.length > 0) {
      return wordList.reduce((longest, current) => 
        current.length > longest.length ? current : longest, wordList[0]);
    }
    return text;
  }, [wordList, text]);

  // Use provided dimensions or default to screen dimensions
  const canvasWidth = propWidth || 400;
  const canvasHeight = propHeight || 200;

  const fontMgr = Skia.FontMgr.System();

  // Try to use the specified font family first, then fall back to system fonts
  let typeface = null;
  
  // Try the specified font family
  if (fontFamily) {
    typeface = fontMgr.matchFamilyStyle(fontFamily, FontStyle.Normal);
  }
  
  // Fallback to specific Orbitron variants that are definitely available
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Orbitron-Regular', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Orbitron-Bold', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Orbitron-Medium', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Orbitron', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('OCR-A', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('SpaceMono', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Arial', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Helvetica', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('System', FontStyle.Normal);
  }
  if (!typeface) {
    // Final fallback to default
    typeface = fontMgr.matchFamilyStyle('', FontStyle.Normal);
  }

  const font = Skia.Font(typeface, fontSize);
  const lineHeightDifference = 2;

  const textHeight = font.measureText(currentText).height;
  const textWidth = font.measureText(currentText).width;

  // Calculate text position based on alignment
  let textX: number;
  if (textAlign === 'center') {
    textX = canvasWidth / 2 - textWidth / 2;
  } else if (textAlign === 'right') {
    textX = canvasWidth - textWidth;
  } else {
    // Default to left alignment
    textX = 0;
  }
  
  const textY = canvasHeight / 2 + textHeight - lineHeightDifference;
  
  const rectX = textX;
  const rectWidth = textWidth;
  const fullRectHeight = textHeight;

  const proportion = 1 / 3;
  const rectHeight = fullRectHeight * proportion;

  const topRectY = canvasHeight / 2;
  const middleRectY = canvasHeight / 2 + rectHeight;
  const bottomRectY = canvasHeight / 2 + rectHeight * 2;
  
  const renderMask = (rectXSv: SharedValue<number>, rectY: number, maskHeight: number) => (
    <Group>
      <Rect color="white" height={maskHeight} width={rectWidth} x={rectXSv} y={rectY} />
    </Group>
  );

  const renderText = (
    rectXSv: SharedValue<number>,
    rectY: number,
    maskHeight: number = rectHeight,
  ) => (
    <Mask mode="luminance" mask={renderMask(rectXSv, rectY, maskHeight)}>
      <Text color={getCurrentWordColor()} font={font} text={currentText} x={rectXSv} y={textY} opacity={opacity} />
    </Mask>
  );

  const topHalfX = useSharedValue(rectX);
  const middleHalfX = useSharedValue(rectX);
  const bottomHalfX = useSharedValue(rectX);
  const redTextX = useSharedValue(rectX);
  const greenTextX = useSharedValue(rectX);

  const withAnimation = (offsets: number[], isReversed: boolean = false) => {
    const animations = offsets.map((offset) => {
      const finalOffset = isReversed ? -offset : offset;
      return withTiming(rectX + finalOffset, { duration: animationSpeed });
    });
    animations.push(withTiming(rectX, { duration: animationSpeed }));
    return withSequence(...animations);
  };

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    
    // Call animation start callback for background effects
    if (onAnimationStart) {
      onAnimationStart();
    }
    
    // Determine if this is the reversed animation (second interval)
    const isReversed = !isShowingBaseWord;
    
    // Start the glitch animation
    topHalfX.value = withAnimation([-8, -6, -4, 5], isReversed);
    middleHalfX.value = withAnimation([-6, -4, 5, -2], isReversed);
    bottomHalfX.value = withAnimation([-4, 5, -2, 2], isReversed);

    redTextX.value = withAnimation([-2, 5, -4, -6], isReversed);
    greenTextX.value = withAnimation([2, -2, 5, -4], isReversed);

    // Change text halfway through the animation
    setTimeout(() => {
      if (wordList && wordList.length > 0) {
        if (isShowingBaseWord) {
          // Switch to list word
          setCurrentText(getNextWord());
          setIsShowingBaseWord(false);
        } else {
          // Switch back to base word
          setCurrentText(actualBaseWord);
          setIsShowingBaseWord(true);
        }
      } else {
        // For single words, just toggle the state to create 2-phase effect
        setIsShowingBaseWord(!isShowingBaseWord);
      }
    }, animationSpeed * 2);

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, animationSpeed * 4);
  }, [animationSpeed, rectX, wordList, getNextWord, onAnimationStart, onAnimationEnd, isShowingBaseWord, actualBaseWord]);

  useEffect(() => {
    // Use both intervals for 2-phase animation
    const currentInterval = isShowingBaseWord ? animationInterval : animationInterval2;
    const interval = setInterval(() => {
      triggerAnimation();
    }, currentInterval);
    return () => clearInterval(interval);
  }, [triggerAnimation, animationInterval, animationInterval2, isShowingBaseWord]);

  if (!typeface || textHeight === 0 || textWidth === 0) {
    const fallbackTypeface = fontMgr.matchFamilyStyle('', FontStyle.Normal);
    const fallbackFont = Skia.Font(fallbackTypeface, fontSize);
    
    return (
      <View style={[{ width: canvasWidth, height: canvasHeight, justifyContent: 'center', alignItems: 'center' }, style]}>
        <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
          <Text
            x={textX}
            y={textY}
            text={currentText}
            color={baseColor}
            font={fallbackFont}
          />
        </Canvas>
        {/* Fallback text in case Skia fails completely */}
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
          <RNText style={{ 
            color: baseColor, 
            fontSize: fontSize, 
            fontFamily: fontFamily,
            textAlign: textAlign || 'center',
            opacity: opacity
          }}>
            {currentText}
          </RNText>
        </View>
      </View>
    );
  }

  return (
    <View style={[{ width: '100%', overflow: 'hidden' }, style]}>
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        <Text color={finalPrimaryColor} font={font} text={currentText} x={redTextX} y={textY} opacity={0.6} />
        <Text color={finalSecondaryColor} font={font} text={currentText} x={greenTextX} y={textY} opacity={0.6} />
        {renderText(topHalfX, topRectY)}
        {renderText(middleHalfX, middleRectY)}
        {renderText(bottomHalfX, bottomRectY, fullRectHeight)}
      </Canvas>
    </View>
  );
} 