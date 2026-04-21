
import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={skipForward}
      />
      
      <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            src={currentTrack.cover}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {isPlaying && (
          <div className="absolute bottom-4 left-4 flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 6, 16, 4] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-1 bg-cyan-400"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="truncate font-sans text-lg font-bold text-white tracking-tight">{currentTrack.title}</h3>
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/60">{currentTrack.artist}</p>
      </div>

      <div className="mb-6 group">
        <div className="relative h-1 w-full rounded-full bg-white/10">
          <motion.div 
            className="absolute h-full rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-white/40 hover:text-white transition-colors">
            <Volume2 size={20} />
        </button>
        
        <div className="flex items-center gap-6">
          <button onClick={skipBack} className="text-white/60 hover:text-cyan-400 transition-colors">
            <SkipBack size={28} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-95"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={skipForward} className="text-white/60 hover:text-cyan-400 transition-colors">
            <SkipForward size={28} />
          </button>
        </div>

        <button className="text-white/40 hover:text-white transition-colors">
            <Music size={20} />
        </button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">A.I. Generated Beats</span>
      </div>
    </div>
  );
};

export default MusicPlayer;
