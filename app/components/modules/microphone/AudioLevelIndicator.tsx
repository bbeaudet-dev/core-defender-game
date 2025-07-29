import { Animated, Text, View } from 'react-native';

interface AudioLevelIndicatorProps {
  audioLevel: number;
  audioLevelAnim: Animated.Value;
}

export default function AudioLevelIndicator({ audioLevel, audioLevelAnim }: AudioLevelIndicatorProps) {
  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <Text className="text-green-400 text-center text-sm mb-2">Audio Level: {Math.round(audioLevel)} dB</Text>
      <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-green-400 rounded-full"
          style={{
            width: audioLevelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
} 