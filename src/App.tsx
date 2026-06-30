/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Show from './pages/Show';
import Search from './pages/Search';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import Anime from './pages/Anime';
import WarningModal from './components/WarningModal';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex bg-[#0f0f0f] text-gray-200 font-sans selection:bg-white/30 min-h-screen pt-4 pb-12">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 w-full min-w-0 pr-4 md:pr-6 pt-4 transition-all duration-300 ${sidebarCollapsed ? 'pl-4 md:pl-28' : 'pl-4 md:pl-72'}`}>
          <WarningModal />
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
