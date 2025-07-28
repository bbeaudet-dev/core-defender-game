import { Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';

import { playSound } from '@/app/utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface CompassModuleProps {
  onGoHome: () => void;
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Timer state for direction puzzles
  const [currentDirection, setCurrentDirection] = useState('N');
  const [targetDirection, setTargetDirection] = useState('N');
  const [timeInDirection, setTimeInDirection] = useState(0);
  const [isDirectionPuzzleActive, setIsDirectionPuzzleActive] = useState(false);
  const [directionPuzzleComplete, setDirectionPuzzleComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { updatePuzzleProgress, completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('compass', completedPuzzles, false);

  // North direction tolerance (degrees)
  const NORTH_TOLERANCE = 10;
  const TARGET_TIME_IN_DIRECTION = 10000; // 10 seconds

  // Check if puzzle is already completed
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [northFound, setNorthFound] = useState(false);

  useEffect(() => {
    checkMagnetometerAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (isAvailable) {
      _subscribe();
    }
    return () => _unsubscribe();
  }, [isAvailable]);

  // Timer effect for direction puzzle
  useEffect(() => {
    if (isDirectionPuzzleActive && currentDirection === targetDirection) {
      const timer = setInterval(() => {
        setTimeInDirection(prev => {
          const newTime = prev + 100;
          if (newTime >= TARGET_TIME_IN_DIRECTION && !directionPuzzleComplete) {
            setDirectionPuzzleComplete(true);
            completePuzzle('compass_direction_hold');
          }
          return newTime;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeInDirection(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isDirectionPuzzleActive, currentDirection, targetDirection, directionPuzzleComplete]);

  useEffect(() => {
    if (heading !== null && !puzzleComplete) {
      // Check if compass is pointing north (within 10 degrees)
      const isNorth = Math.abs(heading) <= 10 || Math.abs(heading - 360) <= 10;
      if (isNorth && !northFound) {
        setNorthFound(true);
        setPuzzleComplete(true);
        completePuzzle('compass_north');
        playSound('success');
      }
    }
  }, [heading, puzzleComplete, northFound, completePuzzle]);

  const checkMagnetometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsAvailable(false);
        setError('Magnetometer not available on web');
        return;
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Magnetometer not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check magnetometer availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    // Play sensor activation sound
    playSound('sensor_activate');

    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometerData(data);
        
        // Calculate heading from magnetometer data
        let heading = Math.atan2(data.y, data.x) * 180 / Math.PI;
        heading = (heading + 360) % 360;
        setHeading(heading);
        
        // Get current direction
        const direction = getDirection(heading);
        setCurrentDirection(direction);
        
        // Check if pointing north for original puzzle
        const isPointingNorth = heading <= NORTH_TOLERANCE || heading >= (360 - NORTH_TOLERANCE);
        if (isPointingNorth && !isUnlocked) {
          setIsUnlocked(true);
          completePuzzle('compass_orientation');
        }
      })
    );
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const getDirection = (heading: number): string => {
    const normalizedHeading = ((heading % 360) + 360) % 360;
    
    if (normalizedHeading >= 337.5 || normalizedHeading < 22.5) return 'N';
    if (normalizedHeading >= 22.5 && normalizedHeading < 67.5) return 'NE';
    if (normalizedHeading >= 67.5 && normalizedHeading < 112.5) return 'E';
    if (normalizedHeading >= 112.5 && normalizedHeading < 157.5) return 'SE';
    if (normalizedHeading >= 157.5 && normalizedHeading < 202.5) return 'S';
    if (normalizedHeading >= 202.5 && normalizedHeading < 247.5) return 'SW';
    if (normalizedHeading >= 247.5 && normalizedHeading < 292.5) return 'W';
    if (normalizedHeading >= 292.5 && normalizedHeading < 337.5) return 'NW';
    
    return 'N';
  };

  const startDirectionPuzzle = (direction: string) => {
    setTargetDirection(direction);
    setIsDirectionPuzzleActive(true);
    setDirectionPuzzleComplete(false);
    setTimeInDirection(0);
  };

  const stopDirectionPuzzle = () => {
    setIsDirectionPuzzleActive(false);
    setDirectionPuzzleComplete(false);
    setTimeInDirection(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Use a fallback direction if heading is null
  const direction = heading !== null ? getDirection(heading) : 'N';

  if (error) {
    return (
      <ScreenTemplate 
        title="COMPASS" 
        titleColor="blue" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg text-center mb-4">Error: {error}</Text>
          <Text className="text-gray-400 text-sm text-center">Try on a mobile device or enable device orientation</Text>
        </View>
      </ScreenTemplate>
    );
  }

  if (!isAvailable) {
    return (
      <ScreenTemplate 
        title="COMPASS" 
        titleColor="blue" 
        onGoHome={onGoHome}
        backgroundImage={backgroundImage}
      >
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg text-center mb-4">Magnetometer not available</Text>
          <Text className="text-gray-400 text-sm text-center">This device doesn't support magnetometer sensors</Text>
        </View>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate 
      title="COMPASS" 
      titleColor="blue" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex-col w-full items-center justify-center">
        {/* CompassDisplay content */}
        <View className="items-center justify-center" style={{ minHeight: 370 }}>
          <Svg width={350} height={350}>
            {/* Outer circle */}
            <Circle
              cx={175}
              cy={175}
              r={155}
              stroke="#333"
              strokeWidth="3"
              fill="#18181b"
            />
            
            {/* Inner circle */}
            <Circle
              cx={175}
              cy={175}
              r={145}
              stroke="#444"
              strokeWidth="1"
              fill="#232323"
            />
            
            {/* Cardinal direction markers */}
            {[
              { text: 'N', angle: 0 },
              { text: 'NE', angle: 45 },
              { text: 'E', angle: 90 },
              { text: 'SE', angle: 135 },
              { text: 'S', angle: 180 },
              { text: 'SW', angle: 225 },
              { text: 'W', angle: 270 },
              { text: 'NW', angle: 315 }
            ].map((dir, index) => {
              const angle = (dir.angle - (heading ?? 0)) * Math.PI / 180;
              const x1 = 175 + 140 * Math.sin(angle);
              const y1 = 175 - 140 * Math.cos(angle);
              const x2 = 175 + 155 * Math.sin(angle);
              const y2 = 175 - 155 * Math.cos(angle);
              const textX = 175 + 170 * Math.sin(angle);
              const textY = 175 - 170 * Math.cos(angle);
              
              return (
                <>
                  <Line
                    key={`line-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={dir.text === 'N' ? '#ef4444' : '#666'}
                    strokeWidth={dir.text === 'N' ? '3' : '1'}
                  />
                  <SvgText
                    key={`text-${index}`}
                    x={textX}
                    y={textY}
                    fontSize="18"
                    fontWeight="bold"
                    fill={dir.text === 'N' ? '#ef4444' : '#bbb'}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {dir.text}
                  </SvgText>
                </>
              );
            })}
            
            {/* Center dot */}
            <Circle
              cx={175}
              cy={175}
              r="6"
              fill="#ef4444"
            />
            
            {/* North needle */}
            <Line
              x1={175}
              y1={175}
              x2={175}
              y2={20}
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* CompassData content */}
        <View className="items-center">
          <View className="items-center my-4">
            <Text className="text-green-400 text-5xl font-bold font-mono mb-1">{direction}</Text>
            <Text className="text-red-500 text-lg font-bold uppercase">DIRECTION</Text>
          </View>
          <View className="bg-gray-800 p-3 rounded-lg mb-2 items-center w-full max-w-xs">
            <Text className="text-green-400 text-2xl font-mono mb-1">Heading: {(heading ?? 0).toFixed(1)}°</Text>
            <Text className="text-green-400 text-base font-mono mb-1">X: {magnetometerData.x.toFixed(2)}</Text>
            <Text className="text-green-400 text-base font-mono mb-1">Y: {magnetometerData.y.toFixed(2)}</Text>
            <Text className="text-green-400 text-base font-mono mb-1">Z: {magnetometerData.z.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
} 