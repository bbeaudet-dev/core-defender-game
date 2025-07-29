import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useInfection } from '../../contexts/InfectionContext';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { ALL_MODULES, isModulePuzzleCompleted, shouldModuleBeUnlocked } from '../../data/modules';
import { HomeScreenProps } from '../../types/game';
import { AppStatus } from '../../types/modules';
import { playBackgroundMusic, SoundManager } from '../../utils/soundManager';
import AppIconWithHalo from '../ui/AppIconWithHalo';
import ScreenTemplate from '../ui/ScreenTemplate';
import InfectionProgressBar from './InfectionProgressBar';



export default function HomeScreen({ onOpenModule }: HomeScreenProps) {
  const { infectionProgress, infectionStatus } = useInfection();
  const { getCompletedPuzzles } = usePuzzle();
  const [unlockedModules, setUnlockedModules] = useState<string[]>(['tutorial']);
  const [unlockAnimations, setUnlockAnimations] = useState<Record<string, boolean>>({});
  const lastCompletedPuzzlesRef = useRef<string[]>([]);

  // Get background image based on final boss status
  const completedPuzzles = getCompletedPuzzles();
  const isFinalBossDefeated = completedPuzzles.length >= 13; // Total puzzles
  const backgroundImage = isFinalBossDefeated 
    ? require('../../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg')
    : require('../../../assets/images/red frame.png');

  // Check for new unlocks when completed puzzles change
  useEffect(() => {
    const completedPuzzles = getCompletedPuzzles();
    
    // Only update if completed puzzles actually changed
    const puzzlesChanged = JSON.stringify(completedPuzzles) !== JSON.stringify(lastCompletedPuzzlesRef.current);
    if (!puzzlesChanged) return;
    
    lastCompletedPuzzlesRef.current = completedPuzzles;
    
    const newUnlockedModules: string[] = [];
    
    // Check which modules should be unlocked
    ALL_MODULES.forEach(module => {
      if (shouldModuleBeUnlocked(module.name, completedPuzzles)) {
        newUnlockedModules.push(module.name);
      }
    });
    
    // Find newly unlocked modules
    const newlyUnlocked = newUnlockedModules.filter(module => !unlockedModules.includes(module));
    
    if (newlyUnlocked.length > 0) {
      // Set new unlocked modules
      setUnlockedModules(newUnlockedModules);
      
      // Trigger unlock animations
      const newAnimations: Record<string, boolean> = {};
      newlyUnlocked.forEach(module => {
        newAnimations[module] = true;
      });
      setUnlockAnimations(newAnimations);
      
      // Clear animations after 1 second
      setTimeout(() => {
        setUnlockAnimations({});
      }, 1000);
    } else {
      // Update unlocked modules without sending notifications
      setUnlockedModules(newUnlockedModules);
    }
  }, [getCompletedPuzzles]); // Changed dependency to getCompletedPuzzles instead of unlockedModules

  // Start main menu theme when component mounts
  useEffect(() => {
    // Only start background music if no music is currently playing
    // This prevents conflicts with the music module
    const soundManager = SoundManager.getInstance();
    if (!soundManager.isBackgroundMusicPlaying()) {
      playBackgroundMusic('cyberpunk_bass_1', require('../../../assets/sounds/ui/784904__sadiquecat__100-bpm-cyberpunk-bass-1-roland-s1.mp3'), true);
    }
  }, []);

  const handleAppPress = (moduleName: string) => {
    onOpenModule(moduleName);
  };

  const getModuleStatus = (moduleName: string): AppStatus => {
    // Tutorial is always accessible and shows question mark when unsolved
    if (moduleName === 'tutorial') {
      const completedPuzzles = getCompletedPuzzles();
      return isModulePuzzleCompleted(moduleName as any, completedPuzzles) ? 'completed' : 'in-progress';
    }
    
    if (unlockedModules.includes(moduleName)) {
      // Check if it has a completed puzzle
      const completedPuzzles = getCompletedPuzzles();
      return isModulePuzzleCompleted(moduleName as any, completedPuzzles) ? 'completed' : 'in-progress';
    }
    return 'locked';
  };



  const getModuleBadge = (moduleName: string): string | number | undefined => {
    if (unlockedModules.includes(moduleName)) {
      const completedPuzzles = getCompletedPuzzles();
      return isModulePuzzleCompleted(moduleName as any, completedPuzzles) ? undefined : '!';
    }
    return undefined;
  };

  return (
    <View className="flex-1">
      <ScreenTemplate 
        title="HOME" 
        titleColor="red" 
        showHomeButton={false}
        backgroundImage={backgroundImage}
      >
        <View className="flex-row flex-wrap justify-center pt-4 pb-24">
          {ALL_MODULES.map(module => (
            <View key={module.name} className="w-28 py-2 px-1 mx-1">
              <AppIconWithHalo
                icon={module.icon}
                name={module.displayName}
                color={module.color}
                onPress={() => handleAppPress(module.name)}
                status={getModuleStatus(module.name)}
                badge={getModuleBadge(module.name)}

                showUnlockAnimation={unlockAnimations[module.name] || false}
                isFinalBossDefeated={isFinalBossDefeated}
              />
            </View>
          ))}
        </View>
      </ScreenTemplate>
      
      <InfectionProgressBar 
        progress={infectionProgress} 
        status={infectionStatus} 
      />
    </View>
  );
} 