import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { FONTS } from '../../data/fonts';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface TerminalModuleProps {
  onGoHome: () => void;
}

interface TerminalCommand {
  command: string;
  output: string;
  color?: string;
  timestamp: number;
}

const TERMINAL_HISTORY_KEY = 'terminal_history';

export default function TerminalModule({ onGoHome }: TerminalModuleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { puzzleState, completePuzzle, getCompletedPuzzles } = usePuzzle();

  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('terminal', completedPuzzles, false);

  // Simplified puzzle codes - more intuitive
  const puzzleCodes = {
    'HELP': { puzzleId: 'terminal_access', message: 'Terminal access granted. Welcome to the system.' },
    'FLASHLIGHT': { puzzleId: 'flashlight_morse', message: 'Flashlight module activated.' },
    'CALCULATOR': { puzzleId: 'calculator_puzzle', message: 'Calculator module unlocked.' },
    'COMPASS': { puzzleId: 'compass_orientation', message: 'Compass module calibrated.' },
    'BATTERY': { puzzleId: 'battery_charge', message: 'Battery module restored.' },
    'ACCELEROMETER': { puzzleId: 'accelerometer_movement', message: 'Accelerometer module online.' },
    'GYROSCOPE': { puzzleId: 'gyroscope_rotation', message: 'Gyroscope module calibrated.' },
    'MICROPHONE': { puzzleId: 'microphone_level', message: 'Microphone module activated.' },
    'MAPS': { puzzleId: 'location_navigate', message: 'Maps module unlocked.' },
  };

  // Load terminal history from AsyncStorage
  useEffect(() => {
    loadTerminalHistory();
  }, []);

  // Save terminal history to AsyncStorage whenever it changes
  useEffect(() => {
    saveTerminalHistory();
  }, [history]);

  const loadTerminalHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(TERMINAL_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } else {
        // Initialize with helpful default history
        const defaultHistory: TerminalCommand[] = [
          { 
            command: 'help', 
            output: 'Available commands:\n- help: Show this help\n- status: Show system status\n- unlock [module]: Unlock a module\n- clear: Clear terminal',
            timestamp: Date.now() - 30000
          },
          { 
            command: 'status', 
            output: 'System: COMPROMISED\nCore: LOCKED\nAccess: DENIED\n\nAvailable modules: FLASHLIGHT, CALCULATOR, COMPASS, BATTERY, ACCELEROMETER, GYROSCOPE, MICROPHONE, MAPS',
            timestamp: Date.now() - 20000
          },
        ];
        setHistory(defaultHistory);
      }
    } catch (error) {
      console.error('Failed to load terminal history:', error);
      // Fallback to default history
      const defaultHistory: TerminalCommand[] = [
        { 
          command: 'help', 
          output: 'Available commands:\n- help: Show this help\n- status: Show system status\n- unlock [module]: Unlock a module\n- clear: Clear terminal',
          timestamp: Date.now() - 30000
        },
        { 
          command: 'status', 
          output: 'System: COMPROMISED\nCore: LOCKED\nAccess: DENIED\n\nAvailable modules: FLASHLIGHT, CALCULATOR, COMPASS, BATTERY, ACCELEROMETER, GYROSCOPE, MICROPHONE, MAPS',
          timestamp: Date.now() - 20000
        },
      ];
      setHistory(defaultHistory);
    }
  };

  const saveTerminalHistory = async () => {
    try {
      await AsyncStorage.setItem(TERMINAL_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save terminal history:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addToHistory = (command: string, output: string, color: string = 'text-green-400') => {
    const newEntry: TerminalCommand = {
      command,
      output,
      color,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newEntry]);
  };

  const executeCommand = (cmd: string) => {
    playSound('ui_button_tap');
    const command = cmd.trim().toUpperCase();
    
    switch (command) {
      case 'HELP':
        addToHistory(cmd, 'Available commands:\n- help: Show this help\n- status: Show system status\n- unlock [module]: Unlock a module\n- clear: Clear terminal\n\nExample: unlock FLASHLIGHT');
        break;
        
      case 'STATUS':
        const completedCount = Object.values(puzzleState).filter(p => p.isComplete).length;
        const totalCount = Object.keys(puzzleState).length;
        addToHistory(cmd, `System Status:\n- Core: ${completedCount >= totalCount ? 'UNLOCKED' : 'LOCKED'}\n- Modules: ${completedCount}/${totalCount} restored\n- Access: ${completedCount >= totalCount ? 'GRANTED' : 'DENIED'}\n\nAvailable modules: FLASHLIGHT, CALCULATOR, COMPASS, BATTERY, ACCELEROMETER, GYROSCOPE, MICROPHONE, MAPS`);
        break;
        
      case 'CLEAR':
        setHistory([]);
        break;
        
      default:
        if (command.startsWith('UNLOCK ')) {
          const moduleName = command.substring(7).trim();
          handleUnlockModule(moduleName);
        } else {
          addToHistory(cmd, `Command not found: ${command}\nType 'help' for available commands.`, 'text-red-400');
        }
        break;
    }
  };

  const handleUnlockModule = (moduleName: string) => {
    // Check if it's a valid puzzle code
    if (puzzleCodes[moduleName as keyof typeof puzzleCodes]) {
      const puzzleInfo = puzzleCodes[moduleName as keyof typeof puzzleCodes];
      completePuzzle(puzzleInfo.puzzleId);
      addToHistory(`unlock ${moduleName}`, `✅ ${puzzleInfo.message}`, 'text-green-400');
    } else {
      addToHistory(`unlock ${moduleName}`, `❌ Module '${moduleName}' not found.\n\nAvailable modules: FLASHLIGHT, CALCULATOR, COMPASS, BATTERY, ACCELEROMETER, GYROSCOPE, MICROPHONE, MAPS`, 'text-red-400');
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <ScreenTemplate 
      title="TERMINAL" 
      titleColor="green" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 min-h-[300px] max-h-[450px]"
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <View key={index} className="mb-2">
            <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: FONTS.MONO }}>
              [{formatTimestamp(item.timestamp)}]
            </Text>
            <Text className="text-green-400 text-sm" style={{ fontFamily: FONTS.MONO }}>$ {item.command}</Text>
            <Text className={`text-sm ${item.color || 'text-green-400'}`} style={{ fontFamily: FONTS.MONO }}>
              {item.output}
            </Text>
          </View>
        ))}
        <Text className="text-green-400 text-sm" style={{ fontFamily: FONTS.MONO }}>$ </Text>
      </ScrollView>

      {/* Input Section */}
      <View className="flex-row items-center bg-gray-900 rounded-lg p-2">
        <Text className="text-green-400 text-sm mr-2" style={{ fontFamily: FONTS.MONO }}>$</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          className="flex-1 text-green-400 text-sm"
          placeholder="Enter command..."
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ fontFamily: FONTS.MONO }}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 px-3 py-1 rounded"
        >
          <Text className="text-white text-sm" style={{ fontFamily: FONTS.MONO }}>EXEC</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Commands */}
      <View className="mt-4">
        <Text className="text-gray-400 text-xs mb-2" style={{ fontFamily: FONTS.MONO }}>QUICK COMMANDS:</Text>
        <View className="flex-row flex-wrap">
          {['help', 'status', 'clear'].map(cmd => (
            <TouchableOpacity
              key={cmd}
              onPress={() => executeCommand(cmd)}
              className="bg-gray-800 px-3 py-1 rounded mr-2 mb-2"
            >
              <Text className="text-green-400 text-xs" style={{ fontFamily: FONTS.MONO }}>{cmd}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Module Unlock Hints */}
        <View className="mt-4">
          <Text className="text-gray-400 text-xs mb-2" style={{ fontFamily: FONTS.MONO }}>UNLOCK MODULES:</Text>
          <View className="flex-row flex-wrap">
            {Object.keys(puzzleCodes).map(module => (
              <TouchableOpacity
                key={module}
                onPress={() => executeCommand(`unlock ${module}`)}
                className="bg-gray-800 px-3 py-1 rounded mr-2 mb-2"
              >
                <Text className="text-blue-400 text-xs" style={{ fontFamily: FONTS.MONO }}>{module}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
} 