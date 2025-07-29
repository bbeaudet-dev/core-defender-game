import { Text, TouchableOpacity, View } from 'react-native';

export default function SystemSection() {
  return (
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">SYSTEM</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Emergency Mode</Text>
        <Text className="text-gray-400 text-sm">ENABLED</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Auto-Destruct</Text>
        <Text className="text-gray-400 text-sm">ARMED</Text>
      </TouchableOpacity>
    </View>
  );
} 