import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface MapsModuleProps {
  onGoHome: () => void;
}

export default function MapsModule({ onGoHome }: MapsModuleProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('maps', completedPuzzles);

  useEffect(() => {
    const checkPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
        if (status !== 'granted') {
          setErrorMsg('Location permission denied');
      }
    } catch (error) {
        console.error('Failed to request location permissions:', error);
        setErrorMsg('Failed to request location permissions');
        setHasPermission(false);
    }
  };

    checkPermissions();
  }, []);

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('location_navigate')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const getCurrentLocation = async () => {
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
      playSound('sensor_activate');
      
      // Complete puzzle when location is obtained
      if (!puzzleComplete) {
        setPuzzleComplete(true);
        completePuzzle('location_navigate');
      }
    } catch (error) {
      console.error('Failed to get location:', error);
      setErrorMsg('Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCoordinates = (coords: Location.LocationObjectCoords) => {
    return {
      latitude: coords.latitude.toFixed(6),
      longitude: coords.longitude.toFixed(6),
      accuracy: coords.accuracy ? `${coords.accuracy.toFixed(1)}m` : 'Unknown',
    };
  };

  return (
      <ScreenTemplate 
        title="MAPS" 
      titleColor="blue" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
          <View className="flex flex-col space-y-4">
        {/* Maps Status */}
            <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MAPS STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">🗺️</Text>
            <Text className={`text-xl font-mono ${hasPermission ? 'text-blue-400' : 'text-red-400'}`}>
              {hasPermission ? 'ACTIVE' : 'INACTIVE'}
                  </Text>
            </View>

          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ LOCATION SERVICES ONLINE
              </Text>
            </View>
          )}
            </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
            <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-blue-400 text-sm font-mono mb-2">
              Test location services by getting your current coordinates
              </Text>
            </View>
        )}

            {/* Location Controls */}
            <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">LOCATION CONTROLS</Text>
                <TouchableOpacity
                  onPress={getCurrentLocation}
            disabled={!hasPermission || isLoading}
            className={`p-4 rounded-lg ${hasPermission && !isLoading ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
            <Text className="text-center font-mono text-lg">
              {isLoading ? 'GETTING LOCATION...' : 'GET CURRENT LOCATION'}
                  </Text>
                </TouchableOpacity>
        </View>

        {/* Location Display */}
        {location && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-4">CURRENT LOCATION</Text>
            <View className="space-y-2">
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Latitude:</Text>
                <Text className="text-blue-400 font-mono">{formatCoordinates(location.coords).latitude}</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Longitude:</Text>
                <Text className="text-blue-400 font-mono">{formatCoordinates(location.coords).longitude}</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Accuracy:</Text>
                <Text className="text-blue-400 font-mono">{formatCoordinates(location.coords).accuracy}</Text>
            </View>
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Altitude:</Text>
                <Text className="text-blue-400 font-mono">
                  {location.coords.altitude ? `${location.coords.altitude.toFixed(1)}m` : 'Unknown'}
              </Text>
              </View>
            </View>
          </View>
        )}

        {/* Error Display */}
        {errorMsg && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">ERROR</Text>
            <Text className="text-red-400 text-center font-mono text-sm">
              {errorMsg}
            </Text>
          </View>
        )}
      </View>
      </ScreenTemplate>
  );
} 