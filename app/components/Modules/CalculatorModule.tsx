import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';
import { TYPOGRAPHY } from '../../data/fonts';

interface CalculatorModuleProps {
  onGoHome: () => void;
}

export default function CalculatorModule({ onGoHome }: CalculatorModuleProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('calculator', completedPuzzles, false);

  // Puzzle: Solve 7 * 8 + 3 = 59
  const PUZZLE_PROBLEM = '7 * 8 + 3';
  const PUZZLE_ANSWER = 59;

  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '*': return firstValue * secondValue;
      case '/': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);

    // Check if puzzle is solved
    if (!puzzleComplete && result === PUZZLE_ANSWER) {
      setPuzzleComplete(true);
      completePuzzle('calculator_puzzle');
      playSound('success');
    }
  };

  const renderButton = (text: string, onPress: () => void, className: string = '') => (
    <TouchableOpacity
      onPress={() => {
        onPress();
        playSound('click');
      }}
      className={`flex-1 aspect-square justify-center items-center rounded-lg m-1 ${className}`}
    >
      <Text className={`text-white ${TYPOGRAPHY.H3}`}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenTemplate 
      title="CALCULATOR" 
      titleColor="green" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Calculator Display */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-2`}>CALCULATOR</Text>
          <View className="bg-gray-800 p-4 rounded-lg mb-4">
            <Text className={`text-green-400 ${TYPOGRAPHY.H1} text-right`}>
              {display}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className={`text-green-400 text-center ${TYPOGRAPHY.BODY_SMALL}`}>
                ✅ MATHEMATICAL VERIFICATION COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-2`}>PUZZLE INSTRUCTIONS</Text>
            <Text className={`text-green-400 ${TYPOGRAPHY.BODY_SMALL} mb-2`}>
              Solve: {PUZZLE_PROBLEM} = ?
            </Text>
          </View>
        )}

        {/* Calculator Buttons */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className={`text-gray-400 ${TYPOGRAPHY.BODY_SMALL} mb-4`}>CALCULATOR</Text>
          
          {/* Row 1 */}
          <View className="flex-row">
            {renderButton('C', clearDisplay, 'bg-red-600')}
            {renderButton('±', () => setDisplay(String(-parseFloat(display))), 'bg-gray-600')}
            {renderButton('%', () => setDisplay(String(parseFloat(display) / 100)), 'bg-gray-600')}
            {renderButton('÷', () => performOperation('/'), 'bg-orange-500')}
          </View>

          {/* Row 2 */}
          <View className="flex-row">
            {renderButton('7', () => inputDigit('7'), 'bg-gray-700')}
            {renderButton('8', () => inputDigit('8'), 'bg-gray-700')}
            {renderButton('9', () => inputDigit('9'), 'bg-gray-700')}
            {renderButton('×', () => performOperation('*'), 'bg-orange-500')}
          </View>

          {/* Row 3 */}
          <View className="flex-row">
            {renderButton('4', () => inputDigit('4'), 'bg-gray-700')}
            {renderButton('5', () => inputDigit('5'), 'bg-gray-700')}
            {renderButton('6', () => inputDigit('6'), 'bg-gray-700')}
            {renderButton('-', () => performOperation('-'), 'bg-orange-500')}
          </View>

          {/* Row 4 */}
          <View className="flex-row">
            {renderButton('1', () => inputDigit('1'), 'bg-gray-700')}
            {renderButton('2', () => inputDigit('2'), 'bg-gray-700')}
            {renderButton('3', () => inputDigit('3'), 'bg-gray-700')}
            {renderButton('+', () => performOperation('+'), 'bg-orange-500')}
          </View>

          {/* Row 5 */}
          <View className="flex-row">
            {renderButton('0', () => inputDigit('0'), 'bg-gray-700 flex-2')}
            {renderButton('.', inputDecimal, 'bg-gray-700')}
            {renderButton('=', handleEquals, 'bg-orange-500')}
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
}