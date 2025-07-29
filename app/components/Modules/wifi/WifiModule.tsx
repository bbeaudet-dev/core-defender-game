import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../data/modules';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';
import ConnectionStatus from './ConnectionStatus';
import NetworkList from './NetworkList';
import NetworkStats from './NetworkStats';

interface NetworkInfo {
  name: string;
  strength: number;
  security: string;
  frequency: string;
  channel: number;
}

interface ConnectionStatusType {
  isConnected: boolean;
  networkName: string;
  ipAddress: string;
  connectionType: string;
  signalStrength: number;
}

interface WifiModuleProps {
  onGoHome: () => void;
}

export default function WifiModule({ onGoHome }: WifiModuleProps) {
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>({
    isConnected: false,
    networkName: '',
    ipAddress: '',
    connectionType: '',
    signalStrength: 0,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('wifi', completedPuzzles, false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('wifi_connect')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const checkConnectionStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const ipAddress = await Network.getIpAddressAsync();
      
      setConnectionStatus({
        isConnected: networkState.isConnected || false,
        networkName: 'Unknown', // Network details not available in expo-network
        ipAddress: ipAddress || 'Unknown',
        connectionType: networkState.type || 'Unknown',
        signalStrength: 75, // Default signal strength
      });
    } catch (error) {
      console.error('Failed to get network status:', error);
    }
  };

  const scanNetworks = async () => {
    setIsScanning(true);
    playSound('scan');
    
    try {
      // Simulate network scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockNetworks: NetworkInfo[] = [
        { name: 'HomeNetwork', strength: 85, security: 'WPA2', frequency: '2.4GHz', channel: 6 },
        { name: 'OfficeWiFi', strength: 72, security: 'WPA3', frequency: '5GHz', channel: 36 },
        { name: 'PublicHotspot', strength: 45, security: 'Open', frequency: '2.4GHz', channel: 11 },
        { name: 'NeighborWiFi', strength: 38, security: 'WPA2', frequency: '2.4GHz', channel: 1 },
      ];
      
      setNetworks(mockNetworks);
      
      // Complete puzzle when networks are scanned
      if (!puzzleComplete) {
        setPuzzleComplete(true);
        completePuzzle('wifi_connect');
      }
    } catch (error) {
      console.error('Failed to scan networks:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScreenTemplate 
      title="WIFI" 
      titleColor="blue" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Wifi Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">WIFI STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">📡</Text>
            <Text className={`text-xl font-mono ${connectionStatus.isConnected ? 'text-blue-400' : 'text-red-400'}`}>
              {connectionStatus.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ NETWORK SCANNING COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Puzzle Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-blue-400 text-sm font-mono mb-2">
              Test network scanning by discovering available WiFi networks
            </Text>
          </View>
        )}

        {/* Connection Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">CONNECTION STATUS</Text>
          <ConnectionStatus connection={connectionStatus} />
        </View>

        {/* Network Scanner */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">NETWORK SCANNER</Text>
          <TouchableOpacity
            onPress={scanNetworks}
            disabled={isScanning}
            className={`p-4 rounded-lg ${isScanning ? 'bg-gray-600' : 'bg-blue-600'}`}
          >
            <Text className="text-center font-mono text-lg">
              {isScanning ? 'SCANNING NETWORKS...' : 'SCAN FOR NETWORKS'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Network List */}
        {networks.length > 0 && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-4">AVAILABLE NETWORKS</Text>
            <NetworkList networks={networks} />
          </View>
        )}

        {/* Network Stats */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">NETWORK STATISTICS</Text>
          <NetworkStats networks={networks} />
        </View>
      </View>
    </ScreenTemplate>
  );
} 