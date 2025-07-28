import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useInfection } from '../../contexts/InfectionContext';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { playBackgroundMusic } from '../../utils/soundManager';
import { PUZZLE_TO_MODULE, shouldModuleBeUnlocked } from '../../utils/unlockSystem';
import AppIconWithHalo from '../ui/AppIconWithHalo';
import ScreenTemplate from '../ui/ScreenTemplate';
import InfectionProgressBar from './InfectionProgressBar';

// Define app status types
type AppStatus = 'completed' | 'in-progress' | 'locked' | 'default';

interface AppModule {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  status: AppStatus;
}

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

// Define all modules with their status
const ALL_MODULES: AppModule[] = [
  // Row 1: Tutorial, System, Battery
  { name: 'tutorial', displayName: 'TUTORIAL', icon: '❓', color: 'bg-red-600', route: 'tutorial', status: 'default' },
  { name: 'system', displayName: 'SYSTEM', icon: '⚙️', color: 'bg-red-600', route: 'system', status: 'locked' },
  { name: 'battery', displayName: 'BATTERY', icon: '🔋', color: 'bg-green-600', route: 'battery', status: 'locked' },
  
  // Row 2: Terminal, Clock, Music
  { name: 'terminal', displayName: 'TERMINAL', icon: '💻', color: 'bg-green-600', route: 'terminal', status: 'locked' },
  { name: 'clock', displayName: 'CLOCK', icon: '⏰', color: 'bg-cyan-600', route: 'clock', status: 'locked' },
  { name: 'music', displayName: 'MUSIC', icon: '🎵', color: 'bg-pink-600', route: 'music', status: 'locked' },
  
  // Row 3: Flashlight, Calculator, Compass
  { name: 'flashlight', displayName: 'FLASHLIGHT', icon: '🔦', color: 'bg-yellow-600', route: 'flashlight', status: 'locked' },
  { name: 'calculator', displayName: 'CALCULATOR', icon: '🧮', color: 'bg-orange-600', route: 'calculator', status: 'locked' },
  { name: 'compass', displayName: 'COMPASS', icon: '🧭', color: 'bg-blue-600', route: 'compass', status: 'locked' },
  
  // Row 4: Gyro, Camera, Microphone
  { name: 'gyro', displayName: 'GYRO', icon: '🔄', color: 'bg-green-600', route: 'gyro', status: 'locked' },
  { name: 'camera', displayName: 'CAMERA', icon: '📷', color: 'bg-purple-600', route: 'camera', status: 'locked' },
  { name: 'microphone', displayName: 'MICROPHONE', icon: '🎤', color: 'bg-green-600', route: 'microphone', status: 'locked' },
  
  // Row 5: Maps, Games, WiFi
  { name: 'maps', displayName: 'MAPS', icon: '🗺️', color: 'bg-purple-600', route: 'maps', status: 'locked' },
  { name: 'games', displayName: 'GAMES', icon: '🎮', color: 'bg-purple-600', route: 'games', status: 'locked' },
  { name: 'wifi', displayName: 'WIFI', icon: '📡', color: 'bg-blue-600', route: 'wifi', status: 'locked' },
  
  // Row 6: Weather, Final Boss, Accelerometer
  { name: 'weather', displayName: 'WEATHER', icon: '🌤️', color: 'bg-cyan-600', route: 'weather', status: 'locked' },
  { name: 'finalboss', displayName: 'CORE', icon: '👁️‍🗨️', color: 'bg-red-600', route: 'finalboss', status: 'locked' },
  { name: 'accelerometer', displayName: 'ACCELERATE', icon: '⏫', color: 'bg-purple-600', route: 'accelerometer', status: 'locked' },
];



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
    ? require('../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg')
    : require('../../assets/images/red frame.png');

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
    // Play the main menu theme
    playBackgroundMusic('cyberpunk_bass_1', require('../../assets/sounds/ui/784904__sadiquecat__100-bpm-cyberpunk-bass-1-roland-s1.mp3'), true);
  }, []);

  const handleAppPress = (moduleName: string) => {
    onOpenModule(moduleName);
  };

  const getModuleStatus = (moduleName: string): AppStatus => {
    // Tutorial is always accessible and shows question mark when unsolved
    if (moduleName === 'tutorial') {
      const completedPuzzles = getCompletedPuzzles();
      const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(puzzle => 
        PUZZLE_TO_MODULE[puzzle] === moduleName && completedPuzzles.includes(puzzle)
      );
      return puzzleId ? 'completed' : 'in-progress';
    }
    
    if (unlockedModules.includes(moduleName)) {
      // Check if it has a completed puzzle
      const completedPuzzles = getCompletedPuzzles();
      const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(puzzle => 
        PUZZLE_TO_MODULE[puzzle] === moduleName && completedPuzzles.includes(puzzle)
      );
      return puzzleId ? 'completed' : 'in-progress';
    }
    return 'locked';
  };



  const getModuleBadge = (moduleName: string): string | number | undefined => {
    if (unlockedModules.includes(moduleName)) {
      const completedPuzzles = getCompletedPuzzles();
      const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(puzzle => 
        PUZZLE_TO_MODULE[puzzle] === moduleName && completedPuzzles.includes(puzzle)
      );
      return puzzleId ? undefined : '!';
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