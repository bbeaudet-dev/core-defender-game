import { View } from 'react-native';

interface AudioWaveformProps {
  audioLevel: number;
}

export default function AudioWaveform({ audioLevel }: AudioWaveformProps) {
  // Generate waveform bars based on audio level
  const generateWaveform = () => {
    const bars = 24; // Reduced from 48 for mobile
    const minBarHeight = 5;
    const maxBarHeight = 60;
    const adjustedAudio = Math.max(0, 60 + audioLevel); // 0 (silent) to 60 (loud)
    const normalized = Math.max(0, Math.min(1, adjustedAudio / 60));
    const waveform = [];
    
    for (let i = 0; i < bars; i++) {
      const randomFactor = Math.random() * 0.75 + 0.75;
      const barHeight = minBarHeight + normalized * (maxBarHeight - minBarHeight) * randomFactor;
      waveform.push(
        <View
          key={i}
          className="bg-green-400 rounded-sm mx-0.5"
          style={{
            width: 4,
            height: barHeight,
            marginTop: 5,
            marginBottom: 5,
            opacity: 0.8,
          }}
        />
      );
    }
    
    return waveform;
  };

  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <View className="flex-row justify-center items-center" style={{ height: 80 }}>
        {generateWaveform()}
      </View>
    </View>
  );
} 