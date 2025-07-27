import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { playSound } from '../../utils/soundManager';
import BugIcon from './BugIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BugAnimationProps {
  onComplete: () => void;
  holeX?: number;
  holeY?: number;
}

interface Bug {
  id: number;
  type: 'caterpillar' | 'beetle' | 'spider' | 'ant' | 'fly' | 'worm';
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
}

export default function BugAnimation({ onComplete }: BugAnimationProps) {
  const bugs = useRef<Bug[]>([]);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const alarmOpacity = useRef(new Animated.Value(0)).current;
  const completedBugs = useRef(0);

  const bugTypes: Array<'caterpillar' | 'beetle' | 'spider' | 'ant' | 'fly' | 'worm'> = [
    'caterpillar', 'beetle', 'spider', 'ant', 'fly', 'worm'
  ];

  useEffect(() => {
    // Simplified: Create fewer bugs (8 instead of 20)
    const newBugs: Bug[] = [];
    for (let i = 0; i < 8; i++) {
      const bug: Bug = {
        id: i,
        type: bugTypes[i % bugTypes.length],
        x: new Animated.Value(screenWidth / 2),
        y: new Animated.Value(screenHeight * 0.7),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0)
      };
      newBugs.push(bug);
    }
    bugs.current = newBugs;
    completedBugs.current = 0;

    // Start simplified animation sequence
    startSimpleAnimation();
  }, []);

  const startSimpleAnimation = () => {
    // Play alarm sound immediately
    playSound('ui_alert');
    
    // Play death sound for system compromise
    playSound('puzzle_fail');
    
    // Start flashing lights
    const flashSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    flashSequence.start();

    // Start alarm text pulsing
    const alarmSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(alarmOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(alarmOpacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    alarmSequence.start();

    // Animate bugs with simple timing
    bugs.current.forEach((bug, index) => {
      setTimeout(() => {
        animateBug(bug);
      }, index * 200); // Stagger bugs by 200ms
    });
  };

  const animateBug = (bug: Bug) => {
    // Simple emergence animation
    Animated.parallel([
      Animated.timing(bug.scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bug.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Simple movement to edge
      const targetX = Math.random() * screenWidth;
      const targetY = Math.random() * screenHeight;
      
      Animated.parallel([
        Animated.timing(bug.x, {
          toValue: targetX,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bug.y, {
          toValue: targetY,
          duration: 1500,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Bug disappears
        Animated.parallel([
          Animated.timing(bug.scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bug.opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          })
        ]).start(() => {
          // Track completion
          completedBugs.current += 1;
          if (completedBugs.current >= bugs.current.length) {
            // Stop animations
            flashOpacity.stopAnimation();
            alarmOpacity.stopAnimation();
            
            setTimeout(() => {
              onComplete();
            }, 500);
          }
        });
      });
    });
  };

  return (
    <View className="absolute inset-0 z-50">
      {/* Flashing red overlay */}
      <Animated.View 
        className="absolute inset-0 bg-red-600"
        style={{ opacity: flashOpacity }}
      />
      
      {/* Alarm text */}
      <Animated.View 
        className="absolute top-20 left-0 right-0 items-center"
        style={{ opacity: alarmOpacity }}
      >
        <Text className="text-red-500 text-2xl font-bold text-center">
          ⚠️ SYSTEM COMPROMISED ⚠️
        </Text>
      </Animated.View>
      
      {/* Bugs */}
      {bugs.current.map((bug) => (
        <Animated.View
          key={bug.id}
          className="absolute"
          style={{
            transform: [
              { translateX: bug.x },
              { translateY: bug.y },
              { scale: bug.scale }
            ],
            opacity: bug.opacity,
          }}
        >
          <BugIcon type={bug.type} size={24} />
        </Animated.View>
      ))}
    </View>
  );
} 