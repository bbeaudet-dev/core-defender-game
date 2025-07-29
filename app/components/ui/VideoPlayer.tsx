import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import { Dimensions, View } from 'react-native';

interface VideoPlayerProps {
  source: any;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export default function VideoPlayer({ 
  source, 
  onComplete, 
  duration = 5000 // Default 5 seconds
}: VideoPlayerProps) {
  const screenHeight = Dimensions.get('window').height;
  
  const player = useVideoPlayer(source, player => {
    if (player) {
      player.loop = false;
      player.play();
    }
  });

  // Auto-complete after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🎬 Video playback completed (timeout)');
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <View className="flex-1 bg-black" style={{ height: screenHeight }}>
      {/* Video Player - Full height with aspect ratio maintained */}
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
      
      {/* Transparent overlay to prevent video controls */}
      <View 
        className="absolute inset-0"
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
} 