import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useInfection } from '../../../contexts/InfectionContext';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

interface ReactionTestProps {
  onBackToMenu: () => void;
  onComplete?: () => void;
}

export default function ReactionTest({ onBackToMenu, onComplete }: ReactionTestProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const { completePuzzle } = useInfection();
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'finished'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState<number[]>([]);

  const startRound = () => {
    setGameState('waiting');
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    
    setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handlePress = () => {
    if (gameState !== 'ready') return;
    
    playSound('ui_button_tap');
    const endTime = Date.now();
    const time = endTime - startTime;
    
    setReactionTime(time);
    setGameState('finished');
    setTimes(prev => [...prev, time]);
    
    // Check if reaction time is under 200ms for completion
    if (time <= 200 && !times.some(t => t <= 200)) {
      updatePuzzleProgress('games_reaction', 100, true);
      completePuzzle('games_reaction');
    }
  };

  const nextRound = () => {
    if (round >= 5) {
      // Game complete
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      updatePuzzleProgress('games_reaction', 100, true);
      completePuzzle('games_reaction'); // Update infection progress
      onComplete?.(); // Call the onComplete callback
      Alert.alert('Game Complete!', `Average reaction time: ${avgTime.toFixed(0)}ms`);
      setTimeout(() => {
        onBackToMenu();
      }, 2000);
    } else {
      setRound(prev => prev + 1);
      setGameState('waiting');
      setTimeout(startRound, 1000);
    }
  };

  useEffect(() => {
    if (gameState === 'waiting') {
      startRound();
    }
  }, []);

  return (
    <View className="flex flex-col justify-center items-center p-4">
      <Text className="text-purple-400 text-2xl mb-6 text-center font-mono">
        REACTION TEST
      </Text>
      
      <Text className="text-white text-lg mb-4 text-center">
        Round {round}/5
      </Text>
      
      {gameState === 'waiting' && (
        <Text className="text-yellow-400 text-lg mb-8 text-center">
          Wait for the screen to turn green...
        </Text>
      )}
      
      {gameState === 'ready' && (
        <Text className="text-green-400 text-lg mb-8 text-center">
          PRESS NOW!
        </Text>
      )}
      
      {gameState === 'finished' && (
        <Text className="text-blue-400 text-lg mb-8 text-center">
          Reaction time: {reactionTime}ms
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={gameState !== 'ready'}
        className={`w-48 h-48 rounded-full items-center justify-center ${
          gameState === 'ready' ? 'bg-green-600' : 'bg-gray-600'
        }`}
      >
        <Text className="text-white text-2xl font-mono">
          {gameState === 'ready' ? 'PRESS!' : 'WAIT'}
        </Text>
      </TouchableOpacity>
      
      {gameState === 'finished' && (
        <TouchableOpacity
          onPress={nextRound}
          className="bg-purple-600 px-6 py-3 rounded-lg mt-8"
        >
          <Text className="text-white font-mono">
            {round >= 5 ? 'FINISH' : 'NEXT ROUND'}
          </Text>
        </TouchableOpacity>
      )}
      
      {times.length > 0 && (
        <View className="mt-8">
          <Text className="text-gray-400 text-sm text-center mb-2">Times:</Text>
          <Text className="text-gray-400 text-xs text-center">
            {times.map((time, i) => `${time}ms`).join(' | ')}
          </Text>
        </View>
      )}
    </View>
  );
} 