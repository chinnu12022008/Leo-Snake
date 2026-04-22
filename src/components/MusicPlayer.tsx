import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'NEURAL_ALPHA.WAV', artist: 'AI_CORE_01', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'DEEP_LEARNING.WAV', artist: 'AI_CORE_02', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'CYBER_HARM.WAV', artist: 'AI_CORE_03', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.4);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) {
        setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  useEffect(() => {
     if (isPlaying && audioRef.current) {
         audioRef.current.play().catch(e => console.error("Playback prevented by browser:", e));
     }
  }, [currentTrack, isPlaying]);

  return (
    <footer className="h-auto md:h-[90px] w-full bg-black border-t-[4px] border-[#00FFFF] flex flex-col md:flex-row items-center px-4 md:px-8 py-4 md:py-0 gap-4 md:gap-8 shrink-0 z-30 relative overflow-hidden">
        {/* Background glitch effect when playing */}
        {isPlaying && <div className="absolute inset-0 bg-transparent opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FF00FF 25%, transparent 25%, transparent 75%, #00FFFF 75%, #00FFFF), repeating-linear-gradient(45deg, #FF00FF 25%, black 25%, black 75%, #00FFFF 75%, #00FFFF)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '10px 10px' }}></div>}
        
        <audio 
            ref={audioRef} 
            src={TRACKS[currentTrack].url} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
        />
        
        <div className="w-full md:w-[260px] shrink-0 text-center md:text-left z-10 p-2 border-[2px] border-[#FF00FF] bg-black">
            <div className="font-bold text-[14px] mb-1 text-[#00FFFF] tracking-widest uppercase">{TRACKS[currentTrack].title}</div>
            <div className="text-[12px] text-[#FF00FF] tracking-widest">{TRACKS[currentTrack].artist}</div>
        </div>
        
        <div className="flex items-center justify-center gap-2 shrink-0 z-10">
            <button onClick={prevTrack} className="w-12 h-10 bg-transparent border-[2px] border-[#00FFFF] text-[#00FFFF] flex items-center justify-center cursor-crosshair hover:bg-[#00FFFF] hover:text-black transition-none">
                <SkipBack size={18} className="fill-current -ml-1" />
            </button>
            <button onClick={togglePlay} className="w-16 h-12 bg-[#FF00FF] text-black border-[2px] border-[#00FFFF] flex items-center justify-center cursor-crosshair hover:invert transition-none shadow-[4px_4px_0_#00FFFF]">
                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="w-12 h-10 bg-transparent border-[2px] border-[#00FFFF] text-[#00FFFF] flex items-center justify-center cursor-crosshair hover:bg-[#00FFFF] hover:text-black transition-none">
                <SkipForward size={18} className="fill-current ml-1" />
            </button>
        </div>
        
        <div className="flex-1 w-full h-[16px] bg-black border-[2px] border-[#333] relative cursor-crosshair group mt-2 md:mt-0 flex items-center z-10 relative overflow-hidden"
             onClick={(e) => {
                 if (!audioRef.current) return;
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickX = e.clientX - rect.left;
                 const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                 audioRef.current.currentTime = percentage * audioRef.current.duration;
             }}>
             <div className="h-full bg-[#00FFFF] border-r-[4px] border-[#FF00FF] pointer-events-none" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="w-[120px] flex items-center gap-3 shrink-0 hidden md:flex z-10 p-2 border-[2px] border-[#333] bg-black">
             <Volume2 size={16} className="text-[#FF00FF]" />
             <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-black border-[1px] border-[#00FFFF] appearance-none cursor-crosshair accent-[#FF00FF] focus:outline-none" />
        </div>
    </footer>
  );
}
