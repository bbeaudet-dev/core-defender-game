import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { GAME_CONFIG } from '../../lib/config';

interface VideoPlayerProps {
  source: any;
  onComplete: () => void;
  onStart?: () => void; // Callback when video starts playing
  onEnd?: () => void; // Callback when video is about to end
  duration?: number; // Duration in milliseconds
  videoAspectRatio?: number; // width/height ratio (e.g., 9/16 = 0.5625)
}

export default function VideoPlayer({ 
  source, 
  onComplete, 
  onStart,
  onEnd,
  duration = GAME_CONFIG.VIDEO_DURATION, // Use shared constant
  videoAspectRatio = 9/16 // Default to 9:16 aspect ratio
}: VideoPlayerProps) {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate width needed to fill full screen height while maintaining video aspect ratio
  // This will make the video touch top and bottom, even if width extends beyond screen
  const calculateVideoWidth = () => {
    // We want video height to be exactly screen height
    const videoHeight = screenHeight;
    
    // Calculate the width needed for this height while maintaining aspect ratio
    // For 9:16 video, aspect ratio is 9/16 = 0.5625
    // So width = height * (9/16) = height * 0.5625
    const videoWidth = videoHeight * videoAspectRatio;
    
    return videoWidth;
  };
  
  const videoWidth = calculateVideoWidth();
  
  // Debug logging for video dimensions
  console.log(`📱 Screen: ${screenWidth}x${screenHeight}`);
  console.log(`🎬 Video: ${videoAspectRatio.toFixed(3)} ratio → ${videoWidth.toFixed(0)}px width`);
  console.log(`📐 Width extends beyond screen by: ${((videoWidth - screenWidth) / screenWidth * 100).toFixed(1)}%`);
  
  const player = useVideoPlayer(source, player => {
    if (player) {
      player.loop = false;
      player.play();
      
      // Notify that video has started playing
      if (onStart) {
        // Small delay to ensure video is actually playing
        setTimeout(() => {
          onStart();
        }, 100);
      }
    }
  });

  // Complete when video duration is reached
  useEffect(() => {
    // Call onEnd slightly before video ends for smooth transition
    if (onEnd) {
      const endTimer = setTimeout(() => {
        onEnd();
      }, duration - 500); // 500ms before end
      
      return () => clearTimeout(endTimer);
    }
  }, [duration, onEnd]);

  // Complete when video duration is reached
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🎬 Video playback completed');
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <View className="flex-1 bg-black" style={{ height: screenHeight }}>
      {/* Video Player - Full height, calculated width, centered */}
      <VideoView
        player={player}
        style={{
          position: 'absolute',
          top: 0,
          left: -(videoWidth - screenWidth) / 2, // Center the video horizontally
          width: videoWidth,
          height: screenHeight, // Full screen height
        }}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      
      {/* Overlay to prevent video controls */}
      <TouchableWithoutFeedback
        onPress={() => {}} // No-op to prevent touch events from reaching video
      >
        <View 
          className="absolute inset-0"
          style={{ 
            backgroundColor: 'transparent',
            zIndex: 10, // Ensure it's above the video
          }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
} 