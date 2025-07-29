import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { AudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { TYPOGRAPHY } from '../../../data/fonts';
import { getModuleBackgroundImage } from '../../../data/modules';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';
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
        <View className="bg-gray-900 p-6 rounded-lg mb-4">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-4`}>MICROPHONE STATUS</Text>
          <View className="items-center">
            <Text className={`text-xl ${TYPOGRAPHY.H3} ${isRecording ? 'text-blue-400' : 'text-gray-400'}`}>
              {isRecording ? 'RECORDING' : 'STANDBY'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className={`text-green-400 text-center ${TYPOGRAPHY.BODY_SMALL}`}>
                ✅ AUDIO VERIFICATION COMPLETE
              </Text>
              </View>
          )}
            </View>
            
        {/* Audio Level */}
        <View className="bg-gray-900 p-6 rounded-lg mb-4">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-4`}>AUDIO LEVEL</Text>
          <View className="items-center">
            <Text className={`text-center text-gray-300 ${TYPOGRAPHY.BODY} mt-2`}>
              {audioLevel.toFixed(1)} dB
          </Text>
            <Text className={`text-center text-gray-300 ${TYPOGRAPHY.BODY_SMALL}`}>
              {audioLevel > 50 ? 'HIGH' : audioLevel > 20 ? 'MEDIUM' : 'LOW'}
                </Text>
          </View>
            </View>

        {/* Audio Waveform */}
        <View className="bg-gray-900 p-6 rounded-lg mb-4">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-4`}>AUDIO WAVEFORM</Text>
          <AudioWaveform audioLevel={audioLevel} />
      </View>

        {/* Controls */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-4`}>CONTROLS</Text>
          <View className="items-center">
            <TouchableOpacity
              onPress={startRecording}
              className={`p-4 rounded-lg ${isRecording ? 'bg-red-600' : 'bg-green-600'}`}
            >
              <Text className={`text-center ${TYPOGRAPHY.H4}`}>
                {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
              </Text>
            </TouchableOpacity>
            
            <Text className={`text-center ${TYPOGRAPHY.BODY_SMALL} text-gray-300 mt-4`}>
              Tap to {isRecording ? 'stop' : 'start'} audio recording
              </Text>
          </View>
          </View>
        </View>

      </ScreenTemplate>
  );
} 