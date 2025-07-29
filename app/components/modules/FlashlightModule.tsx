import * as Brightness from 'expo-brightness';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface FlashlightModuleProps {
  onGoHome: () => void;
}

export default function FlashlightModule({ onGoHome }: FlashlightModuleProps) {
  const [isOn, setIsOn] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);
  const [morseSequence, setMorseSequence] = useState<string[]>([]);
  const [lastToggleTime, setLastToggleTime] = useState<number>(0);
  const originalBrightnessRef = useRef<number | null>(null);
  const sequenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('flashlight', completedPuzzles, false);

  // Morse code pattern for SOS: ... --- ...
  const SOS_PATTERN = ['short', 'short', 'short', 'long', 'long', 'long', 'short', 'short', 'short'];

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('flashlight_morse')) {
      setPuzzleComplete(true);
      }
  }, [completedPuzzles]);

  const toggleFlashlight = async () => {
    try {
      const newState = !isOn;
      setIsOn(newState);
      
      if (newState) {
        // Store original brightness and set to maximum
        if (originalBrightnessRef.current === null) {
          originalBrightnessRef.current = await Brightness.getBrightnessAsync();
        }
        await Brightness.setBrightnessAsync(1.0);
        playSound('sensor_activate');
      } else {
        // Restore original brightness
        if (originalBrightnessRef.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
        }
        playSound('click');
      }

      // Record the toggle for Morse code detection
      const currentTime = Date.now();
      const timeSinceLastToggle = currentTime - lastToggleTime;
      setLastToggleTime(currentTime);

      if (timeSinceLastToggle > 100) { // Debounce rapid toggles
        const duration = timeSinceLastToggle > 400 ? 'long' : 'short';
        setMorseSequence(prev => {
          const newSequence = [...prev, duration];
          
          // Keep only the last 9 elements (SOS pattern length)
          const trimmedSequence = newSequence.slice(-9);
          
          // Check if the pattern matches SOS
          if (trimmedSequence.length === 9 && 
              trimmedSequence.every((item, index) => item === SOS_PATTERN[index])) {
            if (!puzzleComplete) {
              setPuzzleComplete(true);
              completePuzzle('flashlight_morse');
            }
          }
          
          return trimmedSequence;
        });
      }
    } catch (error) {
      console.error('Failed to toggle flashlight:', error);
    }
  };

  const startSOSSequence = async () => {
    if (isSequenceRunning) {
      // Stop the sequence
      setIsSequenceRunning(false);
      if (sequenceIntervalRef.current) {
        clearInterval(sequenceIntervalRef.current);
        sequenceIntervalRef.current = null;
      }
      // Turn off flashlight and restore brightness
      if (isOn) {
        setIsOn(false);
        if (originalBrightnessRef.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
        }
      }
      return;
    }

    // Start the sequence
    setIsSequenceRunning(true);
    setMorseSequence([]);
    
    // Store original brightness if not already stored
    if (originalBrightnessRef.current === null) {
      originalBrightnessRef.current = await Brightness.getBrightnessAsync();
    }
    
    let step = 0;
    // Morse code pattern for SOS: ... --- ...
    // S = 3 short pulses, O = 3 long pulses
    const sequenceSteps = [
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 300, isOn: false },  // S: short off (300ms)
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 300, isOn: false },  // S: short off (300ms)
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 700, isOn: false },  // S: long off (700ms)
      { duration: 900, isOn: true },   // O: long on (900ms)
      { duration: 300, isOn: false },  // O: short off (300ms)
      { duration: 900, isOn: true },   // O: long on (900ms)
      { duration: 300, isOn: false },  // O: short off (300ms)
      { duration: 900, isOn: true },   // O: long on (900ms)
      { duration: 700, isOn: false },  // O: long off (700ms)
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 300, isOn: false },  // S: short off (300ms)
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 300, isOn: false },  // S: short off (300ms)
      { duration: 300, isOn: true },   // S: short on (300ms)
      { duration: 1500, isOn: false }, // S: long off (1500ms)
    ];

    const runSequence = async () => {
      if (step >= sequenceSteps.length) {
        // Sequence complete, restart
        step = 0;
        return;
      }

      const currentStep = sequenceSteps[step];
      
      // Actually change the screen brightness
      if (currentStep.isOn) {
        setIsOn(true);
        await Brightness.setBrightnessAsync(1.0);
        playSound('sensor_activate');
      } else {
        setIsOn(false);
        if (originalBrightnessRef.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
        }
        playSound('click');
      }

      step++;
    };
            
    // Run initial step
    await runSequence();
            
    // Set up interval for the sequence with proper timing
    const runNextStep = async () => {
      if (step < sequenceSteps.length) {
        const currentStep = sequenceSteps[step];
        await runSequence();
        
        // Schedule next step after the current duration
        sequenceIntervalRef.current = setTimeout(runNextStep, currentStep.duration);
      } else {
        // Restart sequence after a pause
        step = 0;
        setTimeout(runNextStep, 2000);
      }
    };
    
    // Start the sequence with proper timing
    sequenceIntervalRef.current = setTimeout(runNextStep, sequenceSteps[0].duration);
  };

  const resetMorseSequence = () => {
    setMorseSequence([]);
  };

  return (
    <ScreenTemplate 
      title="FLASHLIGHT" 
      titleColor="yellow" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Flashlight Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">FLASHLIGHT STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-6xl mr-4">{isOn ? '💡' : '🔦'}</Text>
            <Text className={`text-2xl font-mono ${isOn ? 'text-yellow-400' : 'text-gray-400'}`}>
              {isOn ? 'ILLUMINATED' : 'DARKNESS'}
          </Text>
        </View>

          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ SIGNAL TRANSMISSION COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Morse Code Interface */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MORSE CODE INTERFACE</Text>
          
          {/* Controls */}
          <View className="space-y-3">
          <TouchableOpacity
              onPress={toggleFlashlight}
              className={`p-4 rounded-lg ${isOn ? 'bg-red-600' : 'bg-green-600'}`}
          >
              <Text className="text-center font-mono text-lg text-white">
                {isOn ? 'TURN OFF' : 'TURN ON'}
            </Text>
          </TouchableOpacity>
            
          <TouchableOpacity
              onPress={startSOSSequence}
              className={`p-4 rounded-lg ${isSequenceRunning ? 'bg-red-600' : 'bg-blue-600'}`}
          >
              <Text className="text-center font-mono text-lg text-white">
                {isSequenceRunning ? 'STOP SEQUENCE' : 'START SEQUENCE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              onPress={resetMorseSequence}
              className="p-3 bg-gray-700 rounded-lg"
          >
              <Text className="text-center font-mono text-sm text-gray-300">
                RESET SEQUENCE
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
} 