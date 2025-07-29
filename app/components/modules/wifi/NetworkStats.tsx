import { Text, View } from 'react-native';

interface NetworkInfo {
  name: string;
  strength: number;
  security: string;
  frequency: string;
  channel: number;
}

interface NetworkStatsProps {
  networks: NetworkInfo[];
}

export default function NetworkStats({ networks }: NetworkStatsProps) {
  if (networks.length === 0) return null;

  const totalNetworks = networks.length;
  const avgStrength = Math.round(networks.reduce((sum, net) => sum + net.strength, 0) / totalNetworks);
  const secureNetworks = networks.filter(net => net.security !== 'Open').length;
  const fiveGHzNetworks = networks.filter(net => net.frequency === '5GHz').length;

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-blue-400 font-mono text-lg mb-2">NETWORK STATISTICS</Text>
      
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-mono">Total Networks:</Text>
          <Text className="text-white font-mono">{totalNetworks}</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-mono">Avg Signal:</Text>
          <Text className={`font-mono ${getSignalColor(avgStrength)}`}>{avgStrength}%</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-mono">Secure Networks:</Text>
          <Text className="text-white font-mono">{secureNetworks}/{totalNetworks}</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-mono">5GHz Networks:</Text>
          <Text className="text-white font-mono">{fiveGHzNetworks}/{totalNetworks}</Text>
        </View>
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