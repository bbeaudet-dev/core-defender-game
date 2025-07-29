import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useInfection } from '../../contexts/InfectionContext';
import { FONTS } from '../../data/fonts';
import notificationManager from '../../utils/notificationManager';
import { playSound } from '../../utils/soundManager';
import InfectionProgressBar from '../home/InfectionProgressBar';
import FinalBossAppIcon from '../ui/FinalBossAppIcon';
import ScreenTemplate from '../ui/ScreenTemplate';

interface RebootSequenceProps {
  onComplete: () => void;
}

export default function RebootSequence({ onComplete }: RebootSequenceProps) {
  // Static message states
  const [showRebooting, setShowRebooting] = useState(false);
  const [showManualRestoration, setShowManualRestoration] = useState(false);
  const [showGoodLuck, setShowGoodLuck] = useState(false);
  
  // Progress bar states
  const [showHealthProgress, setShowHealthProgress] = useState(false);
  const [showHealthComplete, setShowHealthComplete] = useState(false);
  const [showScanProgress, setShowScanProgress] = useState(false);
  const [showScanComplete, setShowScanComplete] = useState(false);
  
  // UI element states
  const [showInfectionBar, setShowInfectionBar] = useState(false);
  const [showCoreModule, setShowCoreModule] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const healthProgressAnim = useRef(new Animated.Value(0)).current;
  const scanProgressAnim = useRef(new Animated.Value(0)).current;
  const { infectionProgress, infectionStatus } = useInfection();

  useEffect(() => {
    // Start the reboot sequence
    startRebootSequence();
  }, []);

  // Staged reboot sequence
  useEffect(() => {
    // Stage 1: Show "RECOVERING FROM SYSTEM FAILURE"
    const stage1Timer = setTimeout(() => {
      setShowRebooting(true);
    }, 320); // Reduced from 800

    // Stage 2: Start health progress bar
    const stage2Timer = setTimeout(() => {
      setShowHealthProgress(true);
      Animated.timing(healthProgressAnim, {
        toValue: 1,
        duration: 1600, // Reduced from 4000
        useNativeDriver: false,
      }).start(() => {
        setShowHealthComplete(true);
      });
    }, 1400); // Reduced from 3500

    // Stage 3: Start scan progress bar
    const stage3Timer = setTimeout(() => {
      setShowScanProgress(true);
      Animated.timing(scanProgressAnim, {
        toValue: 1,
        duration: 1400, // Reduced from 3500
        useNativeDriver: false,
      }).start(() => {
        setShowScanComplete(true);
        setShowInfectionBar(true); // Show infection bar when scan completes
      });
    }, 3200); // Reduced from 8000

    // Stage 4: Show "MANUAL RESTORATION REQUIRED" and CORE module
    const stage4Timer = setTimeout(() => {
      setShowManualRestoration(true);
      setShowCoreModule(true);
    }, 4800); // Reduced from 12000

    // Stage 5: Show "GOOD LUCK" and home button
    const stage5Timer = setTimeout(() => {
      setShowGoodLuck(true);
      setShowHomeButton(true);
    }, 6000); // Reduced from 15000

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(stage4Timer);
      clearTimeout(stage5Timer);
    };
  }, [healthProgressAnim, scanProgressAnim]);

  const startRebootSequence = () => {
    // Play reboot sound
    playSound('ui_app_launch');
    
    // Send system corrupted notification
    notificationManager.sendSystemCorruptedNotification();
    
    // Fade in the background
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScreenTemplate
      title="REBOOT"
      titleColor="red"
      showHomeButton={showHomeButton}
      onGoHome={() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onComplete();
        });
      }}
      backgroundImage={require('../../../assets/images/red frame.png')}
    >
      <View className="flex-1 justify-center items-center space-y-6">
        {/* Terminal output container */}
        <View className="bg-black/80 p-6 rounded-lg border border-red-400 max-w-md">
          {/* Terminal header */}
          <Text className="text-red-400 text-sm font-mono mb-4">
            CORE_DEFENDER://reboot/emergency
          </Text>
          
          {/* Static terminal messages */}
          <View className="space-y-4">
            {/* Stage 1: RECOVERING FROM SYSTEM FAILURE */}
            {showRebooting && (
              <Text className="text-red-400 text-sm font-mono" style={{ fontFamily: FONTS.TERMINAL }}>
                {'>'} RECOVERING FROM SYSTEM FAILURE...
              </Text>
            )}
            
            {/* Health Progress Bar - integrated into terminal */}
            {showHealthProgress && (
              <View className="ml-4 space-y-2">
                <View className="flex-row items-center space-x-2">
                  <View className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <Text className="text-red-400 text-sm font-mono" style={{ fontFamily: FONTS.TERMINAL }}>
                    SCANNING SYSTEM INTEGRITY...
                  </Text>
                </View>
                <View className="bg-red-900/30 h-1 rounded-full overflow-hidden">
                  <Animated.View 
                    className="bg-red-400 h-full rounded-full"
                    style={{
                      width: healthProgressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }}
                  />
                </View>
                {/* Show CRITICAL when health scan completes */}
                {showHealthComplete && (
                  <Text className="text-red-400 text-sm font-mono text-center" style={{ fontFamily: FONTS.TERMINAL }}>
                    CRITICAL
                  </Text>
                )}
              </View>
            )}
            
            {/* Scan Progress Bar - integrated into terminal */}
            {showScanProgress && (
              <View className="ml-4 space-y-2">
                <View className="flex-row items-center space-x-2">
                  <View className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <Text className="text-red-400 text-sm font-mono" style={{ fontFamily: FONTS.TERMINAL }}>
                    ANALYZING THREAT PATTERNS...
                  </Text>
                </View>
                <View className="bg-red-900/30 h-1 rounded-full overflow-hidden">
                  <Animated.View 
                    className="bg-red-400 h-full rounded-full"
                    style={{
                      width: scanProgressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }}
                  />
                </View>
                {/* Show INFECTION DETECTED when scan completes */}
                {showScanComplete && (
                  <Text className="text-red-400 text-sm font-mono text-center" style={{ fontFamily: FONTS.TERMINAL }}>
                    INFECTION DETECTED
                  </Text>
                )}
              </View>
            )}
            
            {/* Stage 4: MANUAL RESTORATION */}
            {showManualRestoration && (
              <Text className="text-red-400 text-sm font-mono" style={{ fontFamily: FONTS.TERMINAL }}>
                {'>'} MANUAL RESTORATION REQUIRED
              </Text>
            )}
            
            {/* Stage 5: GOOD LUCK */}
            {showGoodLuck && (
              <Text className="text-red-400 text-sm font-mono" style={{ fontFamily: FONTS.TERMINAL }}>
                {'>'} GOOD LUCK, SOLDIER
              </Text>
            )}
          </View>
        </View>
        
        {/* CORE Module - appears with MANUAL RESTORATION */}
        {showCoreModule && (
          <View className="w-full px-4 mt-8">
            <FinalBossAppIcon 
              onPress={() => {
                // Handle CORE module press if needed
                console.log('CORE module pressed');
              }}
              status="locked"
              isFinalBossDefeated={false}
              showUnlockAnimation={false}
            />
          </View>
        )}
      </View>
      
      {/* Infection Progress Bar - appears with scan completion, positioned like home screen */}
      {showInfectionBar && (
        <InfectionProgressBar 
          progress={infectionProgress} 
          status={infectionStatus} 
        />
      )}
    </ScreenTemplate>
  );
} 