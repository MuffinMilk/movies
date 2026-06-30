import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

export default function CreditsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Info className="w-8 h-8 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                Credits
              </h2>
              
              <div className="text-gray-300 text-sm md:text-base leading-relaxed text-left w-full space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <span className="font-bold text-white block mb-1">OWNER:</span>
                  awdre puente
                </div>
                <div>
                  <span className="font-bold text-white block mb-1">CODER:</span>
                  awdre puente
                </div>
                <div>
                  <span className="font-bold text-white block mb-1">MEDIA & PHOTOS:</span>
                  TMDB (The Movie Database) and various other providers for images and metadata.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-lg font-bold text-sm md:text-base bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/10"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
