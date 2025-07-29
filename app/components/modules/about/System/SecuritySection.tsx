import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../../contexts/PuzzleContext';
import { playSound } from '../../../../utils/soundManager';

export default function SecuritySection() {
  const { completePuzzle, puzzleState } = usePuzzle();
  const [securityCode, setSecurityCode] = useState('');
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const isSystemSecurityComplete = puzzleState['system_security']?.isComplete || false;

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
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">SECURITY</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Quarantine Status</Text>
        <Text className="text-gray-400 text-sm">ACTIVE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Virus Scan</Text>
        <Text className="text-gray-400 text-sm">INFECTED</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Access Level</Text>
        <Text className="text-gray-400 text-sm">RESTRICTED</Text>
      </TouchableOpacity>

      {/* Security Bypass Puzzle */}
      <View className="mt-4 p-4 bg-gray-800 rounded-lg">
        <Text className="text-red-400 text-sm font-mono mb-2">SECURITY BYPASS</Text>
        
        {isSystemSecurityComplete ? (
          <View className="space-y-2">
            <Text className="text-green-400 text-sm font-mono">✅ SECURITY BYPASSED</Text>
            <Text className="text-gray-400 text-xs">Access granted to adjacent modules</Text>
          </View>
        ) : showPuzzle ? (
          <View className="space-y-3">
            <Text className="text-yellow-400 text-sm font-mono">
              Enter security override code (Attempts: {attempts}/3)
            </Text>
            <Text className="text-gray-400 text-xs">
              Hint: Think about who has the highest access level...
            </Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setSecurityCode((prev: string) => prev + 'A')}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <Text className="text-white font-mono">A</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSecurityCode((prev: string) => prev + 'D')}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <Text className="text-white font-mono">D</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSecurityCode((prev: string) => prev + 'M')}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <Text className="text-white font-mono">M</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSecurityCode((prev: string) => prev + 'I')}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <Text className="text-white font-mono">I</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSecurityCode((prev: string) => prev + 'N')}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <Text className="text-white font-mono">N</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setSecurityCode('')}
                className="bg-red-600 px-4 py-2 rounded"
              >
                <Text className="text-white font-mono text-sm">CLEAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitCode}
                className="bg-green-600 px-4 py-2 rounded flex-1"
              >
                <Text className="text-white font-mono text-sm text-center">SUBMIT</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white font-mono text-center">{securityCode}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSecurityBypass}
            className="bg-red-600 px-4 py-2 rounded"
          >
            <Text className="text-white font-mono text-center">BYPASS SECURITY</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 