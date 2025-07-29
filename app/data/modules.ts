// Comprehensive module interface
export interface ModuleData {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  gridPosition: { row: number; col: number };
  puzzleId?: string; // Associated puzzle ID
  isStartingApp: boolean;
  description?: string;
  category: 'core' | 'utility' | 'sensor' | 'game' | 'system';
  unlockRequirements?: string[]; // Module names that need to be completed first
}

// Grid layout: 3 columns, 6 rows
export const GRID_LAYOUT = [
  ['tutorial', 'system', 'accelerometer'],
  ['terminal', 'clock', 'music'],
  ['flashlight', 'calculator', 'compass'],
  ['gyro', 'camera', 'microphone'],
  ['maps', 'games', 'weather'],
  [null, 'finalboss', null]
];

// All modules data
export const ALL_MODULES: ModuleData[] = [
  // Row 1
  {
    name: 'tutorial',
    displayName: 'TUTORIAL',
    icon: '❓',
    color: 'bg-red-600',
    route: 'tutorial',
    gridPosition: { row: 0, col: 0 },
    puzzleId: 'help_tutorial',
    isStartingApp: true,
    description: 'Learn the basics of the system',
    category: 'core'
  },
  {
    name: 'system',
    displayName: 'SYSTEM',
    icon: '⚙️',
    color: 'bg-red-600',
    route: 'system',
    gridPosition: { row: 0, col: 1 },
    puzzleId: 'system_security',
    isStartingApp: false,
    description: 'System configuration and security',
    category: 'system'
  },
  {
    name: 'terminal',
    displayName: 'TERMINAL',
    icon: '💻',
    color: 'bg-green-600',
    route: 'terminal',
    gridPosition: { row: 1, col: 0 },
    puzzleId: 'terminal_access',
    isStartingApp: false,
    description: 'Command line interface',
    category: 'core'
  },

  {
    name: 'clock',
    displayName: 'CLOCK',
    icon: '🕐',
    color: 'bg-cyan-600',
    route: 'clock',
    gridPosition: { row: 1, col: 1 },
    puzzleId: 'clock_sync',
    isStartingApp: false,
    description: 'Clock and timer utilities',
    category: 'utility'
  },

  {
    name: 'music',
    displayName: 'MUSIC',
    icon: '🎵',
    color: 'bg-pink-600',
    route: 'music',
    gridPosition: { row: 1, col: 2 },
    puzzleId: 'music_play',
    isStartingApp: false,
    description: 'Music player and audio controls',
    category: 'utility'
  },

  // Row 2
  {
    name: 'flashlight',
    displayName: 'FLASHLIGHT',
    icon: '🔦',
    color: 'bg-yellow-600',
    route: 'flashlight',
    gridPosition: { row: 2, col: 0 },
    puzzleId: 'flashlight_morse',
    isStartingApp: false,
    description: 'Flashlight and morse code',
    category: 'utility'
  },

  {
    name: 'calculator',
    displayName: 'CALC',
    icon: '🧮',
    color: 'bg-orange-600',
    route: 'calculator',
    gridPosition: { row: 2, col: 1 },
    puzzleId: 'calculator_puzzle',
    isStartingApp: false,
    description: 'Calculator with puzzle',
    category: 'utility'
  },

  {
    name: 'compass',
    displayName: 'COMPASS',
    icon: '🧭',
    color: 'bg-blue-600',
    route: 'compass',
    gridPosition: { row: 2, col: 2 },
    puzzleId: 'compass_orientation',
    isStartingApp: false,
    description: 'Compass and orientation tools',
    category: 'sensor'
  },

  // Row 3
  {
    name: 'gyro',
    displayName: 'GYRO',
    icon: '🌀',
    color: 'bg-green-600',
    route: 'gyro',
    gridPosition: { row: 3, col: 0 },
    puzzleId: 'gyroscope_rotation',
    isStartingApp: false,
    description: 'Gyroscope sensor data',
    category: 'sensor'
  },

  {
    name: 'camera',
    displayName: 'CAMERA',
    icon: '📷',
    color: 'bg-purple-600',
    route: 'camera',
    gridPosition: { row: 3, col: 1 },
    puzzleId: 'camera_capture',
    isStartingApp: false,
    description: 'Camera and photo capture',
    category: 'sensor'
  },

  {
    name: 'microphone',
    displayName: 'MIC',
    icon: '🎤',
    color: 'bg-green-600',
    route: 'microphone',
    gridPosition: { row: 3, col: 2 },
    puzzleId: 'microphone_level',
    isStartingApp: false,
    description: 'Microphone and audio input',
    category: 'sensor'
  },

  // Row 4
  {
    name: 'maps',
    displayName: 'MAPS',
    icon: '🗺️',
    color: 'bg-purple-600',
    route: 'maps',
    gridPosition: { row: 4, col: 0 },
    puzzleId: 'location_navigate',
    isStartingApp: false,
    description: 'Maps and navigation',
    category: 'utility'
  },

  {
    name: 'games',
    displayName: 'GAMES',
    icon: '🎮',
    color: 'bg-purple-600',
    route: 'games',
    gridPosition: { row: 4, col: 1 },
    puzzleId: 'games_play',
    isStartingApp: false,
    description: 'Mini-games collection',
    category: 'game'
  },

  {
    name: 'weather',
    displayName: 'WEATHER',
    icon: '🌤️',
    color: 'bg-cyan-600',
    route: 'weather',
    gridPosition: { row: 4, col: 2 },
    puzzleId: 'weather_check',
    isStartingApp: false,
    description: 'Weather information',
    category: 'utility'
  },

  // Row 0 - accelerometer moved here
  {
    name: 'accelerometer',
    displayName: 'ACCELERATE',
    icon: '⏫',
    color: 'bg-purple-600',
    route: 'accelerometer',
    gridPosition: { row: 0, col: 2 },
    puzzleId: 'accelerometer_movement',
    isStartingApp: false,
    description: 'Accelerometer sensor data',
    category: 'sensor'
  },

  // Row 6
  {
    name: 'finalboss',
    displayName: 'CORE',
    icon: '👁️‍🗨️',
    color: 'bg-red-600',
    route: 'finalboss',
    gridPosition: { row: 5, col: 1 },
    puzzleId: 'finalboss_defeat',
    isStartingApp: false,
    description: 'Final challenge',
    category: 'game'
  }
];

// Derive ModuleName type from ALL_MODULES
export type ModuleName = typeof ALL_MODULES[number]['name'];

// Helper functions
export function getModuleByName(name: ModuleName): ModuleData | undefined {
  return ALL_MODULES.find(module => module.name === name);
}

export function getModuleByPuzzleId(puzzleId: string): ModuleData | undefined {
  return ALL_MODULES.find(module => module.puzzleId === puzzleId);
}

export function getStartingApps(): ModuleData[] {
  return ALL_MODULES.filter(module => module.isStartingApp);
}

export function getModulesByCategory(category: ModuleData['category']): ModuleData[] {
  return ALL_MODULES.filter(module => module.category === category);
}

// Get adjacent modules for a given module
export function getAdjacentModules(moduleName: ModuleName): ModuleName[] {
  const module = getModuleByName(moduleName);
  if (!module) return [];
  
  const { row, col } = module.gridPosition;
  const adjacent: ModuleName[] = [];
  
  // Check all 4 adjacent positions
  const directions = [
    [-1, 0], // above
    [1, 0],  // below
    [0, -1], // left
    [0, 1]   // right
  ];
  
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (newRow >= 0 && newRow < GRID_LAYOUT.length && 
        newCol >= 0 && newCol < GRID_LAYOUT[newRow].length) {
      const adjacentModuleName = GRID_LAYOUT[newRow][newCol] as ModuleName;
      adjacent.push(adjacentModuleName);
    }
  }
  
  return adjacent;
}

// Get modules that should be unlocked when a puzzle is completed
export function getModulesToUnlock(completedPuzzleId: string, currentlyUnlocked: ModuleName[]): ModuleName[] {
  const module = getModuleByPuzzleId(completedPuzzleId);
  if (!module) return [];
  
  const adjacentModules = getAdjacentModules(module.name);
  const newUnlocks = adjacentModules.filter(moduleName => !currentlyUnlocked.includes(moduleName));
  
  return newUnlocks;
}

// Check if a module should be unlocked based on completed puzzles
export function shouldModuleBeUnlocked(moduleName: ModuleName, completedPuzzles: string[]): boolean {
  const module = getModuleByName(moduleName);
  if (!module) return false;
  
  // Starting apps are always unlocked
  if (module.isStartingApp) return true;
  
  // Check if the module's puzzle is completed
  if (module.puzzleId && completedPuzzles.includes(module.puzzleId)) {
    return true;
  }
  
  // Check if any adjacent module's puzzle is completed
  const adjacentModules = getAdjacentModules(moduleName);
  return adjacentModules.some(adjacentModuleName => {
    const adjacentModule = getModuleByName(adjacentModuleName);
    return adjacentModule?.puzzleId && completedPuzzles.includes(adjacentModule.puzzleId);
  });
}

// Get puzzle ID for a module
export function getPuzzleIdForModule(moduleName: ModuleName): string | undefined {
  const module = getModuleByName(moduleName);
  return module?.puzzleId;
}

// Get module name for a puzzle ID
export function getModuleNameForPuzzle(puzzleId: string): ModuleName | undefined {
  const module = getModuleByPuzzleId(puzzleId);
  return module?.name;
}

// Check if a module's puzzle is completed
export function isModulePuzzleCompleted(moduleName: ModuleName, completedPuzzles: string[]): boolean {
  const puzzleId = getPuzzleIdForModule(moduleName);
  return puzzleId ? completedPuzzles.includes(puzzleId) : false;
} 

// Helper function for background image selection
export function getModuleBackgroundImage(
  moduleName: string, 
  completedPuzzles: string[], 
  isFirstVisit: boolean = false
): any {
  const module = getModuleByName(moduleName as ModuleName);
  if (!module) {
    // Default to green if module not found
    return require('../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg');
  }

  // Check if this module's puzzle is completed
  const isPuzzleCompleted = module.puzzleId && completedPuzzles.includes(module.puzzleId);
  
  // Check if all puzzles are completed (disinfected state)
  const allModules = ALL_MODULES.filter(m => m.puzzleId);
  const allPuzzlesCompleted = allModules.every(m => 
    m.puzzleId && completedPuzzles.includes(m.puzzleId)
  );

  if (allPuzzlesCompleted) {
    // Green background - completely disinfected
    return require('../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg');
  } else if (isPuzzleCompleted) {
    // Blue background - puzzle solved
    return require('../../assets/images/blue frame.png');
  } else {
    // Red background - corrupted/unsolved
    return require('../../assets/images/red_corruption.jpg');
  }
} 