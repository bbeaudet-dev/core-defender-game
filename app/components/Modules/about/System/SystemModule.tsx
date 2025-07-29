import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { usePuzzle } from '../../../../contexts/PuzzleContext';
import { FONTS } from '../../../../data/fonts';
import { getModuleBackgroundImage } from '../../../../data/modules';
import { playSound } from '../../../../utils/soundManager';
import ScreenTemplate from '../../../ui/ScreenTemplate';

interface SystemModuleProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export default function SystemModule({ 
  onGoHome, 
  onGoToAbout, 
  onGoToCoreVitals, 
  onSelfDestruct 
}: SystemModuleProps) {
  const { completePuzzle, puzzleState, getCompletedPuzzles } = usePuzzle();
  const [securityCode, setSecurityCode] = useState('');
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const isSystemSecurityComplete = puzzleState['system_security']?.isComplete || false;
  const completedPuzzles = getCompletedPuzzles();

  const handleSecurityBypass = () => {
    if (isSystemSecurityComplete) return;
    playSound('ui_button_tap');
    setShowPuzzle(true);
  };

  const submitCode = () => {
    playSound('ui_button_tap');
    setAttempts((prev: number) => prev + 1);
    
    // The security code is "ADMIN" (case insensitive)
    if (securityCode.toUpperCase() === 'ADMIN') {
      completePuzzle('system_security');
      setShowPuzzle(false);
      setSecurityCode('');
      setAttempts(0);
    } else {
      setSecurityCode('');
      if (attempts >= 2) {
        setShowPuzzle(false);
        setAttempts(0);
      }
    }
  };

  return (
    <ScreenTemplate 
      title="SYSTEM" 
      titleColor="red" 
      onGoHome={onGoHome}
      backgroundImage={getModuleBackgroundImage('system', completedPuzzles, false)}
    >
      <ScrollView className="flex-1">
        {/* Device Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONTS.MONO }} className="text-red-500 text-lg font-bold mb-3">DEVICE</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700" onPress={onGoToAbout}>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">About</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">Core Defender v1.0.3</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700" onPress={onGoToCoreVitals}>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Core Vitals</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">⚠️ Unstable</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONTS.MONO }} className="text-red-500 text-lg font-bold mb-3">SECURITY</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Quarantine Status</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">ACTIVE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Virus Scan</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">INFECTED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Access Level</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">RESTRICTED</Text>
          </TouchableOpacity>

          {/* Security Bypass Puzzle */}
          <View className="mt-4 p-4 bg-gray-800 rounded-lg">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-red-400 text-sm mb-2">SECURITY BYPASS</Text>
            
            {isSystemSecurityComplete ? (
              <View className="space-y-2">
                <Text style={{ fontFamily: FONTS.MONO }} className="text-green-400 text-sm">✅ SECURITY BYPASSED</Text>
                <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-xs">Access granted to adjacent modules</Text>
              </View>
            ) : showPuzzle ? (
              <View className="space-y-3">
                <Text style={{ fontFamily: FONTS.MONO }} className="text-yellow-400 text-sm">
                  Enter security override code (Attempts: {attempts}/3)
                </Text>
                <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-xs">
                  Hint: Think about who has the highest access level...
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setSecurityCode((prev: string) => prev + 'A')}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white">A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSecurityCode((prev: string) => prev + 'D')}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white">D</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSecurityCode((prev: string) => prev + 'M')}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white">M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSecurityCode((prev: string) => prev + 'I')}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white">I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSecurityCode((prev: string) => prev + 'N')}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white">N</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setSecurityCode('')}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-sm">CLEAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={submitCode}
                    className="bg-green-600 px-4 py-2 rounded flex-1"
                  >
                    <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-sm text-center">SUBMIT</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-center">{securityCode}</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSecurityBypass}
                className="bg-red-600 px-4 py-2 rounded"
              >
                <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-center">BYPASS SECURITY</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hardware Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONTS.MONO }} className="text-red-500 text-lg font-bold mb-3">HARDWARE</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Gyroscope</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">ONLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Microphone</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">STANDBY</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Camera</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">OFFLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">GPS</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">ACTIVE</Text>
          </TouchableOpacity>
        </View>

        {/* System Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONTS.MONO }} className="text-red-500 text-lg font-bold mb-3">SYSTEM</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Emergency Mode</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">ENABLED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text style={{ fontFamily: FONTS.MONO }} className="text-white text-base">Auto-Destruct</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-gray-400 text-sm">ARMED</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone Section */}
        <View className="mb-6">
          <Text style={{ fontFamily: FONTS.MONO }} className="text-red-500 text-lg font-bold mb-3">DANGER ZONE</Text>
          
          <TouchableOpacity 
            className="flex-row justify-between items-center py-3 border-b border-red-500" 
            onPress={onSelfDestruct}
          >
            <Text style={{ fontFamily: FONTS.MONO }} className="text-red-400 text-base">Self-Destruct</Text>
            <Text style={{ fontFamily: FONTS.MONO }} className="text-red-400 text-sm">TERMINATE DEVICE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
} 