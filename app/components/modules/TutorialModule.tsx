import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface TutorialModuleProps {
  onGoHome: () => void;
}

export default function TutorialModule({ onGoHome }: TutorialModuleProps) {
  const { completePuzzle, puzzleState, getCompletedPuzzles } = usePuzzle();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  
  const isTutorialComplete = puzzleState['help_tutorial']?.isComplete || false;
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('tutorial', completedPuzzles, false);

  const tutorialSteps = [
    "Welcome to the Core Access tutorial!",
    "This system contains various modules for monitoring and control.",
    "Each module has specialized functions and may contain puzzles.",
    "Complete puzzles to unlock adjacent modules in the grid.",
    "Use the home button (⌂) to return to the main menu.",
    "Tutorial complete! Adjacent modules unlocked."
  ];

  const startTutorial = () => {
    if (isTutorialComplete) return;
    
    playSound('ui_button_tap');
    setShowTutorial(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    playSound('ui_button_tap');
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      // Tutorial complete
      completePuzzle('help_tutorial');
      setShowTutorial(false);
      setCurrentStep(0);
    }
  };

  const skipTutorial = () => {
    playSound('ui_button_tap');
    setShowTutorial(false);
    setCurrentStep(0);
  };

  const handleComplete = () => {
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('help_tutorial');
      playSound('success');
    }
  };

  if (showTutorial) {
    return (
      <ScreenTemplate 
        title="TUTORIAL" 
        titleColor="blue" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-gray-900 p-6 rounded-lg border-2 border-blue-500">
            <Text className="text-blue-400 text-lg font-mono text-center mb-6">
              STEP {currentStep + 1} OF {tutorialSteps.length}
            </Text>
            
            <Text className="text-gray-300 text-center font-mono mb-8 leading-6">
              {tutorialSteps[currentStep]}
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={skipTutorial}
                className="bg-gray-700 py-3 px-6 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-gray-300 font-mono">SKIP</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={nextStep}
                className="bg-blue-600 py-3 px-6 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-white font-mono font-bold">
                  {currentStep === tutorialSteps.length - 1 ? 'COMPLETE' : 'NEXT'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate 
      title="TUTORIAL" 
      titleColor="blue" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <ScrollView className="flex-1">
        {/* Welcome Section */}
        <View className="bg-gray-900 p-6 rounded-lg mb-6">
          <Text className="text-blue-400 text-lg font-mono mb-4">CORE DEFENDER</Text>
          <Text className="text-gray-300 text-sm mb-4">
            Welcome to the Core Defender. This interface provides access to various 
            device modules and system functions.
          </Text>
          <Text className="text-gray-300 text-sm">
            Complete the tutorial to unlock additional modules and features.
          </Text>
        </View>

        {/* Tutorial Section */}
        <View className="bg-gray-900 p-6 rounded-lg mb-6">
          <Text className="text-gray-400 text-sm font-mono mb-4">TUTORIAL</Text>
          {isTutorialComplete ? (
            <View className="bg-green-900 p-4 rounded-lg">
              <Text className="text-green-400 text-sm font-mono text-center">
                ✅ TUTORIAL COMPLETED
              </Text>
              <Text className="text-gray-300 text-sm text-center mt-2">
                Adjacent modules have been unlocked!
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-gray-300 text-sm mb-4">
                Complete the interactive tutorial to learn about the system and unlock new modules.
              </Text>
              <TouchableOpacity
                onPress={startTutorial}
                className="bg-blue-600 py-3 px-6 rounded-lg self-start"
                activeOpacity={0.8}
              >
                <Text className="text-white font-mono font-bold">START TUTORIAL</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Reference */}
        <View className="bg-gray-900 p-6 rounded-lg mb-6">
          <Text className="text-gray-400 text-sm font-mono mb-4">QUICK REFERENCE</Text>
          <Text className="text-gray-300 text-sm mb-2">
            • <Text className="text-blue-400">System:</Text> Device information and settings
          </Text>
          <Text className="text-gray-300 text-sm mb-2">
            • <Text className="text-green-400">Terminal:</Text> Command line interface
          </Text>
          <Text className="text-gray-300 text-sm mb-2">
            • <Text className="text-yellow-400">Sensors:</Text> Access device sensors
          </Text>
          <Text className="text-gray-300 text-sm">
            • <Text className="text-purple-400">Media:</Text> Camera, microphone, music
          </Text>
        </View>

        {/* Navigation */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">NAVIGATION</Text>
          <Text className="text-gray-300 text-sm mb-2">
            • Use the home button (⌂) to return to the main menu
          </Text>
          <Text className="text-gray-300 text-sm mb-2">
            • Tap any module icon to access its features
          </Text>
          <Text className="text-gray-300 text-sm">
            • Each module has its own specialized functions
          </Text>
        </View>

        {/* Tips */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">TIPS</Text>
          <Text className="text-gray-300 text-sm mb-2">
            • Some modules require device permissions
          </Text>
          <Text className="text-gray-300 text-sm mb-2">
            • Use on a physical device for full sensor access
          </Text>
          <Text className="text-gray-300 text-sm">
            • Check individual modules for specific instructions
          </Text>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
} 