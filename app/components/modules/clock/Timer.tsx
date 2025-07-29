import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 10) {
            setIsActive(false);
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  const handleSetTime = () => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const totalMs = (mins * 60 + secs) * 1000;
    setTimeLeft(totalMs);
    setTotalTime(totalMs);
    setIsActive(false);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <View className="bg-gray-900 p-3 rounded-lg my-1">
      <Text className="text-gray-400 text-xs font-mono mb-2">TIMER</Text>
      
      {/* Time Display */}
      <Text className="text-yellow-400 text-2xl font-mono text-center mb-3">
        {formatTime(timeLeft)}
      </Text>
      
      {/* Progress Bar */}
      <View className="bg-gray-700 rounded-full h-2 mb-3">
        <View 
          className="bg-yellow-400 rounded-full h-2"
          style={{ width: `${progress}%` }}
        />
      </View>
      
      {/* Time Input */}
      <View className="flex-row justify-center space-x-2 mb-3">
        <TextInput
          className="bg-gray-800 text-white text-center p-2 rounded-lg w-16"
          placeholder="M"
          placeholderTextColor="#666"
          value={minutes}
          onChangeText={setMinutes}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text className="text-white text-lg">:</Text>
        <TextInput
          className="bg-gray-800 text-white text-center p-2 rounded-lg w-16"
          placeholder="S"
          placeholderTextColor="#666"
          value={seconds}
          onChangeText={setSeconds}
          keyboardType="numeric"
          maxLength={2}
        />
        <TouchableOpacity
          className="px-3 py-2 bg-blue-500 rounded-lg"
          onPress={handleSetTime}
        >
          <Text className="text-white text-sm font-bold">SET</Text>
        </TouchableOpacity>
      </View>
      
      {/* Controls */}
      <View className="flex-row justify-center space-x-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
          onPress={toggleTimer}
          disabled={timeLeft === 0}
        >
          <Text className="text-white text-sm font-bold">
            {isActive ? 'PAUSE' : 'START'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="px-4 py-2 bg-gray-600 rounded-lg"
          onPress={resetTimer}
        >
          <Text className="text-white text-sm font-bold">RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 