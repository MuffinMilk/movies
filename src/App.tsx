/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Show from './pages/Show';
import Search from './pages/Search';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import Anime from './pages/Anime';
import Intro from './components/Intro';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro once per session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    return !hasSeenIntro;
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showIntro && <Intro key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>
      
      <div className="flex bg-[#0f0f0f] text-gray-200 font-sans selection:bg-white/30 min-h-screen pt-4 pb-12">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 w-full min-w-0 pr-4 lg:pr-6 pl-4 md:pl-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/show/:id" element={<Show />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
