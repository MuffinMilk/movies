import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProfileSelector from './components/ProfileSelector';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Show from './pages/Show';
import Search from './pages/Search';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import Anime from './pages/Anime';
import Live from './pages/Live';
import WarningModal from './components/WarningModal';

export default function App() {
  const [showProfileSelector, setShowProfileSelector] = useState(true);

  return (
    <Router>
      <div className="bg-[#0a0a0a] text-gray-200 font-sans selection:bg-white/30 min-h-screen relative overflow-x-hidden">
        {showProfileSelector && (
          <ProfileSelector
            onSelectProfile={() => setShowProfileSelector(false)}
            onCancel={() => setShowProfileSelector(false)}
          />
        )}
        <Header onOpenProfiles={() => setShowProfileSelector(true)} />
        <main className="w-full min-h-screen">
          <WarningModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<Live />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/library" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/show/:id" element={<Show />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
