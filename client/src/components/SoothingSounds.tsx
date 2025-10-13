import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  emoji: string;
  url: string;
  description: string;
}

const sounds: Sound[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    emoji: '🌧️',
    url: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
    description: 'Soft rainfall to calm your mind'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    emoji: '🌊',
    url: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
    description: 'Peaceful waves washing ashore'
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    emoji: '🌲',
    url: 'https://www.soundjay.com/nature/sounds/forest-1.mp3',
    description: 'Birds chirping in the trees'
  },
  {
    id: 'stream',
    name: 'Flowing Stream',
    emoji: '💧',
    url: 'https://www.soundjay.com/nature/sounds/stream-1.mp3',
    description: 'Gentle water flowing'
  }
];

export default function SoothingSounds() {
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (!audioRef.current || !selectedSound) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSoundSelect = (sound: Sound) => {
    if (selectedSound?.id === sound.id) {
      // Same sound clicked - toggle play/pause
      handlePlayPause();
    } else {
      // New sound selected
      setSelectedSound(sound);
      setIsPlaying(true);
      // Audio will play via useEffect when src changes
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Auto-play when sound changes
  useEffect(() => {
    if (selectedSound && audioRef.current && isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Audio play failed:', err);
        setIsPlaying(false);
      });
    }
  }, [selectedSound, isPlaying]);

  return (
    <div className="animate-in fade-in duration-500" data-testid="soothing-sounds">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">Soothing Sounds</h3>
          <p className="text-sm text-warm-gray-600">
            Choose calming nature sounds to help you relax and find peace
          </p>
        </div>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {sounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => handleSoundSelect(sound)}
              className={`p-4 rounded-xl transition-all ${
                selectedSound?.id === sound.id
                  ? 'bg-blush-400 text-white shadow-lg scale-105'
                  : 'bg-white text-warm-gray-700 hover:bg-blush-50 hover:shadow-md'
              }`}
              data-testid={`sound-${sound.id}`}
            >
              <div className="text-3xl mb-2">{sound.emoji}</div>
              <div className="text-sm font-medium">{sound.name}</div>
            </button>
          ))}
        </div>

        {/* Player Controls */}
        {selectedSound && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-warm-gray-800">{selectedSound.name}</h4>
                <p className="text-xs text-warm-gray-600">{selectedSound.description}</p>
              </div>
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-blush-400 hover:bg-blush-500 text-white flex items-center justify-center transition-colors ml-4"
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="text-warm-gray-600 hover:text-blush-400 transition-colors"
                data-testid="button-mute"
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-blush-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #F9A8D4 0%, #F9A8D4 ${(isMuted ? 0 : volume) * 100}%, #FDE2E4 ${(isMuted ? 0 : volume) * 100}%, #FDE2E4 100%)`
                }}
                data-testid="volume-slider"
              />
              <span className="text-xs text-warm-gray-600 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        )}

        {!selectedSound && (
          <div className="text-center py-8 text-warm-gray-500">
            <p className="text-sm">Select a sound above to begin</p>
          </div>
        )}

        {/* Hidden Audio Element */}
        {selectedSound && (
          <audio
            ref={audioRef}
            src={selectedSound.url}
            loop
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              console.error('Audio error');
              setIsPlaying(false);
            }}
          />
        )}
      </div>

      <p className="text-xs text-center text-warm-gray-500 mt-3">
        💡 Tip: Adjust volume and let these sounds wash over you
      </p>
    </div>
  );
}
