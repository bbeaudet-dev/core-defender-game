import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';

import GyroPlot from '../ui/LiveDataPlot';
import ScreenTemplate from '../ui/ScreenTemplate';

interface GyroModuleProps {
  onGoHome: () => void;
}

export default function GyroModule({ onGoHome }: GyroModuleProps) {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [currentAngularVelocity, setCurrentAngularVelocity] = useState(0);
  const [maxAngularVelocity, setMaxAngularVelocity] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [angularVelocityHistory, setAngularVelocityHistory] = useState<number[]>([]);

  // Puzzle completion state
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('gyro', completedPuzzles, false);

  const UNLOCK_THRESHOLD = 40; // deg/s
  const HISTORY_LENGTH = 50; // Reduced from 200 to prevent memory issues

  useEffect(() => {
    checkGyroscopeAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (completedPuzzles.includes('gyroscope_rotation') && !puzzleComplete) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles, puzzleComplete]);

  const checkGyroscopeAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsAvailable(false);
        setError('Gyroscope not available on web');
        return;
      }

      const isAvailable = await Gyroscope.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Gyroscope not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check gyroscope availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    // Play sensor activation sound
    playSound('sensor_activate');

    setSubscription(
      Gyroscope.addListener((data) => {
        setGyroscopeData(data);
        
        // Calculate angular velocity magnitude (degrees/second)
        const angularVelocity = Math.sqrt(
          data.x * data.x + 
          data.y * data.y + 
          data.z * data.z
        );
        setCurrentAngularVelocity(angularVelocity);
        
        setAngularVelocityHistory(prev => {
          const next = [...prev, angularVelocity];
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
        });

        // Update max angular velocity
        setMaxAngularVelocity(prevMax => {
          if (angularVelocity > prevMax) {
            if (angularVelocity >= UNLOCK_THRESHOLD && !isUnlocked) {
              setIsUnlocked(true);
              completePuzzle('gyroscope_rotation');
            }
            return angularVelocity;
          }
          return prevMax;
        });
      })
    );
    Gyroscope.setUpdateInterval(100); // 10Hz
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const toggleGyroscope = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const resetMaxAngularVelocity = () => {
    setMaxAngularVelocity(0);
    setIsUnlocked(false);
    setAngularVelocityHistory([]);
  };

  return (
    <>
      <ScreenTemplate 
        title="GYRO" 
        titleColor="green" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
        {!isAvailable ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-400 text-center font-mono mb-4">
              {error || 'Gyroscope not available'}
            </Text>
            <Text className="text-gray-400 text-center font-mono text-sm">
              Try on a physical device
            </Text>
          </View>
        ) : (
          <>
            <View className="space-y-4">
              {/* Angular Velocity Display Components */}
              {/* Current Angular Velocity */}
              <View className="bg-gray-900 p-4 rounded-lg my-1">
                <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT ANGULAR VELOCITY</Text>
                <Text className="text-green-400 text-3xl font-mono">
                  {currentAngularVelocity.toFixed(1)}°/s
                </Text>
              </View>

              {/* Max Angular Velocity */}
              <View className="bg-gray-900 p-4 rounded-lg my-1">
                <Text className="text-gray-400 text-sm font-mono mb-2">MAX. ANGULAR VELOCITY</Text>
                <Text className="text-blue-400 text-3xl font-mono">
                  {maxAngularVelocity.toFixed(1)}°/s
                </Text>
              </View>

             
        

              {/* Angular Velocity Plot Component */}
              <GyroPlot 
                speedHistory={angularVelocityHistory} 
                maxSpeed={maxAngularVelocity} 
                historyLength={HISTORY_LENGTH}
                unitType="deg/s"
                title="ANGULAR VELOCITY PLOT"
                color="green"
              />
              
              {/* Raw Data */}
              <View className="bg-gray-900 p-4 rounded-lg flex flex-row justify-between my-1">
                <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA (deg/s)</Text>
                <Text className="text-gray-300 text-sm font-mono">X: {gyroscopeData.x.toFixed(2)}</Text>
                <Text className="text-gray-300 text-sm font-mono">Y: {gyroscopeData.y.toFixed(2)}</Text>
                <Text className="text-gray-300 text-sm font-mono">Z: {gyroscopeData.z.toFixed(2)}</Text>
              </View>

              {/* Controls Component */}
              <View className="space-y-3 flex flex-row justify-between">
                <TouchableOpacity
                  onPress={toggleGyroscope}
                  className={`p-3 rounded-lg flex-1 mr-2 ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
                >
                  <Text className="text-white text-center font-mono">
                    {subscription ? 'STOP' : 'START'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={resetMaxAngularVelocity}
                  className="bg-gray-700 p-3 rounded-lg flex-1 ml-2"
                >
                  <Text className="text-white text-center font-mono">RESET MAX</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScreenTemplate>
    </>
  );
} 