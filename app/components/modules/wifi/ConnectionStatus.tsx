import { Text, View } from 'react-native';

interface ConnectionStatusType {
  isConnected: boolean;
  networkName: string;
  ipAddress: string;
  signalStrength: number;
}

interface ConnectionStatusProps {
  connection: ConnectionStatusType;
}

const getSignalColor = (strength: number): string => {
  if (strength >= 80) return 'text-green-400';
  if (strength >= 60) return 'text-yellow-400';
  if (strength >= 40) return 'text-orange-400';
  return 'text-red-400';
};

const getSignalBars = (strength: number): string => {
  if (strength >= 80) return '████';
  if (strength >= 60) return '███░';
  if (strength >= 40) return '██░░';
  if (strength >= 20) return '█░░░';
  return '░░░░';
};

export default function ConnectionStatus({ connection }: ConnectionStatusProps) {
  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-blue-400 font-mono text-lg mb-2">CONNECTION STATUS</Text>
      
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-mono">Status:</Text>
          <Text className={`font-mono ${connection.isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {connection.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </Text>
        </View>
        
        {connection.isConnected && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-gray-400 font-mono">Network:</Text>
              <Text className="text-white font-mono">{connection.networkName}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-400 font-mono">IP Address:</Text>
              <Text className="text-white font-mono">{connection.ipAddress}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-400 font-mono">Signal:</Text>
              <Text className={`font-mono ${getSignalColor(connection.signalStrength)}`}>
                {connection.signalStrength}% {getSignalBars(connection.signalStrength)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
} 