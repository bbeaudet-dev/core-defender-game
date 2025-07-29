import { Text, TouchableOpacity, View } from 'react-native';

export default function HardwareSection() {
  return (
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">HARDWARE</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Gyroscope</Text>
        <Text className="text-gray-400 text-sm">ONLINE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Microphone</Text>
        <Text className="text-gray-400 text-sm">STANDBY</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Camera</Text>
        <Text className="text-gray-400 text-sm">OFFLINE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">GPS</Text>
        <Text className="text-gray-400 text-sm">ACTIVE</Text>
      </TouchableOpacity>
    </View>
  );
} 