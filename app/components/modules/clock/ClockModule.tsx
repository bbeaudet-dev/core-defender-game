import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';
import RealClock from './RealClock';
import Stopwatch from './Stopwatch';
import Timer from './Timer';

interface ClockModuleProps {
  onGoHome: () => void;
}

type ClockMode = 'clock' | 'stopwatch' | 'timer';

export default function ClockModule({ onGoHome }: ClockModuleProps) {
  const [currentMode, setCurrentMode] = useState<ClockMode>('clock');
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('clock', completedPuzzles, false);
  
  // Puzzle completion via sync button
  const handleSync = () => {
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('clock_sync');
      playSound('puzzle_complete');
    }
  };

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('clock_sync')) {
      setPuzzleComplete(true);
    }

    // Update current time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [puzzleComplete, completedPuzzles]);

  const handleModeChange = (mode: ClockMode) => {
    setCurrentMode(mode);
    playSound('click');
  };



  return (
    <ScreenTemplate 
      title="CLOCK" 
      titleColor="yellow" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Mode Selector */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-3">CLOCK MODES</Text>
          <View className="flex flex-row space-x-2">
            <TouchableOpacity
              onPress={() => handleModeChange('clock')}
              className={`flex-1 p-3 rounded-lg ${currentMode === 'clock' ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center font-mono text-sm">CLOCK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleModeChange('stopwatch')}
              className={`flex-1 p-3 rounded-lg ${currentMode === 'stopwatch' ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center font-mono text-sm">STOPWATCH</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleModeChange('timer')}
              className={`flex-1 p-3 rounded-lg ${currentMode === 'timer' ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center font-mono text-sm">TIMER</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Time Display */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">CURRENT TIME</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl font-mono text-yellow-400">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ TIME SYNCHRONIZATION COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-yellow-400 text-sm font-mono mb-2">
              Synchronize system clock by pressing the sync button
            </Text>
            <TouchableOpacity
              onPress={handleSync}
              className="mt-4 p-4 bg-yellow-600 rounded-lg"
            >
              <Text className="text-white font-bold text-center font-mono">
                🔄 SYNC CLOCK
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mode Content */}
        <View className="bg-gray-900 p-6 rounded-lg">
          {currentMode === 'clock' && <RealClock />}
          {currentMode === 'stopwatch' && <Stopwatch />}
          {currentMode === 'timer' && <Timer />}
        </View>
      </View>
    </ScreenTemplate>
  );
} 