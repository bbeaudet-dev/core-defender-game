import { setAudioModeAsync } from 'expo-audio'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { usePuzzle } from '../../../contexts/PuzzleContext'
import { getModuleBackgroundImage } from '../../../data/modules'
import { SOUND_EFFECTS, SoundManager, pauseBackgroundMusic, playBackgroundMusic, playSound, resumeBackgroundMusic, setSoundMuted, setSoundVolume, stopBackgroundMusic } from '../../../utils/soundManager'
import ScreenTemplate from '../../ui/ScreenTemplate'
import AudioControls from './AudioControls'
import MusicTracks from './MusicTracks'

interface MusicModuleProps {
  onGoHome: () => void
}

export default function MusicModule({ onGoHome }: MusicModuleProps) {
  const { getCompletedPuzzles, completePuzzle } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('music', completedPuzzles, false);

  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configure the audio mode for playback
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        })
        setHasPermission(true)
      } catch (error) {
        console.error('Failed to setup audio:', error)
        setHasPermission(false)
      }
    }

    setupAudio()
    
    // Initialize sound manager state
    const soundManager = SoundManager.getInstance()
    setIsMuted(soundManager.isMutedState())
    setVolume(soundManager.getVolume())
    setCurrentTrack(soundManager.getCurrentMusicTrack())
    setIsPlaying(soundManager.isBackgroundMusicPlaying())

    // Check if puzzle is already completed
    if (completedPuzzles.includes('music_play')) {
      setPuzzleComplete(true);
    }

    // Cleanup function to stop background music when component unmounts
    return () => {
      // Don't stop background music on unmount if it was playing before we started
      // This allows the music to continue playing when leaving the module
    }
  }, [completedPuzzles]);

  const handleMuteToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setSoundMuted(newMutedState)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setSoundVolume(newVolume)
  }

  const handlePlayTrack = (trackName: string) => {
    setCurrentTrack(trackName);
    setIsPlaying(true);
    playSound('sensor_activate');
    
    // Find the actual track data to play the music
    const trackData = musicTracks.find(track => track.name === trackName);
    if (trackData) {
      // Stop any existing background music first, then play the new track
      stopBackgroundMusic();
      playBackgroundMusic(trackName, trackData.file, true);
    }
    
    // Complete puzzle when any track is played
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('music_play');
    }
  }

  const handleStopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    playSound('click');
    // Actually stop the background music
    stopBackgroundMusic();
  }

  const handlePauseResume = async () => {
    if (isPlaying) {
      await pauseBackgroundMusic()
      setIsPlaying(false)
    } else {
      await resumeBackgroundMusic()
      setIsPlaying(true)
    }
  }

  const musicTracks = SOUND_EFFECTS.filter(sound => sound.category === 'music')

  return (
    <ScreenTemplate 
      title="MUSIC" 
      titleColor="purple" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        

        {/* Music Controls */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MUSIC CONTROLS</Text>
                <AudioControls
                  isMuted={isMuted}
                  volume={volume}
                  currentTrack={currentTrack}
              isPlaying={isPlaying}
                  onMuteToggle={handleMuteToggle}
                  onVolumeChange={handleVolumeChange}
              onPauseResume={handlePauseResume}
                  soundEffects={SOUND_EFFECTS}
                />
        </View>

        {/* Music Tracks */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MUSIC TRACKS</Text>
                <MusicTracks
                  musicTracks={musicTracks}
                  currentTrack={currentTrack}
                  onPlayTrack={handlePlayTrack}
            onStopMusic={handleStopTrack}
                />
        </View>
              </View>
    </ScreenTemplate>
  )
} 