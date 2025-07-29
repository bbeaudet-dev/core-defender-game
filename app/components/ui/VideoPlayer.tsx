import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { GAME_CONFIG } from '../../lib/config';

interface VideoPlayerProps {
  source: any;
  onComplete: () => void;
  onStart?: () => void; // Callback when video starts playing
  onEnd?: () => void; // Callback when video is about to end
  duration?: number; // Duration in milliseconds (fallback)
  videoAspectRatio?: number; // width/height ratio (e.g., 9/16 = 0.5625)
}

export default function VideoPlayer({ 
  source, 
  onComplete, 
  onStart,
  onEnd,
  duration = GAME_CONFIG.VIDEO_DURATION, // Fallback duration
  videoAspectRatio = 9/16 // Default to 9:16 aspect ratio
}: VideoPlayerProps) {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const endTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  
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
      
      // Get the actual video duration when the player is ready
      const getVideoDuration = async () => {
        try {
          // Try to get duration immediately, no delay
          if (player.duration) {
            const durationMs = player.duration * 1000; // Convert to milliseconds
            console.log(`🎬 Actual video duration: ${player.duration}s (${durationMs}ms)`);
            setActualDuration(durationMs);
            setIsVideoLoaded(true);
          } else {
            console.log(`🎬 Could not get video duration, using fallback: ${duration}ms`);
            setActualDuration(duration);
            setIsVideoLoaded(true);
          }
        } catch (error) {
          console.log(`🎬 Error getting video duration, using fallback: ${duration}ms`, error);
          setActualDuration(duration);
          setIsVideoLoaded(true);
        }
      };
      
      getVideoDuration();
      player.play();
      
      // Notify that video has started playing - use useEffect to avoid render phase updates
      if (onStart) {
        // Use setTimeout to defer the callback to the next tick
        setTimeout(() => {
          onStart();
        }, 0);
      }
    }
  });

  // Set up timers when actual duration is available
  useEffect(() => {
    if (!isVideoLoaded || !actualDuration) return;
    
    // Clear any existing timers
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
    }
    
    // Call onEnd 1 second before video completion
    if (onEnd) {
      endTimerRef.current = setTimeout(() => {
        console.log(`🎬 Video ending (1000ms before completion at ${actualDuration}ms)`);
        onEnd();
      }, actualDuration - 1000);
    }
    
    // Call onComplete when video should finish
    completeTimerRef.current = setTimeout(() => {
      console.log(`🎬 Video playback completed at ${actualDuration}ms`);
      onComplete();
    }, actualDuration);
    
    // Cleanup function
    return () => {
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
      }
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
      }
    };
  }, [actualDuration, isVideoLoaded, onEnd, onComplete]);

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