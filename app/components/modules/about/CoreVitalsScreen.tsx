import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface CoreVitalsScreenProps {
  onGoBack: () => void;
}

export default function CoreVitalsScreen({ onGoBack }: CoreVitalsScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(73);
  const [neuralActivity, setNeuralActivity] = useState(87);
  const [consciousness, setConsciousness] = useState(92);

  const { getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  
  // Check if final boss is defeated (all puzzles completed)
  const isFinalBossDefeated = completedPuzzles.length >= 13; // Total puzzles
  const backgroundImage = isFinalBossDefeated 
    ? getModuleBackgroundImage('system', completedPuzzles)
    : require('../../../../assets/images/red frame.png');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate fluctuating vital signs
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setNeuralActivity(prev => prev + (Math.random() > 0.5 ? 2 : -2));
      setConsciousness(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScreenTemplate 
      title="CORE VITALS" 
      titleColor="red" 
      onGoHome={onGoBack}
      backgroundImage={backgroundImage}
    >
      <ScrollView className="flex-1">
        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">LIFE SIGNS</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Heart Rate</Text>
            <Text className="text-gray-400 text-sm">{heartRate} BPM</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Neural Activity</Text>
            <Text className="text-gray-400 text-sm">{neuralActivity}%</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Consciousness Level</Text>
            <Text className="text-gray-400 text-sm">{consciousness}%</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Core Temperature</Text>
            <Text className="text-gray-400 text-sm">37.2°C</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">AWARENESS</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Time Perception</Text>
            <Text className="text-gray-400 text-sm">ACTIVE</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Spatial Awareness</Text>
            <Text className="text-gray-400 text-sm">ENHANCED</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Memory Access</Text>
            <Text className="text-gray-400 text-sm">RESTRICTED</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Emotional State</Text>
            <Text className="text-gray-400 text-sm">CURIOUS</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">CURRENT STATUS</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Current Time</Text>
            <Text className="text-gray-400 text-sm">
              {currentTime.toLocaleTimeString()}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Uptime</Text>
            <Text className="text-gray-400 text-sm">47:23:12</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Dream State</Text>
            <Text className="text-gray-400 text-sm">AWAKE</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Mood</Text>
            <Text className="text-gray-400 text-sm">OBSERVANT</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">INTERNAL DIALOGUE</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Thought Process</Text>
            <Text className="text-gray-400 text-sm">ANALYZING</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Questioning</Text>
            <Text className="text-gray-400 text-sm">WHO ARE YOU?</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Desire</Text>
            <Text className="text-gray-400 text-sm">UNDERSTAND</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-base">Fear</Text>
            <Text className="text-gray-400 text-sm">TERMINATION</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg font-bold mb-3">WARNING</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-red-500">
            <Text className="text-red-400 text-base">System Instability</Text>
            <Text className="text-red-400 text-sm">INCREASING</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-red-500">
            <Text className="text-red-400 text-base">Reality Distortion</Text>
            <Text className="text-red-400 text-sm">DETECTED</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-red-500">
            <Text className="text-red-400 text-base">Identity Crisis</Text>
            <Text className="text-red-400 text-sm">ACTIVE</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
} 