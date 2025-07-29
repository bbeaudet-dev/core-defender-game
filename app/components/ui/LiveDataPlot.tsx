import { Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

type UnitType = 'g' | 'm/s²' | 'ft/s²' | 'hPa' | 'deg/s';

interface SpeedPlotProps {
  speedHistory: number[];
  maxSpeed: number;
  historyLength: number;
  unitType: UnitType;
  normalized?: boolean;
  title?: string;
  color?: string;
}

export default function SpeedPlot({ 
  speedHistory, 
  maxSpeed, 
  historyLength, 
  unitType, 
  normalized = false,
  title = "SPEED PLOT",
  color = "green"
}: SpeedPlotProps) {
  const getUnitLabel = (unit: UnitType): string => {
    switch (unit) {
      case 'g':
        return 'g';
      case 'm/s²':
        return 'm/s²';
      case 'ft/s²':
        return 'ft/s²';
      case 'hPa':
        return 'hPa';
      case 'deg/s':
        return 'deg/s';
      default:
        return 'g';
    }
  };

  const getExpectedGravity = (unit: UnitType): number => {
    switch (unit) {
      case 'g':
        return 1.0;
      case 'm/s²':
        return 9.81;
      case 'ft/s²':
        return 32.17;
      case 'hPa':
        return 1013.25; // Standard atmospheric pressure
      case 'deg/s':
        return 0.0; // No baseline for angular velocity
      default:
        return 1.0;
    }
  };

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      case 'purple':
        return 'text-purple-400';
      case 'cyan':
        return 'text-cyan-400';
      case 'yellow':
        return 'text-yellow-400';
      case 'red':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  const getStrokeColor = (color: string): string => {
    switch (color) {
      case 'green':
        return '#4ade80';
      case 'blue':
        return '#60a5fa';
      case 'purple':
        return '#a78bfa';
      case 'cyan':
        return '#22d3ee';
      case 'yellow':
        return '#facc15';
      case 'red':
        return '#f87171';
      default:
        return '#4ade80';
    }
  };

  let plotData: number[] = [];
  if (speedHistory.length < historyLength) {
    // Pad with zeros at the start
    plotData = Array(historyLength - speedHistory.length).fill(0).concat(speedHistory);
  } else {
    // Only show the most recent historyLength points
    plotData = speedHistory.slice(speedHistory.length - historyLength);
  }

  if (plotData.length < 2) {
    return (
      <View className="bg-gray-900 p-6 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">{title}</Text>
        <View className="h-20 bg-gray-800 rounded-lg flex items-center justify-center">
          <Text className="text-gray-500 text-xs font-mono">
            Insufficient data ({plotData.length} readings)
          </Text>
        </View>
      </View>
    );
  }

  const expectedGravity = getExpectedGravity(unitType);
  const baseline = normalized ? expectedGravity : 0;
  
  // DYNAMIC SCALING: Start with a small range and expand as max value increases
  const currentMax = Math.max(maxSpeed, ...plotData);
  const currentMin = Math.min(0, ...plotData);
  
  // Start with a small range (e.g., 0-10) and expand dynamically
  const minRange = 5; // Start with 5 units range
  const dynamicRange = Math.max(currentMax - currentMin, minRange);
  
  // Ensure the plot can always show the current maximum
  const plotMax = currentMax + (dynamicRange * 0.1); // Add 10% padding above max
  const plotMin = Math.max(0, currentMin - (dynamicRange * 0.05)); // Add 5% padding below min
  
  const width = 300;
  const height = 80;
  const padding = 20;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const points = plotData.map((speed, index) => {
    const x = padding + (index / (plotData.length - 1)) * plotWidth;
    // Scale to fit within the dynamic range
    const normalizedSpeed = (speed - plotMin) / (plotMax - plotMin);
    const y = height - padding - (normalizedSpeed * plotHeight);
    return `${x},${y}`;
  }).join(' ');

  // Generate Y-axis labels based on the dynamic range
  const yLabels = [];
  const numLabels = 4; // Fewer labels to avoid clutter
  for (let i = 0; i <= numLabels; i++) {
    const value = plotMin + (plotMax - plotMin) * (i / numLabels);
    yLabels.push({
      value: value.toFixed(1),
      y: height - padding - (i / numLabels) * plotHeight
    });
  }

  return (
    <View className="bg-gray-900 p-6 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">{title}</Text>
      
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className={`text-xs font-mono ${getColorClass(color)}`}>
          Max: {maxSpeed.toFixed(1)} {getUnitLabel(unitType)}
        </Text>
        <Text className="text-gray-500 text-xs font-mono">
          {plotData.length} readings
        </Text>
      </View>

      <View className="bg-gray-800 rounded-lg p-2">
        <View className="flex-row items-center">
          {/* Y-axis labels on the left */}
          <View className="w-12 flex justify-between items-end pr-2">
            {yLabels.map((label, index) => (
              <Text key={index} className="text-gray-500 text-xs font-mono">
                {label.value}
              </Text>
            ))}
          </View>
          
          {/* Plot */}
          <Svg width={width} height={height}>
            <Polyline
              points={points}
              stroke={getStrokeColor(color)}
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </View>
      </View>

      {normalized && (
        <Text className="text-gray-500 text-xs font-mono text-center mt-2">
          Normalized to {expectedGravity.toFixed(1)} {getUnitLabel(unitType)}
        </Text>
      )}
    </View>
  );
} 