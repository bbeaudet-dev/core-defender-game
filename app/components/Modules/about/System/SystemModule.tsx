import { ScrollView } from 'react-native';
import { usePuzzle } from '../../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../../data/modules';
import ScreenTemplate from '../../../ui/ScreenTemplate';
import DangerZoneSection from './DangerZoneSection';
import DeviceSection from './DeviceSection';
import HardwareSection from './HardwareSection';
import SecuritySection from './SecuritySection';
import SystemSection from './SystemSection';

interface SystemModuleProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export default function SystemModule({ 
  onGoHome, 
  onGoToAbout, 
  onGoToCoreVitals, 
  onSelfDestruct 
}: SystemModuleProps) {
  const { getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('system', completedPuzzles, false);

  return (
    <ScreenTemplate 
      title="SYSTEM" 
      titleColor="red" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <ScrollView className="flex-1">
        <DeviceSection onGoToAbout={onGoToAbout} onGoToCoreVitals={onGoToCoreVitals} />
        <SecuritySection />
        <HardwareSection />
        <SystemSection />
        <DangerZoneSection onSelfDestruct={onSelfDestruct} />
      </ScrollView>
    </ScreenTemplate>
  );
} 