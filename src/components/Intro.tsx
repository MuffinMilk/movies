import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';

export default function Intro({ onComplete }: { onComplete: () => void; key?: React.Key }) {
  useEffect(() => {
    // Total duration of the intro before fading out
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <PlayCircle className="w-20 h-20 text-teal-400 mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
        </motion.div>
        
        <div className="overflow-hidden pb-2">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600 tracking-tighter"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Awdrex
          </motion.h1>
        </div>
        
        <motion.div 
          className="h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mt-6 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
