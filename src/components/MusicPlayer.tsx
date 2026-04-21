"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Music4 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music/song.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      let vol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          clearInterval(fadeOut);
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.volume = 0;
        } else {
          if (audioRef.current) audioRef.current.volume = vol;
        }
      }, 50);
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => console.error("Audio playback blocked"));
      
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol += 0.02;
        if (vol >= 0.3) {
          clearInterval(fadeIn);
          if (audioRef.current) audioRef.current.volume = 0.3;
        } else {
          if (audioRef.current) audioRef.current.volume = vol;
        }
      }, 50);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className={cn(
        "fixed bottom-6 right-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-full border border-[#f4a0b5]/25 bg-[#0d0810]/85 text-[#f4a0b5] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#f4a0b5]/10 hover:shadow-[0_0_24px_rgba(244,160,181,0.25)]",
        isPlaying && "animate-pulse shadow-[0_0_20px_rgba(244,160,181,0.45)]"
      )}
      aria-label="Toggle music"
    >
      {isPlaying ? <Music className="h-5 w-5" /> : <Music4 className="h-5 w-5" />}
    </button>
  );
}
