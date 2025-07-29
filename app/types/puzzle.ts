export interface PuzzleConfig {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  targetValue?: number;
  targetRange?: [number, number];
  targetAction?: string;
  isComplete: boolean;
  progress?: number;
  progressMax?: number;
  color: string;
}

export interface PuzzleState {
  [puzzleId: string]: {
    isComplete: boolean;
    progress?: number;
    lastUpdated: Date;
  };
}

export const DEFAULT_PUZZLES: Record<string, PuzzleConfig> = {
  'system_security': {
    id: 'system_security',
    name: 'System Security',
    description: 'Bypass system security protocols',
    moduleId: 'system',
    targetAction: 'bypass_security',
    isComplete: false,
    color: 'red',
  },
  'terminal_access': {
    id: 'terminal_access',
    name: 'Terminal Access',
    description: 'Gain terminal access by solving access codes',
    moduleId: 'terminal',
    targetAction: 'solve_access_codes',
    isComplete: false,
    color: 'green',
  },
  'help_tutorial': {
    id: 'help_tutorial',
    name: 'Tutorial',
    description: 'Complete the tutorial to unlock system knowledge',
    moduleId: 'tutorial',
    targetAction: 'complete_tutorial',
    isComplete: false,
    color: 'blue',
  },
  'battery_charge': {
    id: 'battery_charge',
    name: 'Power Restoration',
    description: 'Charge the device above 80% to restore power systems',
    moduleId: 'battery',
    targetValue: 0.8,
    isComplete: false,
    color: 'green',
  },
  'flashlight_morse': {
    id: 'flashlight_morse',
    name: 'Signal Transmission',
    description: 'Transmit SOS in morse code using the flashlight',
    moduleId: 'flashlight',
    targetAction: 'transmit_morse',
    isComplete: false,
    color: 'yellow',
  },
  'location_navigate': {
    id: 'location_navigate',
    name: 'Navigation System',
    description: 'Navigate to specified coordinates to restore GPS',
    moduleId: 'maps',
    targetRange: [40.7128, -74.0060], // NYC coordinates
    isComplete: false,
    color: 'purple',
  },
  'accelerometer_movement': {
    id: 'accelerometer_movement',
    name: 'Motion Detection',
    description: 'Move the device to test accelerometer sensors',
    moduleId: 'accelerometer',
    targetAction: 'detect_movement',
    isComplete: false,
    color: 'red',
  },
  'gyroscope_rotation': {
    id: 'gyroscope_rotation',
    name: 'Rotation Calibration',
    description: 'Rotate the device to calibrate gyroscope',
    moduleId: 'gyro',
    targetAction: 'detect_rotation',
    isComplete: false,
    color: 'orange',
  },
  'microphone_level': {
    id: 'microphone_level',
    name: 'Audio System Test',
    description: 'Test microphone by reaching target audio level',
    moduleId: 'microphone',
    targetValue: 0.7,
    isComplete: false,
    color: 'pink',
  },
  'compass_orientation': {
    id: 'compass_orientation',
    name: 'Directional Calibration',
    description: 'Point the device north to calibrate compass',
    moduleId: 'compass',
    targetRange: [0, 45], // North direction with tolerance
    isComplete: false,
    color: 'cyan',
  },
  'compass_direction_hold': {
    id: 'compass_direction_hold',
    name: 'Direction Hold',
    description: 'Hold the device facing a specific direction for 5 seconds',
    moduleId: 'compass',
    targetAction: 'hold_direction',
    isComplete: false,
    color: 'blue',
  },
  'calculator_puzzle': {
    id: 'calculator_puzzle',
    name: 'Mathematical Verification',
    description: 'Solve the calculation and input the result in terminal',
    moduleId: 'calculator',
    targetAction: 'solve_calculation',
    isComplete: false,
    color: 'orange',
  },
  'music_play': {
    id: 'music_play',
    name: 'Audio Playback Test',
    description: 'Play a music track to test audio systems',
    moduleId: 'music',
    targetAction: 'play_music',
    isComplete: false,
    color: 'purple',
  },
  'camera_capture': {
    id: 'camera_capture',
    name: 'Visual Recording Test',
    description: 'Take a photo to test camera functionality',
    moduleId: 'camera',
    targetAction: 'capture_photo',
    isComplete: false,
    color: 'purple',
  },
}; 