import {
    AudioRecorder,
    requestRecordingPermissionsAsync,
    setAudioModeAsync
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import ScreenTemplate from '../../ui/ScreenTemplate';
import AudioLevelIndicator from './AudioLevelIndicator';
import AudioWaveform from './AudioWaveform';

interface MicrophoneModuleProps {
  onGoHome: () => void;
}

export default function MicrophoneModule({ onGoHome }: MicrophoneModuleProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [maxAudioLevel, setMaxAudioLevel] = useState(0);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const animationRef = useRef(new Animated.Value(0)).current;
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('microphone', completedPuzzles, false);

  // Puzzle threshold: reach 80% audio level
  const AUDIO_THRESHOLD = 0.8;

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await requestRecordingPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
          });
        }
      } catch (error) {
        console.error('Failed to request recording permissions:', error);
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('microphone_level')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  useEffect(() => {
    // Update max audio level and check puzzle completion
    if (audioLevel > maxAudioLevel) {
      setMaxAudioLevel(audioLevel);
      // Only complete puzzle if recording and threshold is reached
      if (!puzzleComplete && isRecording && audioLevel >= AUDIO_THRESHOLD) {
        setPuzzleComplete(true);
        completePuzzle('microphone_level');
      }
    }
  }, [audioLevel, maxAudioLevel, puzzleComplete, isRecording]);

  const startRecording = async () => {
    if (!hasPermission) return;

    try {
      setIsRecording(true);
      // Simulate audio level changes for demo
      const interval = setInterval(() => {
        const newLevel = Math.random() * 1.0;
        setAudioLevel(newLevel);
        animationRef.setValue(newLevel);
      }, 100);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setAudioLevel(0);
      animationRef.setValue(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const resetAudioLevel = () => {
    setMaxAudioLevel(0);
      setAudioLevel(0);
    animationRef.setValue(0);
    };

  return (
      <ScreenTemplate 
        title="MICROPHONE" 
      titleColor="blue" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
      <View className="flex flex-col space-y-4">
        {/* Microphone Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MICROPHONE STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">{isRecording ? '🎤' : '🎙️'}</Text>
            <Text className={`text-xl font-mono ${isRecording ? 'text-blue-400' : 'text-gray-400'}`}>
              {isRecording ? 'RECORDING' : 'STANDBY'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ AUDIO DETECTION COMPLETE
              </Text>
              </View>
          )}
            </View>
            
        {/* Audio Level Display */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">AUDIO LEVEL</Text>
          <AudioLevelIndicator audioLevel={audioLevel} audioLevelAnim={animationRef} />
          <Text className="text-center text-gray-300 font-mono mt-2">
            Current: {Math.round(audioLevel * 100)}%
          </Text>
          <Text className="text-center text-gray-300 font-mono">
            Max: {Math.round(maxAudioLevel * 100)}%
                </Text>
            </View>

        {/* Audio Waveform */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">AUDIO WAVEFORM</Text>
          <AudioWaveform audioLevel={audioLevel} />
        </View>
      </View>

        {/* Controls */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">CONTROLS</Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-lg ${isRecording ? 'bg-red-600' : 'bg-blue-600'}`}
            >
              <Text className="text-center font-mono text-lg">
                {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={resetAudioLevel}
              className="p-3 bg-gray-700 rounded-lg"
            >
              <Text className="text-center font-mono text-sm text-gray-300">
                RESET AUDIO LEVEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScreenTemplate>
  );
} 