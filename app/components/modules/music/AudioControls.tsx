import { Text, TouchableOpacity, View } from 'react-native'
import { MusicTrackText } from '../../../utils/textUtils'

interface AudioControlsProps {
  isMuted: boolean
  volume: number
  currentTrack: string | null
  isPlaying: boolean
  onMuteToggle: () => void
  onVolumeChange: (volume: number) => void
  onPauseResume: () => void
  soundEffects: any[]
}

export default function AudioControls({
  isMuted,
  volume,
  currentTrack,
  isPlaying,
  onMuteToggle,
  onVolumeChange,
  onPauseResume,
  soundEffects
}: AudioControlsProps) {
  const currentTrackData = soundEffects.find(s => s.name === currentTrack)

  return (
    <View className="space-y-4 mb-8">
      <Text className="text-purple-400 text-lg font-bold">Audio Controls</Text>
      
      {/* Mute Toggle */}
      <TouchableOpacity
        onPress={onMuteToggle}
        className={`p-3 rounded-lg border ${isMuted ? 'bg-red-900 border-red-500' : 'bg-green-900 border-green-500'}`}
      >
        <Text className={`text-center font-bold ${isMuted ? 'text-red-400' : 'text-green-400'}`}>
          {isMuted ? '🔇 MUTED' : '🔊 UNMUTED'}
        </Text>
      </TouchableOpacity>

      {/* Pause/Resume Button - Only show if there's a current track */}
      {currentTrack && (
        <TouchableOpacity
          onPress={onPauseResume}
          className={`p-3 rounded-lg border ${isPlaying ? 'bg-yellow-900 border-yellow-500' : 'bg-blue-900 border-blue-500'}`}
        >
          <Text className={`text-center font-bold ${isPlaying ? 'text-yellow-400' : 'text-blue-400'}`}>
            {isPlaying ? '⏸️ PAUSE' : '▶️ RESUME'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Volume Control */}
      <View className="space-y-2">
        <Text className="text-purple-400 text-sm">Volume: {Math.round(volume * 100)}%</Text>
        <View className="flex-row space-x-2">
          {[0, 0.25, 0.5, 0.75, 1].map((vol) => (
            <TouchableOpacity
              key={vol}
              onPress={() => onVolumeChange(vol)}
              className={`flex-1 p-2 rounded ${volume >= vol ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center text-xs text-white">
                {Math.round(vol * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Track Display */}
      {currentTrack && currentTrackData && (
        <View className="bg-purple-900 p-3 rounded-lg">
          <Text className="text-purple-400 text-sm">Now Playing:</Text>
          {currentTrackData.category === 'music' ? (
            <MusicTrackText
              name={currentTrackData.name}
              description={currentTrackData.description}
              artist={currentTrackData.artist}
              className="text-purple-300 font-bold mt-1"
            />
          ) : (
          <Text className="text-purple-300 font-bold">
              {currentTrackData.name}
            </Text>
          )}
          <Text className="text-purple-400 text-xs mt-1">
            Status: {isPlaying ? '▶️ Playing' : '⏸️ Paused'}
          </Text>
        </View>
      )}
    </View>
  )
} 