import { Text, View } from 'react-native';

interface InfectionProgressBarProps {
  progress: number; // 0-100, where 100 is critical infection
  status: string;
}

const getStatusColor = (progress: number) => {
  if (progress >= 90) return 'text-red-500';
  if (progress >= 70) return 'text-orange-500';
  if (progress >= 50) return 'text-yellow-500';
  if (progress >= 30) return 'text-blue-500';
  if (progress >= 10) return 'text-green-500';
  return 'text-green-400';
};

const getBarColor = (progress: number) => {
  if (progress >= 90) return 'bg-red-600';
  if (progress >= 70) return 'bg-orange-600';
  if (progress >= 50) return 'bg-yellow-600';
  if (progress >= 30) return 'bg-blue-600';
  if (progress >= 10) return 'bg-green-600';
  return 'bg-green-500';
};

export default function InfectionProgressBar({ progress, status }: InfectionProgressBarProps) {
  const statusColor = getStatusColor(progress);
  const barColor = getBarColor(progress);

  return (
    <View className="absolute bottom-0 my-24 mx-10 left-0 right-0 bg-black border-t border-gray-800 p-4 rounded-xl">
      <Text className="text-red-500 text-sm font-mono mb-2">INFECTION STATUS: <Text className={`text-lg font-mono mb-3 ${statusColor}`}>{status}</Text></Text>
      
      <View className="bg-gray-800 h-3 rounded-full overflow-hidden">
        <View 
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
} 