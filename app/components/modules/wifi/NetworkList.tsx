import { Text, View } from 'react-native';

interface NetworkInfo {
  name: string;
  strength: number;
  security: string;
  frequency: string;
  channel: number;
}

interface NetworkListProps {
  networks: NetworkInfo[];
}

export default function NetworkList({ networks }: NetworkListProps) {
  if (networks.length === 0) {
    return (
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-blue-400 font-mono text-lg mb-2">AVAILABLE NETWORKS</Text>
        <Text className="text-gray-400 font-mono">No networks found</Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-blue-400 font-mono text-lg mb-2">AVAILABLE NETWORKS</Text>
      
      <View className="space-y-2">
        {networks.map((network, index) => (
          <View key={index} className="border-b border-gray-700 pb-2 last:border-b-0">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-white font-mono text-base">{network.name}</Text>
              <Text className={`font-mono text-sm ${getSignalColor(network.strength)}`}>
                {network.strength}%
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400 font-mono text-sm">
                {network.security} • {network.frequency}
              </Text>
              <Text className="text-gray-400 font-mono text-sm">
                Ch: {network.channel}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const getSignalColor = (strength: number): string => {
  if (strength >= 80) return 'text-green-400';
  if (strength >= 60) return 'text-yellow-400';
  if (strength >= 40) return 'text-orange-400';
  return 'text-red-400';
}; 