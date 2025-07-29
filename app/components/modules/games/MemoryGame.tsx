import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useInfection } from '../../../contexts/InfectionContext';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

interface MemoryGameProps {
  onBackToMenu: () => void;
  onComplete?: () => void;
}

interface MemoryState {
  sequence: number[];
  playerSequence: number[];
  level: number;
  showingSequence: boolean;
  currentSequenceIndex: number;
  highlightedButton: number | null;
}

export default function MemoryGame({ onBackToMenu, onComplete }: MemoryGameProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const { completePuzzle } = useInfection();
  const [gameState, setGameState] = useState<MemoryState>({
    sequence: [],
    playerSequence: [],
    level: 1,
    showingSequence: false,
    currentSequenceIndex: 0,
    highlightedButton: null,
  });

  const startGame = () => {
    playSound('ui_button_tap');
    const sequence = Array.from({ length: 3 }, () => Math.floor(Math.random() * 4));
    setGameState({
      sequence,
      playerSequence: [],
      level: 1,
      showingSequence: true,
      currentSequenceIndex: 0,
      highlightedButton: null,
    });
    
    showSequence(sequence);
  };

  const showSequence = (sequence: number[], index = 0) => {
    if (index >= sequence.length) {
      setGameState(prev => ({
        ...prev,
        showingSequence: false,
        highlightedButton: null,
      }));
      return;
    }

    // Highlight the current button in the sequence
    setGameState(prev => ({
      ...prev,
      currentSequenceIndex: index,
      highlightedButton: sequence[index],
    }));

    setTimeout(() => {
      // Clear the highlight
      setGameState(prev => ({
        ...prev,
        highlightedButton: null,
      }));
      
      // Show next button after a short delay
      setTimeout(() => {
        showSequence(sequence, index + 1);
      }, 200);
    }, 800);
  };

  const addToPlayerSequence = (number: number) => {
    if (gameState.showingSequence) return;

    playSound('ui_button_tap');
    const newPlayerSequence = [...gameState.playerSequence, number];
    setGameState(prev => ({
      ...prev,
      playerSequence: newPlayerSequence,
    }));

    // Check if sequence is correct so far
    const isCorrect = newPlayerSequence.every((num, i) => num === gameState.sequence[i]);
    
    if (!isCorrect) {
      Alert.alert('Game Over', `You got ${newPlayerSequence.length - 1} correct!`);
      setTimeout(() => {
        onBackToMenu();
      }, 1000);
      return;
    }

    if (newPlayerSequence.length === gameState.sequence.length) {
      // Level complete
      const newLevel = gameState.level + 1;
      const newSequence = Array.from({ length: 3 + newLevel }, () => Math.floor(Math.random() * 4));
      
      setGameState({
        sequence: newSequence,
        playerSequence: [],
        level: newLevel,
        showingSequence: true,
        currentSequenceIndex: 0,
        highlightedButton: null,
      });
      
      showSequence(newSequence);
      
      if (newLevel >= 5) {
        updatePuzzleProgress('games_memory', 100, true);
        completePuzzle('memory_game'); // Update infection progress
        onComplete?.(); // Call the onComplete callback
        Alert.alert('Congratulations!', 'You completed 5 levels!');
        setTimeout(() => {
          onBackToMenu();
        }, 2000);
      }
    }
  };

  return (
    <View className="flex flex-col justify-center items-center p-4">
      <Text className="text-blue-400 text-lg mb-4">
        Level {gameState.level}
      </Text>
      {gameState.showingSequence ? (
        <Text className="text-yellow-400 text-lg mb-4">
          Watch the sequence...
        </Text>
      ) : (
        <Text className="text-green-400 text-lg mb-4">
          Repeat the sequence!
        </Text>
      )}
      <View className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(num => (
          <TouchableOpacity
            key={num}
            onPress={() => addToPlayerSequence(num)}
            disabled={gameState.showingSequence}
            className={`w-20 h-20 rounded-lg items-center justify-center ${
              gameState.showingSequence && gameState.highlightedButton === num
                ? 'bg-yellow-500'
                : gameState.showingSequence
                ? 'bg-gray-600'
                : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-2xl">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {gameState.sequence.length === 0 && (
        <TouchableOpacity
          onPress={startGame}
          className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white text-center font-mono">START GAME</Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 