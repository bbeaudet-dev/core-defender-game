import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Stopwatch() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
}

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleStopwatch = () => {
    setIsActive(!isActive);
  };

  const resetStopwatch = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const lapStopwatch = () => {
    if (isActive) {
      setLaps(prev => [...prev, time]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <View className="bg-gray-900 p-3 rounded-lg my-1">
      <Text className="text-gray-400 text-xs font-mono mb-2">STOPWATCH</Text>
      
      {/* Time Display */}
      <Text className="text-yellow-400 text-2xl font-mono text-center mb-3">
        {formatTime(time)}
      </Text>
      
      {/* Controls */}
      <View className="flex-row justify-center space-x-2 mb-3">
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
          onPress={toggleStopwatch}
        >
          <Text className="text-white text-xs font-bold">
            {isActive ? 'STOP' : 'START'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="px-4 py-2 bg-gray-600 rounded-lg"
          onPress={resetStopwatch}
        >
          <Text className="text-white text-sm font-bold">RESET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="px-4 py-2 bg-blue-500 rounded-lg"
          onPress={lapStopwatch}
          disabled={!isActive}
        >
          <Text className="text-white text-sm font-bold">LAP</Text>
        </TouchableOpacity>
      </View>
      
      {/* Laps */}
      {laps.length > 0 && (
        <View className="max-h-32">
          <Text className="text-gray-400 text-xs font-mono mb-2">LAPS</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {laps.map((lap, index) => (
              <View key={index} className="flex-row justify-between items-center py-1 border-b border-gray-700">
                <Text className="text-gray-300 text-xs font-mono">Lap {laps.length - index}</Text>
                <Text className="text-yellow-300 text-xs font-mono">{formatTime(lap)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
} 