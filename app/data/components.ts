import SystemModule from '../components/Modules/about/System/SystemModule';
import AccelerometerModule from '../components/Modules/accelerometer/AccelerometerModule';
import BatteryModule from '../components/Modules/battery/BatteryModule';
import CalculatorModule from '../components/Modules/calculator/CalculatorModule';
import PhoneCameraModule from '../components/Modules/camera/PhoneCameraModule';
import ClockModule from '../components/Modules/clock/ClockModule';
import CompassModule from '../components/Modules/compass/CompassModule';
import FinalBossModule from '../components/Modules/finalboss/FinalBossModule';
import FlashlightModule from '../components/Modules/flashlight/FlashlightModule';
import GamesModule from '../components/Modules/games/GamesModule';
import GyroModule from '../components/Modules/gyro/GyroModule';
import MapsModule from '../components/Modules/maps/MapsModule';
import MicrophoneModule from '../components/Modules/microphone/MicrophoneModule';
import MusicModule from '../components/Modules/music/MusicModule';
import TerminalModule from '../components/Modules/terminal/TerminalModule';
import TutorialModule from '../components/Modules/tutorial/TutorialModule';
import WeatherModule from '../components/Modules/weather/WeatherModule';
import WifiModule from '../components/Modules/wifi/WifiModule';
import { ModuleName } from '../types/modules';

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