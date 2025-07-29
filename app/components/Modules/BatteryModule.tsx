import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import ScreenTemplate from '../ui/ScreenTemplate';

interface BatteryModuleProps {
  onGoHome: () => void;
}

export default function BatteryModule({ onGoHome }: BatteryModuleProps) {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('battery', completedPuzzles, false);

  // Battery level threshold to unlock puzzle
  const UNLOCK_THRESHOLD = 0.5; // 50%

  useEffect(() => {
    const checkBatteryAvailability = async () => {
      try {
        const isAvailable = await Battery.isAvailableAsync();
        setIsAvailable(isAvailable);
        
        if (isAvailable) {
          // Get initial battery info
          const batteryLevel = await Battery.getBatteryLevelAsync();
          const batteryState = await Battery.getBatteryStateAsync();
          const isLowPowerMode = await Battery.isLowPowerModeEnabledAsync();
          
          setBatteryLevel(batteryLevel);
          setIsCharging(batteryState === Battery.BatteryState.CHARGING);
          setIsLowPowerMode(isLowPowerMode);
          
          // Check if puzzle should be completed
          if (batteryLevel >= UNLOCK_THRESHOLD && !puzzleComplete) {
            setPuzzleComplete(true);
            completePuzzle('battery_charge');
          }
          
          // Set up battery monitoring
          const batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(batteryLevel);
            
            // Check if puzzle should be completed
            if (batteryLevel >= UNLOCK_THRESHOLD && !puzzleComplete) {
              setPuzzleComplete(true);
              completePuzzle('battery_charge');
            }
          });
          
          const batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
            setIsCharging(batteryState === Battery.BatteryState.CHARGING);
          });
          
          const lowPowerSubscription = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
            setIsLowPowerMode(lowPowerMode);
          });
          
          return () => {
            batteryLevelSubscription?.remove();
            batteryStateSubscription?.remove();
            lowPowerSubscription?.remove();
          };
        }
      } catch (error) {
        console.error('Failed to check battery availability:', error);
        setIsAvailable(false);
      }
    };

    checkBatteryAvailability();
  }, [puzzleComplete]);

  const getBatteryColor = (level: number) => {
    if (level <= 0.2) return 'text-red-400';
    if (level <= 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBatteryIcon = (level: number) => {
    if (level <= 0.1) return '🔋';
    if (level <= 0.25) return '🪫';
    if (level <= 0.5) return '🔋';
    if (level <= 0.75) return '🔋';
    return '🔋';
  };

  return (
    <ScreenTemplate 
      title="BATTERY" 
      titleColor="green" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      {!isAvailable ? (
        <View className="flex-1 p-5 justify-center">
          <Text className="text-green-400 text-center text-base mb-2">Battery monitoring not available</Text>
        </View>
      ) : (
        <View className="flex flex-col space-y-4">
          {/* Battery Status */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-4">BATTERY STATUS</Text>
            <View className="flex flex-row items-center justify-center">
              <Text className="text-4xl mr-4">{getBatteryIcon(batteryLevel || 0)}</Text>
              <Text className={`text-4xl font-mono ${getBatteryColor(batteryLevel || 0)}`}>
                {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '--'}
              </Text>
            </View>
          </View>
          
          <View className="bg-gray-900 p-6 rounded-lg">
            <View className="space-y-2">
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Charging:</Text>
                <Text className={`font-mono ${isCharging ? 'text-green-400' : 'text-red-400'}`}>
                  {isCharging ? '⚡ JUICING UP' : '❌ UNPLUGGED'}
                </Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-gray-300 font-mono">Low Power Mode:</Text>
                <Text className={`font-mono ${isLowPowerMode ? 'text-gray-400' : 'text-yellow-400'}`}>
                  {isLowPowerMode ? '✅ ENABLED' : '⚠️ DISABLED'}
                </Text>
              </View>
            </View>
          </View>

          {/* Battery Health */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">BATTERY HEALTH</Text>
            <View className="w-full bg-gray-800 rounded-full h-4 mb-2">
              <View 
                className={`h-4 rounded-full ${getBatteryColor(batteryLevel || 0).replace('text-', 'bg-')}`}
                style={{ width: `${(batteryLevel || 0) * 100}%` }}
              />
            </View>
            <Text className="text-gray-300 text-xs font-mono text-center">
              {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '--'} remaining
            </Text>
          </View>
        </View>
      )}
    </ScreenTemplate>
  );
} 