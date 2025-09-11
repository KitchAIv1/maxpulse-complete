import React from 'react';
import { Button } from '../ui/button';
import { 
  Play, 
  Pause,
  Volume2,
  Settings,
  Maximize,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { formatTime } from '../utils/learningHelpers';

interface VideoPlayerProps {
  moduleData: {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onComplete: () => void;
}

export function VideoPlayer({ 
  moduleData, 
  isPlaying, 
  currentTime, 
  duration, 
  onTogglePlay, 
  onComplete 
}: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-gray-900 rounded-lg relative mb-4">
      {/* Mock Video Player */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl mb-2">{moduleData.title}</h3>
          <p className="text-gray-300">Video content would appear here</p>
        </div>
      </div>
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-white text-sm">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div 
                className="bg-brand-primary h-1 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}