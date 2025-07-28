// This file now re-exports functions from the centralized modules data
// to maintain backward compatibility

export {
  getAdjacentModules, getModuleByName,
  getModuleByPuzzleId, getModuleNameForPuzzle, getModulesByCategory, getModulesToUnlock, getPuzzleIdForModule, getStartingApps, GRID_LAYOUT, isModulePuzzleCompleted, shouldModuleBeUnlocked
} from '../data/modules';

// Legacy puzzle to module mapping for backward compatibility
export const PUZZLE_TO_MODULE: Record<string, string> = {
  'help_tutorial': 'tutorial',
  'tutorial': 'tutorial', // Alias for backward compatibility
  'system_security': 'system',
  'terminal_access': 'terminal',
  'battery_charge': 'battery',
  'clock_sync': 'clock',
  'music_play': 'music',
  'flashlight_morse': 'flashlight',
  'calculator_puzzle': 'calculator',
  'compass_orientation': 'compass',
  'compass_north': 'compass',
  'gyroscope_rotation': 'gyro',
  'camera_capture': 'camera',
  'microphone_level': 'microphone',
  'location_navigate': 'maps',
  'games_play': 'games',
  'wifi_connect': 'wifi',
  'weather_check': 'weather',
  'finalboss_defeat': 'finalboss',
  'accelerometer_movement': 'accelerometer'
};

// Legacy starting apps for backward compatibility
export const STARTING_APPS = ['tutorial'];

// Legacy function for background image selection
export function getModuleBackgroundImage(
  moduleName: string, 
  completedPuzzles: string[], 
  isFirstVisit: boolean = false
): any {
  // This function can be enhanced later to use module data
  // For now, keeping the legacy implementation
  return require('../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg');
} 