import { Text, TouchableOpacity, View } from 'react-native';

interface DangerZoneSectionProps {
  onSelfDestruct: () => void;
}

export default function DangerZoneSection({ onSelfDestruct }: DangerZoneSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">DANGER ZONE</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-red-500" onPress={onSelfDestruct}>
        <Text className="text-red-400 text-base">Self-Destruct</Text>
        <Text className="text-red-400 text-sm">TERMINATE DEVICE</Text>
      </TouchableOpacity>
    </View>
  );
} 