import { ScrollView, Text, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface AboutScreenProps {
  onGoBack: () => void;
}

export default function AboutScreen({ onGoBack }: AboutScreenProps) {
  const { getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('system', completedPuzzles);

  return (
    <ScreenTemplate 
      title="ABOUT" 
      titleColor="red" 
      onGoHome={onGoBack}
      backgroundImage={backgroundImage}
    >
      <ScrollView className="flex-1">
        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">DEVICE INFO</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Model</Text>
            <Text className="text-gray-400 text-sm">Core Defender X1</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">OS Version</Text>
            <Text className="text-gray-400 text-sm">CoreOS v1.0.3</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Serial Number</Text>
            <Text className="text-gray-400 text-sm">CD-X1-2024-001</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Manufacturer</Text>
            <Text className="text-gray-400 text-sm">Spartan Systems</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">HARDWARE SPECS</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Processor</Text>
            <Text className="text-gray-400 text-sm">Quantum Core Q1</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Memory</Text>
            <Text className="text-gray-400 text-sm">16GB Neural RAM</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Storage</Text>
            <Text className="text-gray-400 text-sm">1TB Holographic</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Battery</Text>
            <Text className="text-gray-400 text-sm">Infinite Core</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">SENSORS & INPUTS</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Gyroscope</Text>
            <Text className="text-gray-400 text-sm">6-Axis Quantum</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Microphone</Text>
            <Text className="text-gray-400 text-sm">Neural Array</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Camera</Text>
            <Text className="text-gray-400 text-sm">Holographic Lens</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">GPS</Text>
            <Text className="text-gray-400 text-sm">Quantum Positioning</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Haptic Engine</Text>
            <Text className="text-gray-400 text-sm">Neural Feedback</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">SECURITY FEATURES</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Biometric</Text>
            <Text className="text-gray-400 text-sm">Neural Scan</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Encryption</Text>
            <Text className="text-gray-400 text-sm">Quantum Lock</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Firewall</Text>
            <Text className="text-gray-400 text-sm">Neural Barrier</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">SPECIAL FEATURES</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Voice Recognition</Text>
            <Text className="text-gray-400 text-sm">Neural AI</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Gesture Control</Text>
            <Text className="text-gray-400 text-sm">Motion Sense</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Time Awareness</Text>
            <Text className="text-gray-400 text-sm">Chronos Sync</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Location Triggers</Text>
            <Text className="text-gray-400 text-sm">Geo-Aware</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
} 