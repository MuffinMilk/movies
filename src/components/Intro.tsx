import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export default function Intro({ onComplete, backgroundUrl, logoUrl, title }: { onComplete: () => void; backgroundUrl?: string; logoUrl?: string; title?: string; key?: React.Key }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fallbackAudio = 'https://archive.org/download/kane-pixels-backrooms-unfinished-scraped-and-soundtracks/Project_Systems_Test.mp3';

    if (title) {
      const searchTerm = title + ' soundtrack';
      // Try to fetch a soundtrack from iTunes API
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
              setAudioUrl(data.results[0].previewUrl);
            } else {
              setAudioUrl(fallbackAudio);
            }
          }
        })
        .catch(() => {
          if (isMounted) setAudioUrl(fallbackAudio);
        });
    } else {
      setAudioUrl(fallbackAudio);
    }

    return () => {
      isMounted = false;
    };
  }, [title]);

  useEffect(() => {
    if (!audioUrl) return;

    // Play music
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    if (audioUrl === 'https://archive.org/download/kane-pixels-backrooms-unfinished-scraped-and-soundtracks/Project_Systems_Test.mp3') {
      audio.currentTime = 25; // Start 25 seconds in to get past the silent/slow intro
    }
    audioRef.current = audio;
    
    // Play on mount
    audio.play().catch(e => console.warn("Autoplay blocked for intro", e));

    // Fade out audio before complete
    const fadeOutDuration = 1000;
    const fadeOutStart = 3500;
    const initialVolume = 0.5;
    
    let fadeInterval: NodeJS.Timeout;
    const fadeTimer = setTimeout(() => {
      if (audioRef.current) {
        const steps = 20;
        const stepTime = fadeOutDuration / steps;
        const volumeStep = initialVolume / steps;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
          if (!audioRef.current) {
            clearInterval(fadeInterval);
            return;
          }
          currentStep++;
          const newVolume = Math.max(0, initialVolume - (volumeStep * currentStep));
          audioRef.current.volume = newVolume;
          
          if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audioRef.current.pause();
          }
        }, stepTime);
      }
    }, fadeOutStart);

    return () => {
      clearTimeout(fadeTimer);
      if (fadeInterval) clearInterval(fadeInterval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    // Total duration of the intro before fading out
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5 seconds for the intro
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      {/* Background Image */}
      {backgroundUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          <img 
            src={backgroundUrl} 
            alt="background" 
            className="w-full h-full object-cover saturate-50"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center px-4"
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={title || "Movie Logo"} 
            className="w-full max-w-[300px] md:max-w-[500px] object-contain drop-shadow-2xl"
          />
        ) : (
          <h1 className="text-5xl md:text-7xl font-black text-white text-center tracking-tighter drop-shadow-2xl">
            {title}
          </h1>
        )}
      </motion.div>
    </motion.div>
  );
}

