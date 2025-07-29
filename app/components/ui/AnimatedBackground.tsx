import { BlurView } from 'expo-blur';
import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { Dimensions, Image, View, ViewStyle } from 'react-native';

interface AnimatedBackgroundProps {
  source: any; // Image or video source
  children: React.ReactNode;
  style?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  opacity?: number;
  isVideo?: boolean;
  shouldLoop?: boolean;
  shouldPlay?: boolean;
}

export default function AnimatedBackground({
  source,
  children,
  style,
  resizeMode = 'cover',
  opacity = 1,
  isVideo = false,
  shouldLoop = true,
  shouldPlay = true
}: AnimatedBackgroundProps) {
  const screenHeight = Dimensions.get('window').height;

  // Always call the hook, but only use it when isVideo is true
  const player = useVideoPlayer(source, player => {
    if (player && isVideo) {
      player.loop = shouldLoop;
      if (shouldPlay) {
        player.play();
      }
    }
  });

  // For video: simple video display
  if (isVideo) {
    return (
      <View style={[{ flex: 1, backgroundColor: 'black', height: screenHeight }, style]}>
        <VideoView
          player={player}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
        <BlurView intensity={15} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }} />
        {children}
      </View>
    );
  }

  // For image: simple image display
  return (
    <View style={[{ flex: 1, backgroundColor: 'black' }, style]}>
      <Image
        source={source}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode={resizeMode}
      />
      {children}
    </View>
  );
} 