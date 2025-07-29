import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  visibility: number;
}

interface WeatherModuleProps {
  onGoHome: () => void;
}

export default function WeatherModule({ onGoHome }: WeatherModuleProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('weather', completedPuzzles, false);

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('weather_check')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    playSound('sensor_activate');
    
    try {
      // Simulate weather API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)],
        icon: ['☀️', '☁️', '🌧️', '⛈️'][Math.floor(Math.random() * 4)],
        feelsLike: Math.floor(Math.random() * 30) + 10,
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        visibility: Math.floor(Math.random() * 10) + 5, // 5-15 km
      };
      
      setWeather(mockWeatherData);
      setLastUpdated(new Date());
      
      // Complete puzzle when weather data is fetched
      if (!puzzleComplete) {
        setPuzzleComplete(true);
        completePuzzle('weather_check');
        playSound('puzzle_complete');
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'Sunny': return 'text-yellow-400';
      case 'Cloudy': return 'text-gray-400';
      case 'Rainy': return 'text-blue-400';
      case 'Stormy': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  return (
      <ScreenTemplate 
        title="WEATHER" 
      titleColor="yellow" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
      <View className="flex flex-col space-y-4">
        {/* Weather Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">WEATHER STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">🌤️</Text>
            <Text className="text-xl font-mono text-yellow-400">
              {weather ? 'ACTIVE' : 'STANDBY'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ WEATHER SYSTEMS ONLINE
              </Text>
            </View>
          )}
        </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-yellow-400 text-sm font-mono mb-2">
              Test weather monitoring by fetching current weather data
            </Text>
          </View>
        )}

        {/* Weather Controls */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">WEATHER CONTROLS</Text>
            <TouchableOpacity
            onPress={fetchWeatherData}
            disabled={isLoading}
            className={`p-4 rounded-lg ${isLoading ? 'bg-gray-600' : 'bg-yellow-600'}`}
            >
            <Text className="text-center font-mono text-lg">
              {isLoading ? 'FETCHING WEATHER...' : 'FETCH WEATHER DATA'}
            </Text>
            </TouchableOpacity>
          </View>

        {/* Weather Display */}
        {weather && (
            <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-4">CURRENT WEATHER</Text>
            <View className="space-y-4">
              {/* Main Weather Info */}
              <View className="flex flex-row items-center justify-center">
                <Text className="text-6xl mr-4">{weather.icon}</Text>
                <View>
                  <Text className="text-3xl font-mono text-yellow-400">
                    {weather.temperature}°C
                  </Text>
                  <Text className={`text-lg font-mono ${getWeatherColor(weather.condition)}`}>
                    {weather.condition}
                  </Text>
                </View>
              </View>

              {/* Weather Details */}
              <View className="space-y-2">
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Feels Like:</Text>
                  <Text className="text-yellow-400 font-mono">{weather.feelsLike}°C</Text>
            </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Humidity:</Text>
                  <Text className="text-blue-400 font-mono">{weather.humidity}%</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Pressure:</Text>
                  <Text className="text-green-400 font-mono">{weather.pressure} hPa</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Wind Speed:</Text>
                  <Text className="text-purple-400 font-mono">{weather.windSpeed} km/h</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Visibility:</Text>
                  <Text className="text-cyan-400 font-mono">{weather.visibility} km</Text>
                </View>
              </View>

              {/* Last Updated */}
              {lastUpdated && (
                <Text className="text-center text-gray-500 font-mono text-xs">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                        </Text>
              )}
            </View>
          </View>
        )}
      </View>
      </ScreenTemplate>
  );
} 