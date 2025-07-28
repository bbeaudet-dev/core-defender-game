import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_PUZZLES, PuzzleConfig, PuzzleState } from '../types/puzzle';
import notificationManager from '../utils/notificationManager';
import { playSound } from '../utils/soundManager';
import { PUZZLE_TO_MODULE, getModulesToUnlock } from '../utils/unlockSystem';
import { useModuleUnlock } from './ModuleUnlockContext';

interface PuzzleContextType {
  puzzleState: PuzzleState;
  updatePuzzleProgress: (puzzleId: string, progress: number, isComplete?: boolean) => void;
  completePuzzle: (puzzleId: string) => void;
  getPuzzleConfig: (puzzleId: string) => PuzzleConfig | undefined;
  getCompletedPuzzles: () => string[];
  getTotalPuzzles: () => number;
  getCompletionPercentage: () => number;
  // Module visit tracking
  visitedModules: Set<string>;
  markModuleAsVisited: (moduleName: string) => void;
  isFirstVisit: (moduleName: string) => boolean;
}

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({});
  const [visitedModules, setVisitedModules] = useState<Set<string>>(new Set());
  const { unlockModule, unlockedModules } = useModuleUnlock();

  // Initialize puzzle state from default puzzles
  useEffect(() => {
    const initialState: PuzzleState = {};
    Object.keys(DEFAULT_PUZZLES).forEach(puzzleId => {
      const config = DEFAULT_PUZZLES[puzzleId];
      initialState[puzzleId] = {
        isComplete: false, // All puzzles start incomplete
        progress: 0,
        lastUpdated: new Date(),
      };
    });
    setPuzzleState(initialState);
  }, []);

  const updatePuzzleProgress = (puzzleId: string, progress: number, isComplete: boolean = false) => {
    setPuzzleState((prev: PuzzleState) => ({
      ...prev,
      [puzzleId]: {
        ...prev[puzzleId],
        progress: Math.max(0, Math.min(100, progress)),
        isComplete: isComplete || prev[puzzleId]?.isComplete || false,
        lastUpdated: new Date(),
      },
    }));
  };

  const completePuzzle = (puzzleId: string) => {
    setPuzzleState((prev: PuzzleState) => {
      const wasComplete = prev[puzzleId]?.isComplete || false;
      const newState = {
        ...prev,
        [puzzleId]: {
          ...prev[puzzleId],
          isComplete: true,
          progress: 100,
          lastUpdated: new Date(),
        },
      };
      
      // Play unlock sound if this is a new completion
      if (!wasComplete) {
        playSound('ui_unlock');
        
        // Send notification for puzzle completion
        const puzzleConfig = getPuzzleConfig(puzzleId);
        const moduleName = PUZZLE_TO_MODULE[puzzleId];
        
        if (puzzleConfig && moduleName) {
          notificationManager.sendPuzzleCompletionNotification(
            puzzleConfig.name,
            moduleName.toUpperCase()
          );
        }
        
        // Unlock adjacent modules
        const modulesToUnlock = getModulesToUnlock(puzzleId, unlockedModules);
        modulesToUnlock.forEach(moduleName => {
          unlockModule(moduleName as any);
        });
        
        // Check if this was the final puzzle (all 13 completed)
        const completedCount = Object.values(newState).filter((p: any) => p.isComplete).length;
        if (completedCount >= 13) {
          // Send final boss defeated notification
          notificationManager.sendFinalBossDefeatedNotification();
        }
      }
      
      return newState;
    });
  };

  const getPuzzleConfig = (puzzleId: string): PuzzleConfig | undefined => {
    return DEFAULT_PUZZLES[puzzleId];
  };

  const getCompletedPuzzles = (): string[] => {
    return Object.entries(puzzleState)
      .filter(([_, state]: [string, any]) => state.isComplete)
      .map(([puzzleId, _]) => puzzleId);
  };

  const getTotalPuzzles = (): number => {
    return Object.keys(DEFAULT_PUZZLES).length;
  };

  const getCompletionPercentage = (): number => {
    const completed = getCompletedPuzzles().length;
    const total = getTotalPuzzles();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Module visit tracking functions
  const markModuleAsVisited = (moduleName: string) => {
    setVisitedModules(prev => new Set([...prev, moduleName]));
  };

  const isFirstVisit = (moduleName: string): boolean => {
    return !visitedModules.has(moduleName);
  };

  const value: PuzzleContextType = {
    puzzleState,
    updatePuzzleProgress,
    completePuzzle,
    getPuzzleConfig,
    getCompletedPuzzles,
    getTotalPuzzles,
    getCompletionPercentage,
    visitedModules,
    markModuleAsVisited,
    isFirstVisit,
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const context = useContext(PuzzleContext);
  if (context === undefined) {
    throw new Error('usePuzzle must be used within a PuzzleProvider');
  }
  return context;
}

// Add default export
export default PuzzleProvider; 