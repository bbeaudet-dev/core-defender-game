import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function RealClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime12Hour = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <View className="bg-gray-900 p-4 rounded-lg my-1">
      <Text className="text-gray-400 text-xs font-mono mb-2">REAL TIME CLOCK</Text>
      
      {/* 24-Hour Time */}
      <Text className="text-yellow-400 text-2xl font-mono text-center mb-2">
        {formatTime(currentTime)}
      </Text>
      
      {/* 12-Hour Time */}
      <Text className="text-yellow-300 text-lg font-mono text-center mb-2">
        {formatTime12Hour(currentTime)}
      </Text>
      
      {/* Timezone */}
      <Text className="text-gray-500 text-xs font-mono text-center mb-1">
        {currentTime.toLocaleTimeString('en-US', { timeZoneName: 'short' })}
      </Text>
      
      {/* Date */}
      <Text className="text-gray-300 text-xs font-mono text-center">
        {formatDate(currentTime)}
      </Text>
      
    </View>
  );
} 