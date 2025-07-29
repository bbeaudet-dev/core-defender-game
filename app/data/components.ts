import SystemModule from '../components/modules/about/System/SystemModule';
import AccelerometerModule from '../components/modules/accelerometer/AccelerometerModule';
import BatteryModule from '../components/modules/BatteryModule';
import CalculatorModule from '../components/modules/CalculatorModule';
import PhoneCameraModule from '../components/modules/camera/PhoneCameraModule';
import ClockModule from '../components/modules/clock/ClockModule';
import CompassModule from '../components/modules/CompassModule';
import FinalBossModule from '../components/modules/FinalBossModule';
import FlashlightModule from '../components/modules/FlashlightModule';
import GamesModule from '../components/modules/games/GamesModule';
import GyroModule from '../components/modules/GyroModule';
import MapsModule from '../components/modules/MapsModule';
import MicrophoneModule from '../components/modules/microphone/MicrophoneModule';
import MusicModule from '../components/modules/music/MusicModule';
import TerminalModule from '../components/modules/TerminalModule';
import TutorialModule from '../components/modules/TutorialModule';
import WeatherModule from '../components/modules/WeatherModule';
import WifiModule from '../components/modules/wifi/WifiModule';
import { ModuleName } from './modules';

// Module component mapping
export const MODULE_COMPONENTS: Record<ModuleName, React.ComponentType<any>> = {
  terminal: TerminalModule,
  clock: ClockModule,
  gyro: GyroModule,
  compass: CompassModule,
  microphone: MicrophoneModule,
  camera: PhoneCameraModule,
  accelerometer: AccelerometerModule,
  wifi: WifiModule,
  tutorial: TutorialModule,
  music: MusicModule,
  flashlight: FlashlightModule,
  battery: BatteryModule,
  maps: MapsModule,
  calculator: CalculatorModule,
  weather: WeatherModule,
  games: GamesModule,
  finalboss: FinalBossModule,
  system: SystemModule,
} as const;

// Helper function to get a module component
export function getModuleComponent(moduleName: ModuleName): React.ComponentType<any> | undefined {
  return MODULE_COMPONENTS[moduleName];
} 