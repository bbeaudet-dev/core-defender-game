import {
    AudioPlayer,
    createAudioPlayer,
    InterruptionMode,
    InterruptionModeAndroid,
    setAudioModeAsync
} from 'expo-audio'

// Import sound effects from separate files
import { gameSounds } from './soundEffects/gameSounds'
import { musicTracks } from './soundEffects/musicTracks'
import { uiSounds } from './soundEffects/uiSounds'

export interface SoundEffect {
  id: string
  name: string
  category: 'ui' | 'game' | 'ambient' | 'music'
  description: string
  artist?: string // Optional field for music tracks
  file: any // require() result
}

// Set audio mode for iOS/Android compatibility
setAudioModeAsync({
  allowsRecording: false,
  shouldPlayInBackground: false,
  interruptionMode: 'mixWithOthers' as InterruptionMode,
  playsInSilentMode: true,
  interruptionModeAndroid: 'duckOthers' as InterruptionModeAndroid,
  shouldRouteThroughEarpiece: false,
})

export class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, AudioPlayer> = new Map()
  private isMuted: boolean = false
  private volume: number = 0.7
  private backgroundMusic: AudioPlayer | null = null
  private currentMusicTrack: string | null = null

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  async preloadSound(soundId: string, file: any): Promise<void> {
    try {
      const player = createAudioPlayer(file)
      this.sounds.set(soundId, player)
    } catch (error) {
      console.error(`Failed to preload sound ${soundId}:`, error)
    }
  }

  async playSound(soundId: string, volume?: number): Promise<void> {
    if (this.isMuted) return

    let player = this.sounds.get(soundId)
    const effect = SOUND_EFFECTS.find(s => s.id === soundId)
    if (!effect) return

    if (!player) {
      try {
        player = createAudioPlayer(effect.file)
        this.sounds.set(soundId, player)
      } catch (error) {
        console.error(`Failed to load sound ${soundId}:`, error)
        return
      }
    }

    try {
      // Set volume by adjusting the player's volume property
      if (volume !== undefined) {
        player.volume = volume
      } else {
        player.volume = this.volume
      }
      
      // Reset to beginning and play
      await player.seekTo(0)
      player.play()
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error)
    }
  }

  async playBackgroundMusic(trackId: string, source: string | any, loop: boolean = true): Promise<void> {
    if (this.isMuted) return

    // Prevent starting the same track multiple times
    if (this.currentMusicTrack === trackId && this.backgroundMusic?.playing) {
      console.log(`🎵 Track ${trackId} is already playing, skipping`);
      return;
    }

    console.log(`🎵 Starting background music: ${trackId}`);

    // Stop current background music and wait for it to complete
    if (this.backgroundMusic) {
      console.log(`🎵 Stopping current background music: ${this.currentMusicTrack}`);
      this.backgroundMusic.pause()
      this.backgroundMusic.remove()
      this.backgroundMusic = null
      this.currentMusicTrack = null
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      // Handle both local files (require() result) and URIs
      const audioSource = typeof source === 'string' ? { uri: source } : source
      const player = createAudioPlayer(audioSource)
      player.volume = this.volume * 0.5 // Background music at half volume
      if (loop) {
        player.loop = true
      }
      
      // Wait for player to be ready before playing
      await new Promise(resolve => setTimeout(resolve, 50));
      player.play()
      
      this.backgroundMusic = player
      this.currentMusicTrack = trackId
      console.log(`🎵 Background music started successfully: ${trackId}`);
    } catch (error) {
      console.error(`Failed to play background music ${trackId}:`, error)
    }
  }

  async stopBackgroundMusic(): Promise<void> {
    if (this.backgroundMusic) {
      console.log(`🎵 Stopping background music: ${this.currentMusicTrack}`);
      this.backgroundMusic.pause()
      this.backgroundMusic.remove()
      this.backgroundMusic = null
      this.currentMusicTrack = null
      console.log(`🎵 Background music stopped successfully`);
    }
  }

  async pauseBackgroundMusic(): Promise<void> {
    if (this.backgroundMusic && this.backgroundMusic.playing) {
      this.backgroundMusic.pause()
    }
  }

  async resumeBackgroundMusic(): Promise<void> {
    if (this.backgroundMusic && !this.backgroundMusic.playing) {
      this.backgroundMusic.play()
    }
  }

  isBackgroundMusicPlaying(): boolean {
    return this.backgroundMusic?.playing || false
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted
    if (muted && this.backgroundMusic) {
      this.stopBackgroundMusic()
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.5
    }
  }

  getVolume(): number {
    return this.volume
  }

  isMutedState(): boolean {
    return this.isMuted
  }

  getCurrentMusicTrack(): string | null {
    return this.currentMusicTrack
  }

  async cleanup(): Promise<void> {
    // Stop and remove all sounds
    for (const player of this.sounds.values()) {
      player.pause()
      player.remove()
    }
    this.sounds.clear()

    // Stop background music
    await this.stopBackgroundMusic()
  }
}

// Combine all sound effects into one array
export const SOUND_EFFECTS: SoundEffect[] = [
  ...uiSounds,
  ...gameSounds,
  ...musicTracks,
]

// Convenience functions
export const playSound = (soundId: string, volume?: number) => {
  SoundManager.getInstance().playSound(soundId, volume)
}

export const playBackgroundMusic = (trackId: string, source: string | any, loop?: boolean) => {
  SoundManager.getInstance().playBackgroundMusic(trackId, source, loop)
}

export const stopBackgroundMusic = () => {
  SoundManager.getInstance().stopBackgroundMusic()
}

export const pauseBackgroundMusic = () => {
  SoundManager.getInstance().pauseBackgroundMusic()
}

export const resumeBackgroundMusic = () => {
  SoundManager.getInstance().resumeBackgroundMusic()
}

export const isBackgroundMusicPlaying = () => {
  return SoundManager.getInstance().isBackgroundMusicPlaying()
}

export const setSoundMuted = (muted: boolean) => {
  SoundManager.getInstance().setMuted(muted)
}

export const setSoundVolume = (volume: number) => {
  SoundManager.getInstance().setVolume(volume)
}

// Add default export
export default {
  playSound,
  playBackgroundMusic,
  stopBackgroundMusic,
  pauseBackgroundMusic,
  resumeBackgroundMusic,
  isBackgroundMusicPlaying,
  setSoundMuted,
  setSoundVolume
}; 