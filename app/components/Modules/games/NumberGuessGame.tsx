import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useInfection } from '../../../contexts/InfectionContext';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

interface NumberGuessGameProps {
  onBackToMenu: () => void;
  onComplete?: () => void;
}

export default function NumberGuessGame({ onBackToMenu, onComplete }: NumberGuessGameProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const { completePuzzle } = useInfection();
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const submitGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setFeedback('Please enter a valid number between 1 and 100');
      return;
    }

    playSound('ui_button_tap');
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setGameWon(true);
      setFeedback('Congratulations! You guessed it!');
      updatePuzzleProgress('games_numberGuess', 100, true);
      completePuzzle('games_numberGuess'); // Update infection progress
      onComplete?.(); // Call the onComplete callback
      Alert.alert('Victory!', `You guessed the number in ${newAttempts} attempts!`);
      setTimeout(() => {
        onBackToMenu();
      }, 2000);
    } else if (newAttempts >= 7) {
      setFeedback(`Game Over! The number was ${targetNumber}`);
      Alert.alert('Game Over', `You ran out of attempts! The number was ${targetNumber}`);
      setTimeout(() => {
        onBackToMenu();
      }, 2000);
    } else {
      const hint = guessNum < targetNumber ? 'Too low!' : 'Too high!';
      setFeedback(`${hint} You have ${7 - newAttempts} attempts left.`);
    }

    setGuess('');
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameWon(false);
  };

  return (
    <View className="flex flex-col justify-center items-center p-4">
      <Text className="text-green-400 text-2xl mb-6 text-center font-mono">
        NUMBER GUESS
      </Text>
      
      <Text className="text-white text-lg mb-4 text-center">
        Guess the number between 1 and 100
      </Text>
      
      <Text className="text-yellow-400 text-lg mb-4">
        Attempts: {attempts}/7
      </Text>
      
      {feedback && (
        <Text className="text-blue-400 text-lg mb-4 text-center">
          {feedback}
        </Text>
      )}
      
      <TextInput
        value={guess}
        onChangeText={setGuess}
        placeholder="Enter your guess"
        placeholderTextColor="#666"
        keyboardType="numeric"
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 w-48 text-center"
      />
      
      <View className="flex-row space-x-4">
        <TouchableOpacity
          onPress={submitGuess}
          disabled={gameWon}
          className={`px-6 py-3 rounded-lg ${gameWon ? 'bg-gray-600' : 'bg-green-600'}`}
        >
          <Text className="text-white font-mono">SUBMIT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={resetGame}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-mono">RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 