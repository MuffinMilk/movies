import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export default function WarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('hasSeenWarning');
    if (!hasSeenWarning) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  const handleAccept = () => {
    if (countdown === 0) {
      localStorage.setItem('hasSeenWarning', 'true');
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                WARNING READ THIS IF YOUR IN CLASS
              </h2>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-left">
                if your in class rn just put your computer on low volume because each movie has sound just please and if you get caught im not responsiable i recommend you to use a proxy (a website that can let you search anything up) and watch the movies from there some movies may be low quilaty bc it was recorded in the movies thanks for using my website -awdrex
              </p>

              <button
                onClick={handleAccept}
                disabled={countdown > 0}
                className={`w-full py-3 px-6 rounded-lg font-bold text-sm md:text-base transition-all duration-300 ${
                  countdown > 0
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                }`}
              >
                {countdown > 0 ? `Wait ${countdown}s` : 'ok awdrex'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
