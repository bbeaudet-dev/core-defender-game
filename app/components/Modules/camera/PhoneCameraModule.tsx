import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';
import CameraPlaceholder from './CameraPlaceholder';
import CameraStatus from './CameraStatus';

interface PhoneCameraModuleProps {
  onGoHome: () => void;
}

export default function PhoneCameraModule({ onGoHome }: PhoneCameraModuleProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('camera', completedPuzzles, false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (Platform.OS === 'web') {
          setError('Camera not available on web');
          setHasPermission(false);
          return;
        }

        // Request camera permissions
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          setError('Camera permission denied');
        }
      } catch (err) {
        console.error('Camera initialization failed:', err);
        setError('Failed to initialize camera');
        setHasPermission(false);
      }
    };

    initCamera();
  }, []);

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('camera_capture')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const handlePhotoCapture = (uri: string) => {
    console.log('Photo captured:', uri);
    setPhotoTaken(true);
    playSound('sensor_activate');
    
    // Complete puzzle when photo is taken
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('camera_capture');
    }
  };

  const handleRetakePhoto = () => {
    setPhotoTaken(false);
    playSound('click');
  };

  return (
    <ScreenTemplate 
      title="CAMERA" 
      titleColor="purple" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Camera Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">CAMERA STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">📷</Text>
            <Text className={`text-xl font-mono ${hasPermission ? 'text-green-400' : 'text-red-400'}`}>
              {hasPermission ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ VISUAL RECORDING COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-purple-400 text-sm font-mono mb-2">
              Test camera functionality by taking a photo
            </Text>
          </View>
        )}

        {/* Camera Interface */}
        <View className="bg-gray-900 p-6 rounded-lg">
          {Platform.OS === 'web' ? (
            <CameraStatus status="web" />
          ) : hasPermission === null ? (
            <CameraStatus status="loading" />
          ) : hasPermission === false || error ? (
            <CameraStatus status="error" error={error || undefined} />
          ) : (
            <View className="space-y-4">
              <Text className="text-green-400 text-center text-lg mb-4">📷 Camera Module: ACTIVE</Text>
              
              {/* Camera Component */}
              <View className="mb-6">
                <CameraPlaceholder onPhotoCapture={handlePhotoCapture} />
              </View>
              
              {/* Photo Status */}
              {photoTaken && (
                <View className="p-3 bg-green-900 rounded-lg">
                  <Text className="text-green-400 text-center font-mono text-sm">
                    ✅ Photo captured successfully!
                  </Text>
                  <TouchableOpacity
                    onPress={handleRetakePhoto}
                    className="mt-2 p-2 bg-gray-700 rounded-lg"
                  >
                    <Text className="text-center text-gray-300 font-mono text-sm">
                      RETAKE PHOTO
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View className="space-y-3">
                <Text className="text-green-400 text-center text-sm">Camera: READY</Text>
                <Text className="text-purple-400 text-center text-xs">Live feed from device camera</Text>
                <Text className="text-gray-500 text-center text-xs">Tap to capture photos</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenTemplate>
  );
} 