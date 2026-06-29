import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  pauseForVideo: () => void;
  resumeFromVideo: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleAudio: () => {},
  pauseForVideo: () => {},
  resumeFromVideo: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Wii Mii Channel Music from a public GitHub repo
    const audio = new Audio('https://raw.githubusercontent.com/wisecomputerit/wii-02.-Mii-Channel-Intro.mp3/main/02.%20Mii%20Channel%20Intro.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const handleInteraction = () => {
      if (!audioRef.current || !audioRef.current.paused) return;
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        // Remove listeners once we successfully start playing
        ['click', 'pointerdown', 'keydown'].forEach(event => 
          document.removeEventListener(event, handleInteraction, { capture: true })
        );
      }).catch((e) => {
        console.warn("Autoplay blocked, waiting for next interaction", e);
      });
    };

    // Add listeners to play audio on first user interaction (browser autoplay policy)
    ['click', 'pointerdown', 'keydown'].forEach(event => 
      document.addEventListener(event, handleInteraction, { capture: true })
    );

    return () => {
      ['click', 'pointerdown', 'keydown'].forEach(event => 
        document.removeEventListener(event, handleInteraction, { capture: true })
      );
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isVideoPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isVideoPlaying]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const pauseForVideo = () => setIsVideoPlaying(true);
  const resumeFromVideo = () => setIsVideoPlaying(false);

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, pauseForVideo, resumeFromVideo }}>
      {children}
    </AudioContext.Provider>
  );
};
