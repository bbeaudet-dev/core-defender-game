import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import { Camera } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native';
import { useInfection } from '../../contexts/InfectionContext';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../data/modules';
import { playSound } from '../../utils/soundManager';
import ScreenTemplate from '../ui/ScreenTemplate';

interface FinalBossModuleProps {
  onGoHome: () => void;
}

type BossStage = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'victory' | 'defeat';

interface BossState {
  health: number;
  maxHealth: number;
  stage: BossStage;
  phase: number;
  attacks: string[];
  playerEnergy: number;
  maxEnergy: number;
}

const BOSS_STAGES = {
  intro: { name: 'INITIALIZING BOSS SEQUENCE', health: 1000 },
  phase1: { name: 'PHASE 1: SENSOR OVERLOAD', health: 800 },
  phase2: { name: 'PHASE 2: ENVIRONMENTAL CHAOS', health: 600 },
  phase3: { name: 'PHASE 3: NETWORK INFILTRATION', health: 400 },
  phase4: { name: 'PHASE 4: FINAL STAND', health: 200 },
  victory: { name: 'VICTORY ACHIEVED', health: 0 },
  defeat: { name: 'SYSTEM COMPROMISED', health: 0 },
};

export default function FinalBossModule({ onGoHome }: FinalBossModuleProps) {
  const { resetToCritical } = useInfection();
  const { getCompletedPuzzles, completePuzzle } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('finalboss', completedPuzzles);
  const [bossState, setBossState] = useState<BossState>({
    health: 1000,
    maxHealth: 1000,
    stage: 'intro',
    phase: 0,
    attacks: [],
    playerEnergy: 100,
    maxEnergy: 100,
  });

  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    magnetometer: { x: 0, y: 0, z: 0 },
    battery: { level: 0, isCharging: false },
    brightness: 0,
    location: { latitude: 0, longitude: 0 },
    network: { isConnected: false, type: '' },
  });

  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    audio: false,
  });

  const [gameState, setGameState] = useState({
    isActive: false,
    timeElapsed: 0,
    combo: 0,
    lastAttack: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Add refs to store intervals for cleanup
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize sensors and permissions
  useEffect(() => {
    initializeBossFight();
    return () => {
      cleanupSensors();
      // Clear any active intervals
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
        phaseIntervalRef.current = null;
      }
    };
  }, []);

  const initializeBossFight = async () => {
    playSound('ui_app_launch');
    
    // Request permissions
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    // Audio permissions are handled differently in expo-audio

    setPermissions({
      camera: cameraPermission.granted,
      location: locationPermission.granted,
      audio: true, // Assume audio is available
    });

    // Start sensor subscriptions
    startSensorMonitoring();

    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setBossState(prev => ({ ...prev, stage: 'phase1' }));
      startPhase1();
    });
  };

  const startSensorMonitoring = () => {
    // Accelerometer
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener((data) => {
      setSensorData(prev => ({ ...prev, accelerometer: data }));
    });

    // Gyroscope
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener((data) => {
      setSensorData(prev => ({ ...prev, gyroscope: data }));
    });

    // Magnetometer
    Magnetometer.setUpdateInterval(100);
    Magnetometer.addListener((data) => {
      setSensorData(prev => ({ ...prev, magnetometer: data }));
    });

    // Battery monitoring
    monitorBattery();
    
    // Brightness monitoring
    monitorBrightness();
    
    // Location monitoring
    if (permissions.location) {
      monitorLocation();
    }
    
    // Network monitoring
    monitorNetwork();
  };

  const monitorBattery = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    // isChargingAsync might not be available, so we'll use a default value
    setSensorData(prev => ({ ...prev, battery: { level: batteryLevel, isCharging: false } }));
  };

  const monitorBrightness = async () => {
    const brightness = await Brightness.getBrightnessAsync();
    setSensorData(prev => ({ ...prev, brightness }));
  };

  const monitorLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setSensorData(prev => ({
        ...prev,
        location: { latitude: location.coords.latitude, longitude: location.coords.longitude }
      }));
    } catch (error) {
      console.log('Location not available');
    }
  };

  const monitorNetwork = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setSensorData(prev => ({
      ...prev,
      network: { 
        isConnected: networkState.isConnected || false, 
        type: networkState.type || 'unknown' 
      }
    }));
  };

  const cleanupSensors = () => {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    Magnetometer.removeAllListeners();
  };

  const startPhase1 = () => {
    setGameState(prev => ({ ...prev, isActive: true }));
    playSound('ui_scan');
    
    // Phase 1: Sensor-based attacks
    phaseIntervalRef.current = setInterval(() => {
      const attack = generateSensorAttack();
      executeAttack(attack);
      
      if (bossState.health <= 800) {
        if (phaseIntervalRef.current) {
          clearInterval(phaseIntervalRef.current);
          phaseIntervalRef.current = null;
        }
        startPhase2();
      }
    }, 3000);
  };

  const startPhase2 = () => {
    setBossState(prev => ({ ...prev, stage: 'phase2', health: 600 }));
    playSound('ui_encrypt');
    
    // Phase 2: Environmental attacks
    phaseIntervalRef.current = setInterval(() => {
      const attack = generateEnvironmentalAttack();
      executeAttack(attack);
      
      if (bossState.health <= 400) {
        if (phaseIntervalRef.current) {
          clearInterval(phaseIntervalRef.current);
          phaseIntervalRef.current = null;
        }
        startPhase3();
      }
    }, 2500);
  };

  const startPhase3 = () => {
    setBossState(prev => ({ ...prev, stage: 'phase3', health: 400 }));
    playSound('ui_data_transfer');
    
    // Phase 3: Network-based attacks
    phaseIntervalRef.current = setInterval(() => {
      const attack = generateNetworkAttack();
      executeAttack(attack);
      
      if (bossState.health <= 200) {
        if (phaseIntervalRef.current) {
          clearInterval(phaseIntervalRef.current);
          phaseIntervalRef.current = null;
        }
        startPhase4();
      }
    }, 2000);
  };

  const startPhase4 = () => {
    setBossState(prev => ({ ...prev, stage: 'phase4', health: 200 }));
    playSound('ui_error');
    
    // Phase 4: Final desperate attacks
    phaseIntervalRef.current = setInterval(() => {
      const attack = generateFinalAttack();
      executeAttack(attack);
      
      if (bossState.health <= 0) {
        if (phaseIntervalRef.current) {
          clearInterval(phaseIntervalRef.current);
          phaseIntervalRef.current = null;
        }
        victory();
      }
    }, 1500);
  };

  const generateSensorAttack = () => {
    const attacks = [
      'ACCELEROMETER SPIKE',
      'GYROSCOPE TURBULENCE',
      'MAGNETIC INTERFERENCE',
      'PRESSURE DROP',
    ];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  const generateEnvironmentalAttack = () => {
    const attacks = [
      'BRIGHTNESS FLASH',
      'BATTERY DRAIN',
      'LOCATION SPOOF',
      'AUDIO FEEDBACK',
    ];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  const generateNetworkAttack = () => {
    const attacks = [
      'NETWORK JAM',
      'SIGNAL INTERCEPT',
      'BANDWIDTH FLOOD',
      'CONNECTION HIJACK',
    ];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  const generateFinalAttack = () => {
    const attacks = [
      'SYSTEM OVERRIDE',
      'CORE BREACH',
      'FINAL DESTRUCTION',
      'APOCALYPSE PROTOCOL',
    ];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  const executeAttack = (attack: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    setBossState(prev => ({
      ...prev,
      attacks: [...prev.attacks.slice(-2), attack], // Keep last 3 attacks
    }));

    // Trigger device effects based on attack
    switch (attack) {
      case 'ACCELEROMETER SPIKE':
        triggerShake();
        break;
      case 'BRIGHTNESS FLASH':
        flashScreen();
        break;
      case 'AUDIO FEEDBACK':
        playSound('ui_error');
        break;
      case 'BATTERY DRAIN':
        monitorBattery();
        break;
      default:
        triggerPulse();
        break;
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const triggerPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const flashScreen = async () => {
    const currentBrightness = await Brightness.getBrightnessAsync();
    await Brightness.setBrightnessAsync(1);
    setTimeout(async () => {
      await Brightness.setBrightnessAsync(currentBrightness);
    }, 200);
  };

  const handlePlayerAttack = () => {
    if (bossState.playerEnergy < 20) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSound('ui_click');
    
    const damage = Math.floor(Math.random() * 50) + 30;
    setBossState(prev => ({
      ...prev,
      health: Math.max(0, prev.health - damage),
      playerEnergy: Math.max(0, prev.playerEnergy - 20),
    }));
    
    setGameState(prev => ({
      ...prev,
      combo: prev.combo + 1,
      lastAttack: `DAMAGE: ${damage}`,
    }));
  };

  const handleDefense = () => {
    if (bossState.playerEnergy < 10) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound('ui_success');
    
    setBossState(prev => ({
      ...prev,
      playerEnergy: Math.min(prev.maxEnergy, prev.playerEnergy + 30),
    }));
  };

  const handleCheat = () => {
    // Clear any active intervals
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
      phaseIntervalRef.current = null;
    }
    
    // Auto-complete the final boss
    setBossState(prev => ({ ...prev, health: 0, stage: 'victory' }));
    playSound('ui_success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Complete the final boss puzzle instead of resetting infection
    completePuzzle('finalboss_defeat');
    
    // Immediately navigate home so all backgrounds update to green
    setTimeout(() => {
      onGoHome();
    }, 1000);
  };

  const victory = () => {
    // Clear any active intervals
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
      phaseIntervalRef.current = null;
    }
    
    setBossState(prev => ({ ...prev, stage: 'victory' }));
    playSound('ui_login_success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Complete the final boss puzzle
    completePuzzle('finalboss_defeat');
    
    setTimeout(() => {
      Alert.alert(
        'VICTORY!',
        'You have defeated the final boss and secured the system!',
        [{ text: 'Return to Home', onPress: onGoHome }]
      );
    }, 2000);
  };

  const renderBossHealth = () => (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-red-500 text-sm font-mono mb-2">BOSS HEALTH</Text>
      <View className="bg-gray-800 h-4 rounded-full overflow-hidden">
        <View 
          className="bg-red-600 h-full rounded-full"
          style={{ width: `${(bossState.health / bossState.maxHealth) * 100}%` }}
        />
      </View>
      <Text className="text-red-400 text-xs font-mono mt-1">
        {bossState.health} / {bossState.maxHealth}
      </Text>
    </View>
  );

  const renderPlayerEnergy = () => (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-blue-500 text-sm font-mono mb-2">PLAYER ENERGY</Text>
      <View className="bg-gray-800 h-4 rounded-full overflow-hidden">
        <View 
          className="bg-blue-600 h-full rounded-full"
          style={{ width: `${(bossState.playerEnergy / bossState.maxEnergy) * 100}%` }}
        />
      </View>
      <Text className="text-blue-400 text-xs font-mono mt-1">
        {bossState.playerEnergy} / {bossState.maxEnergy}
      </Text>
    </View>
  );

  const renderSensorData = () => (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-green-500 text-sm font-mono mb-2">SENSOR DATA</Text>
      <Text className="text-gray-400 text-xs font-mono">
        ACC: {sensorData.accelerometer.x.toFixed(2)} | {sensorData.accelerometer.y.toFixed(2)} | {sensorData.accelerometer.z.toFixed(2)}
      </Text>
      <Text className="text-gray-400 text-xs font-mono">
        GYRO: {sensorData.gyroscope.x.toFixed(2)} | {sensorData.gyroscope.y.toFixed(2)} | {sensorData.gyroscope.z.toFixed(2)}
      </Text>
      <Text className="text-gray-400 text-xs font-mono">
        MAG: {sensorData.magnetometer.x.toFixed(2)} | {sensorData.magnetometer.y.toFixed(2)} | {sensorData.magnetometer.z.toFixed(2)}
      </Text>
      <Text className="text-gray-400 text-xs font-mono">
        BAT: {(sensorData.battery.level * 100).toFixed(0)}% {sensorData.battery.isCharging ? '⚡' : ''}
      </Text>
      <Text className="text-gray-400 text-xs font-mono">
        BRIGHT: {(sensorData.brightness * 100).toFixed(0)}%
      </Text>
    </View>
  );

  const renderBossAttacks = () => (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-red-500 text-sm font-mono mb-2">BOSS ATTACKS</Text>
      {bossState.attacks.map((attack, index) => (
        <Text key={index} className="text-red-400 text-xs font-mono">
          {attack}
        </Text>
      ))}
    </View>
  );

  const renderControls = () => (
    <View className="flex-row space-x-4">
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-lg ${bossState.playerEnergy >= 20 ? 'bg-red-600' : 'bg-gray-600'}`}
        onPress={handlePlayerAttack}
        disabled={bossState.playerEnergy < 20}
      >
        <Text className="text-white font-bold text-center">ATTACK</Text>
        <Text className="text-red-200 text-xs text-center">-20 Energy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className={`flex-1 py-3 px-4 rounded-lg ${bossState.playerEnergy >= 10 ? 'bg-blue-600' : 'bg-gray-600'}`}
        onPress={handleDefense}
        disabled={bossState.playerEnergy < 10}
      >
        <Text className="text-white font-bold text-center">DEFEND</Text>
        <Text className="text-blue-200 text-xs text-center">+30 Energy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenTemplate 
      title="FINAL BOSS" 
      titleColor="red" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <Animated.View 
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [
            { translateX: shakeAnim },
            { scale: pulseAnim }
          ]
        }}
      >
        {/* Boss Stage Display */}
        <View className="bg-red-900/50 p-4 rounded-lg mb-4">
          <Text className="text-red-400 text-lg font-mono text-center">
            {BOSS_STAGES[bossState.stage].name}
          </Text>
          {gameState.lastAttack && (
            <Text className="text-yellow-400 text-sm font-mono text-center mt-1">
              {gameState.lastAttack} | COMBO: {gameState.combo}
            </Text>
          )}
        </View>

        {/* Game Stats */}
        {renderBossHealth()}
        {renderPlayerEnergy()}
        
        {/* Sensor Data */}
        {renderSensorData()}
        
        {/* Boss Attacks */}
        {renderBossAttacks()}
        
        {/* Controls */}
        {gameState.isActive && renderControls()}
        
        {/* Status Messages */}
        {bossState.stage === 'intro' && (
          <View className="bg-yellow-900/50 p-4 rounded-lg mt-4">
            <Text className="text-yellow-400 text-center font-mono">
              Initializing boss sequence... Prepare for battle!
            </Text>
          </View>
        )}
        
        {bossState.stage === 'victory' && (
          <View className="bg-green-900/50 p-4 rounded-lg mt-4">
            <Text className="text-green-400 text-center font-mono text-lg">
              🎉 VICTORY! 🎉
            </Text>
            <Text className="text-green-300 text-center font-mono mt-2">
              The final boss has been defeated!
            </Text>
          </View>
        )}

        {/* Cheat Button */}
        <View className="mt-8 mb-4">
          <TouchableOpacity
            onPress={handleCheat}
            className="bg-purple-600 py-3 px-4 rounded-lg border-2 border-purple-400"
          >
            <Text className="text-white font-bold text-center font-mono">
              🎮 CHEAT: AUTO-DEFEAT BOSS
            </Text>
            <Text className="text-purple-200 text-xs text-center mt-1">
              Instantly defeat the final boss
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScreenTemplate>
  );
}