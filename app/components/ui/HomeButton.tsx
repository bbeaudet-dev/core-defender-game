import { useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { playSound } from '../../utils/soundManager'

interface HomeButtonProps {
  active: boolean
  onPress?: () => void
}

export default function HomeButton({ active, onPress }: HomeButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = () => {
    if (!active) return
    
    // Play click sound
    playSound('ui_click')
    
    setIsPressed(true)
    // Shrink animation
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 100,
      friction: 5
    }).start()
    
    // Start spinning border
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ).start()
  }

  const handlePressOut = () => {
    if (!active) return
    
    setIsPressed(false)
    // Bounce back animation with overshoot
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 200,
        friction: 3
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8
      })
    ]).start()
    
    // Keep spinning for 1 second after release, then stop
    setTimeout(() => {
      rotateAnim.stopAnimation()
      rotateAnim.setValue(0)
    }, 1000)
  }

  const handlePress = () => {
    if (active && onPress) {
      playSound('ui_home');
      onPress();
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return (
    <View className="absolute bottom-8 left-1/2 -ml-10 z-10">
      {/* Spinning border effect */}
      <Animated.View 
        className="absolute w-20 h-20 rounded-2xl border-2 border-white/30"
        style={{
          transform: [{ rotate: spin }],
          opacity: isPressed && active ? 0.8 : 0
        }}
      />
      
      <Animated.View style={{transform: [{ scale: scaleAnim }]}} >
        <TouchableOpacity
          disabled={!active}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={`
            w-20 h-20 rounded-2xl
            ${active ? isPressed ? 'bg-red-600' : 'bg-red-500' : 'bg-gray-500' } 
            justify-center items-center border-2 border-white
          `}
          style={{ opacity: active ? 0.9 : 0.5 }}
        >
          <Text className="text-white text-4xl font-bold">⌂</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
} 