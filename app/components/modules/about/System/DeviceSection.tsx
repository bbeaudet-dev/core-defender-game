import { Text, TouchableOpacity, View } from 'react-native';

interface DeviceSectionProps {
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
}

export default function DeviceSection({ onGoToAbout, onGoToCoreVitals }: DeviceSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">DEVICE</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700" onPress={onGoToAbout}>
        <Text className="text-white text-base">About</Text>
        <Text className="text-gray-400 text-sm">Core Defender v1.0.3</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700" onPress={onGoToCoreVitals}>
        <Text className="text-white text-base">Core Vitals</Text>
        <Text className="text-gray-400 text-sm">⚠️ Unstable</Text>
      </TouchableOpacity>
    </View>
  );
} 