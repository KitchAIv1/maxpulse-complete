/**
 * AudioPlayer - Handles audio playback with text synchronization
 * Follows .cursorrules: Single responsibility, <150 lines, focused component
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Language } from '../../services/OnboardingManager';

interface AudioPlayerProps {
  audioEn: string;
  audioTl: string;
  transcriptEn: string;
  transcriptTl: string;
  language: Language;
  autoPlay: boolean;
  onAudioEnd?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioEn,
  audioTl,
  transcriptEn,
  transcriptTl,
  language,
  autoPlay,
  onAudioEnd,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAudio = language === 'en' ? audioEn : audioTl;
  const currentTranscript = language === 'en' ? transcriptEn : transcriptTl;

  // Handle audio loading and playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudio) return;

    setIsLoading(true);
    setError(null);

    const handleCanPlay = () => {
      console.log('🎵 AudioPlayer: Audio can play, ready state:', audio.readyState);
      setIsLoading(false);
      // Auto-play is now disabled by default, so we don't auto-play here
    };

    const handleEnded = () => {
      console.log('🎵 AudioPlayer: Audio playback ended');
      setIsPlaying(false);
      onAudioEnd?.();
    };

    const handleError = (e) => {
      console.error('🎵 AudioPlayer: Audio loading error:', e);
      setIsLoading(false);
      setError('Failed to load audio');
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Load new audio source
    console.log('🎵 AudioPlayer: Loading audio source:', currentAudio);
    audio.src = currentAudio;
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentAudio]);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log('🎵 AudioPlayer: No audio element found');
      return;
    }

    console.log('🎵 AudioPlayer: Attempting to play audio:', currentAudio);
    console.log('🎵 AudioPlayer: Audio element ready state:', audio.readyState);
    console.log('🎵 AudioPlayer: Audio element src:', audio.src);
    console.log('🎵 AudioPlayer: Audio element volume:', audio.volume);
    console.log('🎵 AudioPlayer: Audio element muted:', audio.muted);
    console.log('🎵 AudioPlayer: Audio element duration:', audio.duration);

    try {
      // Ensure volume is set and not muted
      audio.volume = 1.0;
      audio.muted = false;
      
      await audio.play();
      setIsPlaying(true);
      setError(null);
      console.log('🎵 AudioPlayer: Audio started playing successfully');
      
      // Log playback progress
      setTimeout(() => {
        console.log('🎵 AudioPlayer: Current time after 1 second:', audio.currentTime);
      }, 1000);
    } catch (err) {
      console.error('🎵 AudioPlayer: Failed to play audio:', err);
      setError(`Failed to play audio: ${err.message}`);
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio, pauseAudio]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
      />

      {/* Audio Controls */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        <button
          onClick={toggleMute}
          disabled={isLoading || !!error}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 text-sm text-gray-600">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : isLoading ? (
            <span>Loading audio...</span>
          ) : isPlaying ? (
            <span className="text-green-600">Playing...</span>
          ) : (
            <span>Click play to start audio</span>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div className="p-4 bg-white border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Transcript</span>
        </div>
        <p className="text-gray-800 leading-relaxed">
          {currentTranscript || 'No transcript available'}
        </p>
      </div>
    </div>
  );
};
